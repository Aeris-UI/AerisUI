import assert from 'node:assert/strict';
import test from 'node:test';

import { waitForPublishedPackage } from './release-publish-verification.mjs';

const name = '@aeris-ui/core';
const version = '22.0.0-alpha.2';
const npmTag = 'next';

test('retries until the published version and dist-tag have propagated', async () => {
  let publishedChecks = 0;
  let waits = 0;

  const result = await waitForPublishedPackage({
    name,
    version,
    npmTag,
    attempts: 4,
    delayMs: 0,
    viewVersion(specifier) {
      if (specifier === `${name}@${version}`) {
        publishedChecks += 1;
        return publishedChecks >= 3 ? version : undefined;
      }
      return publishedChecks >= 3 ? version : '22.0.0-alpha.1';
    },
    wait() {
      waits += 1;
      return Promise.resolve();
    },
  });

  assert.deepEqual(result, {
    verified: true,
    attempts: 3,
    publishedVersion: version,
    taggedVersion: version,
  });
  assert.equal(waits, 2);
});

test('returns the last observed registry state after bounded retries', async () => {
  let waits = 0;

  const result = await waitForPublishedPackage({
    name,
    version,
    npmTag,
    attempts: 3,
    delayMs: 0,
    viewVersion(specifier) {
      return specifier === `${name}@${npmTag}` ? '22.0.0-alpha.1' : undefined;
    },
    wait() {
      waits += 1;
      return Promise.resolve();
    },
  });

  assert.deepEqual(result, {
    verified: false,
    attempts: 3,
    publishedVersion: undefined,
    taggedVersion: '22.0.0-alpha.1',
  });
  assert.equal(waits, 2);
});

test('rejects invalid retry configuration', async () => {
  await assert.rejects(
    waitForPublishedPackage({
      name,
      version,
      npmTag,
      attempts: 0,
      viewVersion: () => version,
    }),
    /positive integer/,
  );
});
