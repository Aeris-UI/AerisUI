import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { gzipSync } from 'node:zlib';
import { test } from 'node:test';

function runCheck(change = () => {}) {
  const directory = mkdtempSync(join(tmpdir(), 'aeris-library-budget-'));
  try {
    mkdirSync(join(directory, 'tools'));
    mkdirSync(join(directory, 'dist/aeris-ui/fesm2022'), { recursive: true });
    const sources = {
      'aeris-ui-core-toolbar.mjs': '/* ɵɵngDeclareComponent */',
      'aeris-ui-core.mjs': 'export const value = 1;',
    };
    const sizes = Object.fromEntries(
      Object.entries(sources).map(([name, source]) => [
        name,
        { raw: Buffer.byteLength(source), gzip: gzipSync(source, { level: 9 }).length },
      ]),
    );
    const budget = (baseline) => ({
      baseline,
      raw: baseline.raw + 4096,
      gzip: baseline.gzip + 1024,
    });
    const budgets = {
      total: budget(
        Object.values(sizes).reduce(
          (sum, size) => ({ raw: sum.raw + size.raw, gzip: sum.gzip + size.gzip }),
          { raw: 0, gzip: 0 },
        ),
      ),
      largestEntryPoint: budget({
        raw: Math.max(...Object.values(sizes).map((s) => s.raw)),
        gzip: Math.max(...Object.values(sizes).map((s) => s.gzip)),
      }),
      entryPoints: Object.fromEntries(
        Object.entries(sizes).map(([name, size]) => [name, budget(size)]),
      ),
    };
    change(sources, budgets);
    for (const file of ['check-bundle-size.mjs', 'performance-budget.mjs'])
      writeFileSync(join(directory, 'tools', file), readFileSync(new URL(file, import.meta.url)));
    writeFileSync(
      join(directory, 'tools/library-performance-budgets.json'),
      JSON.stringify(budgets),
    );
    for (const [name, source] of Object.entries(sources))
      writeFileSync(join(directory, 'dist/aeris-ui/fesm2022', name), source);
    return spawnSync(process.execPath, ['tools/check-bundle-size.mjs'], {
      cwd: directory,
      encoding: 'utf8',
    });
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

test('production entry points produce a passing report', () => {
  const result = runCheck();
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Performance report:/);
});
test('development output is rejected before size comparisons', () => {
  const result = runCheck((sources) => {
    sources['aeris-ui-core-toolbar.mjs'] = 'ɵɵdefineComponent';
  });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /production partial-compilation build/);
});
test('new and missing entry points require explicit review', () => {
  for (const action of ['new', 'missing']) {
    const result = runCheck((sources) => {
      if (action === 'new') sources['new.mjs'] = 'export const added = 1;';
      else delete sources['aeris-ui-core.mjs'];
    });
    assert.equal(result.status, 1);
    assert.match(result.stderr, /needs a reviewed production baseline|required bundle.*missing/i);
  }
});
test('a hard package ceiling still fails', () => {
  const result = runCheck((_sources, budgets) => {
    budgets.total = { raw: 0, baseline: { raw: 0 } };
  });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /above.*budget/);
});
