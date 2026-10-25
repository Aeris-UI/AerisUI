import { strict as assert } from 'node:assert';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { test } from 'node:test';
import { gzipSync } from 'node:zlib';
import { budgetRows } from './performance-budget.mjs';

const checker = readFileSync(new URL('./check-doc-performance.mjs', import.meta.url), 'utf8');

function runCheck(change = () => {}) {
  const directory = mkdtempSync(join(tmpdir(), 'aeris-doc-budget-'));
  try {
    mkdirSync(join(directory, 'tools'));
    mkdirSync(join(directory, 'dist/docs/browser'), { recursive: true });
    const sources = {
      'main.js': '/* main */',
      'shared.js': '/* shared */',
      'catalog.js': '/* catalog */',
      'preview.js': '/* preview */',
      'styles.css': 'body{margin:0}',
    };
    const imports = (...paths) => paths.map((path) => ({ path, kind: 'import-statement' }));
    const stats = {
      outputs: {
        'main.js': { entryPoint: 'projects/docs/src/main.ts', imports: imports('shared.js') },
        'shared.js': { imports: [] },
        'catalog.js': {
          inputs: { 'projects/docs/src/app/pages/component-catalog.page.ts': {} },
          imports: imports('shared.js'),
        },
        'preview.js': {
          inputs: { 'projects/docs/src/app/shared/catalog/catalog-form-preview.component.ts': {} },
          imports: imports('shared.js', 'catalog.js'),
        },
        'styles.css': { entryPoint: 'angular:styles/global:styles' },
      },
    };
    const size = (...names) => {
      const measured = {
        raw: names.reduce((sum, name) => sum + Buffer.byteLength(sources[name]), 0),
        gzip: names.reduce(
          (sum, name) => sum + gzipSync(sources[name], { level: 9 }).byteLength,
          0,
        ),
      };
      return { ...measured, baseline: { ...measured } };
    };
    const budgets = {
      initialJavaScript: size('main.js', 'shared.js'),
      globalStyles: size('styles.css'),
      catalogRoute: size('catalog.js'),
      catalogPreviews: size('catalog.js', 'preview.js'),
    };
    change(stats, budgets);
    writeFileSync(join(directory, 'tools/check-doc-performance.mjs'), checker);
    writeFileSync(
      join(directory, 'tools/performance-budget.mjs'),
      readFileSync(new URL('./performance-budget.mjs', import.meta.url), 'utf8'),
    );
    writeFileSync(join(directory, 'tools/doc-performance-budgets.json'), JSON.stringify(budgets));
    writeFileSync(join(directory, 'dist/docs/browser-stats.json'), JSON.stringify(stats));
    for (const [name, source] of Object.entries(sources))
      writeFileSync(join(directory, 'dist/docs/browser', name), source);
    return spawnSync(process.execPath, ['tools/check-doc-performance.mjs'], {
      cwd: directory,
      encoding: 'utf8',
    });
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

test('catalog budgets exclude initial assets and count shared preview imports once', () => {
  const result = runCheck();
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Catalog route:/);
  assert.match(result.stdout, /all preview families:/);
});

test('catalog preview growth fails the build budget', () => {
  const result = runCheck((_stats, budgets) => {
    budgets.catalogPreviews.raw = 0;
    budgets.catalogPreviews.baseline.raw = 0;
  });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Catalog with every deferred preview.*above/);
});

test('a missing catalog or preview graph fails instead of bypassing its budget', () => {
  for (const name of ['catalog.js', 'preview.js']) {
    const result = runCheck((stats) => {
      delete stats.outputs[name].inputs;
    });
    assert.equal(result.status, 1);
    assert.match(result.stderr, /catalog output is missing|Catalog preview outputs are missing/);
  }
});

test('Angular initial budgets match the reviewed combined JavaScript and CSS budget', () => {
  const angular = JSON.parse(readFileSync(new URL('../angular.json', import.meta.url), 'utf8'));
  const budgets = JSON.parse(
    readFileSync(new URL('./doc-performance-budgets.json', import.meta.url), 'utf8'),
  );
  const initial = angular.projects.docs.architect.build.configurations.production.budgets.find(
    (budget) => budget.type === 'initial',
  );
  const [row] = budgetRows('Initial', budgets.initialTotal.baseline, budgets.initialTotal);
  assert.equal(initial.maximumError, `${row.limit}b`);
  assert.equal(initial.maximumWarning, `${row.warning}b`);
});
