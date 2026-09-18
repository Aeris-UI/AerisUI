import assert from 'node:assert/strict';
import test from 'node:test';

import { waitForPublishedPackages } from './release-publish-verification.mjs';

const names = ['@aeris-ui/core', '@aeris-ui/mcp'];
const version = '22.0.0-alpha.2';
const npmTag = 'next';

test('retries until every package version and dist-tag have propagated', async () => {
  const publishedChecks = new Map(names.map((name) => [name, 0]));
  let waits = 0;

  const result = await waitForPublishedPackages({
    names,
    version,
    npmTag,
    attempts: 4,
    delayMs: 0,
    viewVersion(specifier) {
      const name = names.find((candidate) => specifier.startsWith(`${candidate}@`));
      if (!name) return undefined;
      const requiredChecks = name === '@aeris-ui/core' ? 2 : 4;
      if (specifier === `${name}@${version}`) {
        const checks = (publishedChecks.get(name) ?? 0) + 1;
        publishedChecks.set(name, checks);
        return checks >= requiredChecks ? version : undefined;
      }
      return (publishedChecks.get(name) ?? 0) >= requiredChecks
        ? version
        : '22.0.0-alpha.1';
    },
    wait() {
      waits += 1;
      return Promise.resolve();
    },
  });

  assert.deepEqual(result, {
    verified: true,
    attempts: 4,
    packages: names.map((name) => ({
      name,
      verified: true,
      publishedVersion: version,
      taggedVersion: version,
    })),
  });
  assert.equal(waits, 3);
});

test('returns the last observed registry state after bounded retries', async () => {
  let waits = 0;

  const result = await waitForPublishedPackages({
    names,
    version,
    npmTag,
    attempts: 3,
    delayMs: 0,
    viewVersion(specifier) {
      return specifier.endsWith(`@${npmTag}`) ? '22.0.0-alpha.1' : undefined;
    },
    wait() {
      waits += 1;
      return Promise.resolve();
    },
  });

  assert.deepEqual(result, {
    verified: false,
    attempts: 3,
    packages: names.map((name) => ({
      name,
      verified: false,
      publishedVersion: undefined,
      taggedVersion: '22.0.0-alpha.1',
    })),
  });
  assert.equal(waits, 2);
});

test('rejects invalid retry configuration', async () => {
  await assert.rejects(
    waitForPublishedPackages({
      names,
      version,
      npmTag,
      attempts: 0,
      viewVersion: () => version,
    }),
    /positive integer/,
  );
});

test('requires at least one package name', async () => {
  await assert.rejects(
    waitForPublishedPackages({
      names: [],
      version,
      npmTag,
      viewVersion: () => version,
    }),
    /at least one package name/,
  );
});
