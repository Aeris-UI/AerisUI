const SEMVER_PATTERN =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/;

export function resolveReleaseMetadata({ coreVersion, mcpVersion, releaseTag, releasePrerelease }) {
  if (coreVersion !== mcpVersion) {
    throw new Error(`Core ${coreVersion} does not match MCP ${mcpVersion}.`);
  }

  const versionMatch = SEMVER_PATTERN.exec(coreVersion);
  if (!versionMatch || hasInvalidNumericPrerelease(versionMatch[4])) {
    throw new Error(`Aeris version ${coreVersion} is not valid semantic versioning.`);
  }

  const expectedTag = `v${coreVersion}`;
  if (releaseTag !== expectedTag) {
    throw new Error(`Release tag ${releaseTag} must exactly match ${expectedTag}.`);
  }

  const prerelease = versionMatch[4] !== undefined;
  if (releasePrerelease !== undefined && releasePrerelease !== prerelease) {
    const expectedState = prerelease ? 'a prerelease' : 'a stable release';
    throw new Error(`${releaseTag} must be marked as ${expectedState} on GitHub.`);
  }

  return {
    version: coreVersion,
    major: versionMatch[1],
    releaseTag,
    prerelease,
    npmTag: prerelease ? 'next' : 'latest',
  };
}

function hasInvalidNumericPrerelease(prerelease) {
  return prerelease
    ?.split('.')
    .some(
      (identifier) => /^\d+$/.test(identifier) && identifier.length > 1 && identifier[0] === '0',
    );
}
