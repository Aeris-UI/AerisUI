import { appendFileSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { resolveReleaseMetadata } from './release-metadata.mjs';

const arguments_ = parseArguments(process.argv.slice(2));
const releaseTag = arguments_.tag ?? process.env.RELEASE_TAG;
const releasePrerelease = parseBoolean(arguments_.prerelease ?? process.env.RELEASE_PRERELEASE);

if (!releaseTag) {
  throw new Error('Provide the GitHub release tag through --tag or RELEASE_TAG.');
}

const corePackage = readJson(resolve('projects/aeris-ui/package.json'));
const mcpPackage = readJson(resolve('projects/aeris-mcp/package.json'));
const metadata = resolveReleaseMetadata({
  coreVersion: corePackage.version,
  mcpVersion: mcpPackage.version,
  releaseTag,
  releasePrerelease,
});

const githubOutput = process.env.GITHUB_OUTPUT;
if (githubOutput) {
  for (const [key, value] of Object.entries({
    version: metadata.version,
    major: metadata.major,
    npm_tag: metadata.npmTag,
  })) {
    appendFileSync(githubOutput, `${key}=${value}\n`);
  }
}

process.stdout.write(
  `Verified ${metadata.releaseTag} for Core and MCP ${metadata.version}; npm tag: ${metadata.npmTag}.\n`,
);

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function parseArguments(values) {
  const result = {};

  for (let index = 0; index < values.length; index += 1) {
    const argument = values[index];
    if (!argument.startsWith('--')) {
      throw new Error(`Unexpected release argument ${argument}.`);
    }

    const name = argument.slice(2);
    const value = values[index + 1];
    if (!value || value.startsWith('--')) {
      throw new Error(`Release argument --${name} requires a value.`);
    }

    result[name] = value;
    index += 1;
  }

  return result;
}

function parseBoolean(value) {
  if (value === undefined) return undefined;
  if (value === true || value === 'true') return true;
  if (value === false || value === 'false') return false;
  throw new Error(`Expected true or false for release prerelease state, received ${value}.`);
}
