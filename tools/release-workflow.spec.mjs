import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const workflowPath = new URL('../.github/workflows/release.yml', import.meta.url);

test('browser CI builds once and requires every bounded shard without reducing coverage', async () => {
  const workflow = (
    await readFile(new URL('../.github/workflows/ci.yml', import.meta.url), 'utf8')
  ).replaceAll('\r\n', '\n');
  const config = await readFile(new URL('../playwright.config.ts', import.meta.url), 'utf8');
  assert.equal((workflow.match(/npm run build:browser-apps/g) ?? []).length, 1);
  assert.match(workflow, /shard: \[1, 2, 3, 4, 5, 6, 7, 8\]/);
  assert.match(workflow, /fail-fast: false/);
  assert.match(
    workflow,
    /npm run test:e2e:critical -- --shard=\$\{\{ matrix.shard \}\}\/8 --workers=2 --global-timeout=900000/,
  );
  assert.match(
    workflow,
    /name: browser\n\s+if: always\(\)\n\s+needs: \[browser-build, browser-tests\]/,
  );
  assert.match(workflow, /BUILD_RESULT: \$\{\{ needs.browser-build.result \}\}/);
  assert.match(workflow, /TEST_RESULT: \$\{\{ needs.browser-tests.result \}\}/);
  assert.match(workflow, /"\$BUILD_RESULT" != "success" \|\| "\$TEST_RESULT" != "success"/);
  assert.match(workflow, /name: Upload browser reports\n\s+if: always\(\)/);
  assert.match(config, /retries: 0/);
  assert.match(config, /video: 'off'/);
  assert.match(config, /trace: 'retain-on-failure'/);
});

test('deploys the documentation without running package or browser verification on Vercel', async () => {
  const manifest = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
  const deployment = JSON.parse(await readFile(new URL('../vercel.json', import.meta.url), 'utf8'));
  assert.equal(deployment.buildCommand, 'npm run build:site');
  assert.equal(
    manifest.scripts['build:site'],
    'npm run check:versions && npm run build:lib && npm run build:docs',
  );
  assert.ok(
    manifest.scripts.build.includes('npm run check:packed-install'),
    'The full release build must retain packed browser verification.',
  );
});

test('builds release artifacts before running tests that resolve package entry points', async () => {
  const workflow = await readFile(workflowPath, 'utf8');
  const buildIndex = workflow.indexOf('- name: Build and verify release');
  const libraryTestIndex = workflow.indexOf('- name: Test library');
  const documentationTestIndex = workflow.indexOf('- name: Test documentation');
  const packIndex = workflow.indexOf('- name: Pack release artifacts');

  assert.notEqual(buildIndex, -1, 'Release workflow must include the production build.');
  assert.notEqual(libraryTestIndex, -1, 'Release workflow must include library tests.');
  assert.notEqual(documentationTestIndex, -1, 'Release workflow must include documentation tests.');
  assert.notEqual(packIndex, -1, 'Release workflow must pack the verified artifacts.');
  assert.ok(
    buildIndex < libraryTestIndex,
    'The clean runner must build dist/aeris-ui before library tests resolve package entry points.',
  );
  assert.ok(
    buildIndex < documentationTestIndex,
    'The clean runner must build dist/aeris-ui before documentation tests run.',
  );
  assert.ok(
    documentationTestIndex < packIndex,
    'Release artifacts must only be packed after all test suites pass.',
  );
  const browserInstallIndex = workflow.indexOf('npx playwright install --with-deps chromium');
  assert.ok(
    browserInstallIndex > buildIndex && browserInstallIndex < workflow.indexOf('npm run build'),
    'Packed browser hydration requires Chromium before the full release build.',
  );
  assert.ok(
    workflow.includes('npm run check:minimum-angular'),
    'Release verification must cover the minimum supported Angular version.',
  );
});
