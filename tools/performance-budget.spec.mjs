import assert from 'node:assert/strict';
import { test } from 'node:test';
import { budgetRows } from './performance-budget.mjs';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

test('sub-kilobyte raw changes do not warn or mutate reviewed budgets', () => {
  const budget = { raw: 11000, baseline: { raw: 10000 } };
  assert.equal(budgetRows('Control', { raw: 10300 }, budget)[0].status, 'ok');
  assert.deepEqual(budget, { raw: 11000, baseline: { raw: 10000 } });
});

test('meaningful growth warns before the fixed ceiling and reports its delta', () => {
  const [row] = budgetRows(
    'Aggregate',
    { raw: 103000 },
    { raw: 105000, baseline: { raw: 100000 } },
  );
  assert.equal(row.status, 'warning');
  assert.equal(row.change, 3000);
  assert.equal(row.warning, 102000);
  assert.equal(
    budgetRows('Aggregate', { raw: 105001 }, { raw: 105000, baseline: { raw: 100000 } })[0].status,
    'error',
  );
});

test('compressed growth uses an absolute noise floor and improvements remain visible', () => {
  assert.equal(
    budgetRows('Small', { gzip: 2200 }, { gzip: 3100, baseline: { gzip: 2000 } })[0].status,
    'ok',
  );
  const [row] = budgetRows('Small', { gzip: 1800 }, { gzip: 3100, baseline: { gzip: 2000 } });
  assert.equal(row.change, -200);
});

test('invalid measurements and contradictory baselines cannot bypass checks', () => {
  assert.throws(() => budgetRows('Invalid', { raw: 1 }, {}), /Missing size thresholds/);
  assert.throws(() => budgetRows('Invalid', { raw: 1 }, { raw: 10 }), /Missing reviewed/);
  assert.throws(
    () => budgetRows('Invalid', { raw: NaN }, { raw: 10, baseline: { raw: 1 } }),
    /Invalid/,
  );
  assert.throws(
    () => budgetRows('Invalid', { raw: 1 }, { raw: 10, baseline: { raw: 11 } }),
    /Baseline exceeds/,
  );
  assert.equal(budgetRows('Zero', { raw: 1 }, { raw: 0, baseline: { raw: 0 } })[0].status, 'error');
});

test('checked-in baselines retain meaningful raw and compressed headroom', () => {
  for (const file of [
    'library-performance-budgets.json',
    'consumer-performance-budgets.json',
    'doc-performance-budgets.json',
  ]) {
    const config = JSON.parse(readFileSync(new URL(file, import.meta.url), 'utf8'));
    let count = 0;
    const visit = (value) => {
      if (!value || typeof value !== 'object') return;
      if ('raw' in value || 'gzip' in value) {
        count++;
        assert.ok(value.baseline, `${file}: reviewed baseline`);
        for (const metric of ['raw', 'gzip']) {
          assert.ok(Number.isFinite(value.baseline[metric]), `${file}: ${metric} baseline`);
          const floor = metric === 'raw' ? 4096 : 1024;
          assert.ok(
            value[metric] - value.baseline[metric] >=
              Math.max(value.baseline[metric] * 0.03, floor),
            `${file}: meaningful ${metric} headroom`,
          );
        }
      }
      for (const [key, child] of Object.entries(value)) if (key !== 'baseline') visit(child);
    };
    visit(config);
    assert.ok(count > 0, `${file}: measured budgets`);
  }
});

test('measurement-only mode cannot bypass CI checks', () => {
  const result = spawnSync(
    process.execPath,
    [fileURLToPath(new URL('./check-consumer-performance.mjs', import.meta.url)), '--measure-only'],
    {
      encoding: 'utf8',
      env: { ...process.env, CI: 'true' },
    },
  );
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Measurement-only mode cannot bypass CI/);
});

test('failures still produce reviewable JSON, Markdown and CI summaries', () => {
  const directory = mkdtempSync(join(tmpdir(), 'aeris-performance-report-'));
  try {
    mkdirSync(join(directory, 'tools'));
    writeFileSync(
      join(directory, 'tools/performance-budget.mjs'),
      readFileSync(new URL('./performance-budget.mjs', import.meta.url)),
    );
    writeFileSync(
      join(directory, 'tools/check.mjs'),
      `import {budgetRows, reportPerformance} from './performance-budget.mjs';
const rows=budgetRows('Basic', {raw: 12000}, {raw: 11000, baseline: {raw: 10000}});
if(!reportPerformance('consumer', rows)) process.exitCode=1;`,
    );
    const summary = join(directory, 'summary.md');
    const result = spawnSync(process.execPath, ['tools/check.mjs'], {
      cwd: directory,
      encoding: 'utf8',
      env: { ...process.env, GITHUB_STEP_SUMMARY: summary },
    });
    assert.equal(result.status, 1);
    const report = JSON.parse(
      readFileSync(join(directory, '.angular/performance-reports/consumer.json'), 'utf8'),
    );
    assert.equal(report.rows[0].change, 2000);
    assert.equal(report.rows[0].status, 'error');
    assert.match(readFileSync(summary, 'utf8'), /\+2000 B/);
    assert.match(
      readFileSync(join(directory, '.angular/performance-reports/consumer.md'), 'utf8'),
      /reviewed production baseline/,
    );
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});
