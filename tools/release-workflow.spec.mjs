import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const workflowPath = new URL('../.github/workflows/release.yml', import.meta.url);

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
});
