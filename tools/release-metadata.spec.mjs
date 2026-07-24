import assert from 'node:assert/strict';
import test from 'node:test';

import { resolveReleaseMetadata } from './release-metadata.mjs';

test('routes prereleases to the next npm tag', () => {
  const release = resolveReleaseMetadata({
    coreVersion: '22.0.0-alpha.2',
    mcpVersion: '22.0.0-alpha.2',
    releaseTag: 'v22.0.0-alpha.2',
    releasePrerelease: true,
  });

  assert.equal(release.npmTag, 'next');
  assert.equal(release.major, '22');
  assert.equal(release.prerelease, true);
});

test('routes stable releases to the latest npm tag', () => {
  const release = resolveReleaseMetadata({
    coreVersion: '22.0.0',
    mcpVersion: '22.0.0',
    releaseTag: 'v22.0.0',
    releasePrerelease: false,
  });

  assert.equal(release.npmTag, 'latest');
  assert.equal(release.prerelease, false);
});

test('rejects divergent package versions', () => {
  assert.throws(
    () =>
      resolveReleaseMetadata({
        coreVersion: '22.0.0-alpha.2',
        mcpVersion: '22.0.0-alpha.1',
        releaseTag: 'v22.0.0-alpha.2',
        releasePrerelease: true,
      }),
    /does not match MCP/,
  );
});

test('rejects a tag that does not exactly match the package version', () => {
  assert.throws(
    () =>
      resolveReleaseMetadata({
        coreVersion: '22.0.0-alpha.2',
        mcpVersion: '22.0.0-alpha.2',
        releaseTag: 'v22.0.0-alpha.3',
        releasePrerelease: true,
      }),
    /must exactly match/,
  );
});

test('rejects an incorrect GitHub prerelease state', () => {
  assert.throws(
    () =>
      resolveReleaseMetadata({
        coreVersion: '22.0.0-alpha.2',
        mcpVersion: '22.0.0-alpha.2',
        releaseTag: 'v22.0.0-alpha.2',
        releasePrerelease: false,
      }),
    /must be marked as a prerelease/,
  );
});

test('rejects invalid semantic versions', () => {
  assert.throws(
    () =>
      resolveReleaseMetadata({
        coreVersion: '22.0.0-alpha.01',
        mcpVersion: '22.0.0-alpha.01',
        releaseTag: 'v22.0.0-alpha.01',
        releasePrerelease: true,
      }),
    /not valid semantic versioning/,
  );
});
