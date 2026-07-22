import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const sourceDirectory = resolve('projects/aeris-ui');
const packageDirectory = resolve('dist/aeris-ui');
const workspaceManifestPath = resolve('package.json');
const sourceManifestPath = resolve(sourceDirectory, 'package.json');
const packageManifestPath = resolve(packageDirectory, 'package.json');

if (!existsSync(packageManifestPath)) {
  fail('The built package is missing. Run npm run build:lib before npm run check:package.');
}

const workspaceManifest = readJson(workspaceManifestPath);
const sourceManifest = readJson(sourceManifestPath);
const packageManifest = readJson(packageManifestPath);
const failures = [];

assert(packageManifest.name === '@aeris-ui/core', 'The built package name is not @aeris-ui/core.');
assert(
  packageManifest.version === sourceManifest.version,
  `Built version ${packageManifest.version ?? '(missing)'} does not match source version ${sourceManifest.version}.`,
);
assert(
  !String(packageManifest.version).includes('-watch+'),
  'The built package came from watch mode. Create a fresh production build before packing.',
);
assert(packageManifest.private !== true, 'The built package is marked private.');
assert(
  packageManifest.publishConfig?.access === 'public',
  'The scoped package must explicitly publish with public access.',
);
assert(
  packageManifest.publishConfig?.provenance === true,
  'npm provenance must remain enabled for releases.',
);

const requiredPeers = [
  '@angular/common',
  '@angular/core',
  '@angular/forms',
  '@angular/platform-browser',
  'rxjs',
];
const optionalPeers = [
  'chart.js',
  '@lexical/history',
  '@lexical/html',
  '@lexical/list',
  '@lexical/rich-text',
  '@lexical/selection',
  'lexical',
];

for (const dependency of requiredPeers) {
  const sourceRange = sourceManifest.peerDependencies?.[dependency];
  assert(
    typeof sourceRange === 'string' &&
      packageManifest.peerDependencies?.[dependency] === sourceRange,
    `${dependency} is missing from the built peer dependency contract.`,
  );
  assert(
    packageManifest.peerDependenciesMeta?.[dependency]?.optional !== true,
    `${dependency} must not be optional.`,
  );
}

for (const dependency of optionalPeers) {
  const developmentRange = workspaceManifest.dependencies?.[dependency];
  assert(
    sourceManifest.peerDependencies?.[dependency] === developmentRange,
    `${dependency} peer range ${sourceManifest.peerDependencies?.[dependency] ?? '(missing)'} does not match the version used to build Aeris (${developmentRange ?? '(missing)'}).`,
  );
  assert(
    packageManifest.peerDependencies?.[dependency] === developmentRange,
    `${dependency} is missing from the built peer dependency contract.`,
  );
  assert(
    packageManifest.peerDependenciesMeta?.[dependency]?.optional === true,
    `${dependency} must remain optional so unrelated entry points do not require it.`,
  );
}

assert(
  packageManifest.dependencies?.tslib === workspaceManifest.dependencies?.tslib,
  'The published tslib dependency does not match the version used to build Aeris.',
);
assert(
  Array.isArray(packageManifest.sideEffects) &&
    packageManifest.sideEffects.includes('./styles/*.css'),
  'Published CSS must be marked as side-effectful so bundlers do not remove explicit style imports.',
);

for (const requiredExport of [
  '.',
  './package.json',
  './styles/aeris.css',
  './styles/controls.css',
  './theming.scss',
  './theme-config.schema.json',
  './setup-config.schema.json',
  './theming',
  './theme-builder',
]) {
  assert(packageManifest.exports?.[requiredExport], `Package export ${requiredExport} is missing.`);
}

for (const [exportName, exportValue] of Object.entries(packageManifest.exports ?? {})) {
  for (const target of exportTargets(exportValue)) {
    assert(
      target.startsWith('./'),
      `Package export ${exportName} has an invalid target ${target}.`,
    );
    assert(
      existsSync(resolve(packageDirectory, target)),
      `Package export ${exportName} points to missing file ${target}.`,
    );
  }
}

for (const requiredFile of [
  'LICENSE',
  'README.md',
  'schematics/collection.json',
  'tools/aeris-theme.mjs',
]) {
  assert(
    existsSync(resolve(packageDirectory, requiredFile)),
    `Published file ${requiredFile} is missing.`,
  );
}

const bundledNpmExecutable = resolve(dirname(process.execPath), 'node_modules/npm/bin/npm-cli.js');
const npmExecutable =
  process.env.npm_execpath ?? (existsSync(bundledNpmExecutable) ? bundledNpmExecutable : undefined);
const npmCommand = npmExecutable
  ? process.execPath
  : process.platform === 'win32'
    ? 'npm.cmd'
    : 'npm';
const npmArguments = npmExecutable
  ? [npmExecutable, 'pack', packageDirectory, '--dry-run', '--json', '--ignore-scripts']
  : ['pack', packageDirectory, '--dry-run', '--json', '--ignore-scripts'];
const pack = spawnSync(npmCommand, npmArguments, {
  cwd: process.cwd(),
  encoding: 'utf8',
  shell: !npmExecutable && process.platform === 'win32',
  env: {
    ...process.env,
    npm_config_cache: resolve('.angular/npm-cache'),
  },
});

if (pack.status !== 0) {
  const detail =
    pack.error?.message ?? pack.stderr?.trim() ?? pack.stdout?.trim() ?? 'Unknown npm error.';
  failures.push(`npm pack --dry-run failed: ${detail}`);
} else {
  try {
    const [result] = JSON.parse(pack.stdout);
    assert(result?.name === sourceManifest.name, 'Packed artifact has the wrong package name.');
    assert(result?.version === sourceManifest.version, 'Packed artifact has the wrong version.');
    assert(result?.entryCount > 0, 'Packed artifact is empty.');

    const paths = (result?.files ?? []).map((file) => file.path);
    const forbiddenFiles = paths.filter(
      (path) =>
        (path.endsWith('.ts') && !path.endsWith('.d.ts')) ||
        path.includes('.spec.') ||
        path.startsWith('projects/') ||
        path.startsWith('coverage/'),
    );
    assert(
      forbiddenFiles.length === 0,
      `Packed artifact contains development files: ${forbiddenFiles.join(', ')}.`,
    );
  } catch (error) {
    failures.push(`Could not inspect npm pack output: ${String(error)}`);
  }
}

if (failures.length > 0) {
  process.stderr.write('Aeris package verification failed:\n\n');
  for (const failure of failures) process.stderr.write(`- ${failure}\n`);
  process.exit(1);
}

process.stdout.write(
  `Aeris package ${packageManifest.version} is production-built, dependency-complete, and packable.\n`,
);

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function exportTargets(value) {
  if (typeof value === 'string') return [value];
  if (!value || typeof value !== 'object') return [];
  return Object.values(value).flatMap(exportTargets);
}

function assert(condition, message) {
  if (!condition) failures.push(message);
}

function fail(message) {
  process.stderr.write(`${message}\n`);
  process.exit(1);
}
