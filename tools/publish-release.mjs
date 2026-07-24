import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const REGISTRY = 'https://registry.npmjs.org';
const arguments_ = parseArguments(process.argv.slice(2));
const version = arguments_.version;
const npmTag = arguments_.tag;

if (!version) throw new Error('Provide the release version with --version.');
if (!['next', 'latest'].includes(npmTag)) {
  throw new Error('Provide either next or latest with --tag.');
}

const corePackage = readJson(resolve('projects/aeris-ui/package.json'));
const mcpPackage = readJson(resolve('projects/aeris-mcp/package.json'));
if (corePackage.version !== version || mcpPackage.version !== version) {
  throw new Error(
    `Release ${version} does not match Core ${corePackage.version} and MCP ${mcpPackage.version}.`,
  );
}

const packages = [
  {
    name: '@aeris-ui/core',
    tarball: resolve(`dist/packages/aeris-ui-core-${version}.tgz`),
  },
  {
    name: '@aeris-ui/mcp',
    tarball: resolve(`dist/packages/aeris-ui-mcp-${version}.tgz`),
  },
];

for (const package_ of packages) {
  if (!existsSync(package_.tarball)) {
    throw new Error(`Missing release artifact ${package_.tarball}.`);
  }

  if (packageVersionExists(package_.name, version)) {
    const taggedVersion = viewVersion(`${package_.name}@${npmTag}`);
    if (taggedVersion !== version) {
      throw new Error(
        `${package_.name}@${version} already exists, but npm tag ${npmTag} points to ${taggedVersion ?? 'nothing'}. Correct the dist-tag manually before rerunning the workflow.`,
      );
    }

    process.stdout.write(
      `${package_.name}@${version} is already published with tag ${npmTag}; skipping.\n`,
    );
    continue;
  }

  runNpm(
    [
      'publish',
      package_.tarball,
      '--access',
      'public',
      '--tag',
      npmTag,
      '--registry',
      REGISTRY,
      '--ignore-scripts',
    ],
    'inherit',
  );

  const publishedVersion = viewVersion(`${package_.name}@${version}`);
  const taggedVersion = viewVersion(`${package_.name}@${npmTag}`);
  if (publishedVersion !== version || taggedVersion !== version) {
    throw new Error(`${package_.name}@${version} could not be verified after publishing.`);
  }

  process.stdout.write(`Published ${package_.name}@${version} with npm tag ${npmTag}.\n`);
}

function packageVersionExists(name, packageVersion) {
  const result = runNpm(
    ['view', `${name}@${packageVersion}`, 'version', '--json', '--registry', REGISTRY],
    'pipe',
    true,
  );

  if (result.status === 0) return parseVersion(result.stdout);

  const detail = `${result.stdout}\n${result.stderr}`;
  if (detail.includes('E404')) return false;
  throw new Error(`Could not inspect ${name}@${packageVersion}: ${detail.trim()}`);
}

function viewVersion(specifier) {
  const result = runNpm(
    ['view', specifier, 'version', '--json', '--registry', REGISTRY],
    'pipe',
    true,
  );
  if (result.status !== 0) {
    const detail = `${result.stdout}\n${result.stderr}`;
    if (detail.includes('E404')) return undefined;
    throw new Error(`Could not inspect ${specifier}: ${detail.trim()}`);
  }

  return parseVersion(result.stdout);
}

function parseVersion(value) {
  try {
    const parsed = JSON.parse(value);
    return typeof parsed === 'string' ? parsed : undefined;
  } catch {
    return value.trim() || undefined;
  }
}

function runNpm(npmArguments, stdio, allowFailure = false) {
  const bundledNpmExecutable = resolve(
    dirname(process.execPath),
    'node_modules/npm/bin/npm-cli.js',
  );
  const npmExecutable =
    process.env.npm_execpath ??
    (existsSync(bundledNpmExecutable) ? bundledNpmExecutable : undefined);
  const command = npmExecutable
    ? process.execPath
    : process.platform === 'win32'
      ? 'npm.cmd'
      : 'npm';
  const commandArguments = npmExecutable ? [npmExecutable, ...npmArguments] : npmArguments;
  const result = spawnSync(command, commandArguments, {
    cwd: process.cwd(),
    encoding: 'utf8',
    stdio,
    shell: !npmExecutable && process.platform === 'win32',
    env: {
      ...process.env,
      npm_config_cache: resolve('.angular/npm-cache'),
    },
  });

  if (result.error) throw result.error;
  if (!allowFailure && result.status !== 0) {
    throw new Error(`npm ${npmArguments[0]} failed with exit code ${result.status}.`);
  }
  return result;
}

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function parseArguments(values) {
  const result = {};
  for (let index = 0; index < values.length; index += 2) {
    const argument = values[index];
    const value = values[index + 1];
    if (!argument?.startsWith('--') || !value) {
      throw new Error(`Invalid release publishing arguments near ${argument ?? '(missing)'}.`);
    }
    result[argument.slice(2)] = value;
  }
  return result;
}
