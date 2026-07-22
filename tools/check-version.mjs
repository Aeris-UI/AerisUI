import { readFile } from 'node:fs/promises';

const packagePath = new URL('../projects/aeris-ui/package.json', import.meta.url);
const mcpPackagePath = new URL('../projects/aeris-mcp/package.json', import.meta.url);
const publicApiPath = new URL('../projects/aeris-ui/src/public-api.ts', import.meta.url);
const versionDataPath = new URL('../projects/docs/src/app/data/aeris-version.ts', import.meta.url);
const releaseDataPath = new URL(
  '../projects/docs/src/app/pages/guides/release-data.ts',
  import.meta.url,
);

const [packageSource, mcpPackageSource, publicApi, versionData, releaseData] = await Promise.all([
  readFile(packagePath, 'utf8'),
  readFile(mcpPackagePath, 'utf8'),
  readFile(publicApiPath, 'utf8'),
  readFile(versionDataPath, 'utf8'),
  readFile(releaseDataPath, 'utf8'),
]);

const packageJson = JSON.parse(packageSource);
const mcpPackageJson = JSON.parse(mcpPackageSource);
const documentedVersion = versionData.match(/AERIS_CURRENT_VERSION = '([^']+)'/)?.[1];
const documentedAngularRange = versionData.match(/AERIS_ANGULAR_PEER_RANGE = '([^']+)'/)?.[1];
const publicApiVersion = publicApi.match(/AERIS_UI_VERSION = '([^']+)'/)?.[1];

if (!documentedVersion || !documentedAngularRange) {
  throw new Error('Could not read the documented Aeris version metadata.');
}

const failures = [];
const aerisMajor = Number.parseInt(documentedVersion.split('.')[0] ?? '', 10);
const angularMajor = Number.parseInt(documentedAngularRange.match(/(\d+)\./)?.[1] ?? '', 10);

if (packageJson.version !== documentedVersion) {
  failures.push(
    `Package version ${packageJson.version} does not match documentation version ${documentedVersion}.`,
  );
}

if (mcpPackageJson.version !== documentedVersion) {
  failures.push(
    `MCP package version ${mcpPackageJson.version} does not match documentation version ${documentedVersion}.`,
  );
}

if (publicApiVersion !== documentedVersion) {
  failures.push(
    `Public API version ${publicApiVersion ?? '(missing)'} does not match documentation version ${documentedVersion}.`,
  );
}

for (const angularPackage of [
  '@angular/common',
  '@angular/core',
  '@angular/forms',
  '@angular/platform-browser',
]) {
  const peerRange = packageJson.peerDependencies?.[angularPackage];
  if (peerRange !== documentedAngularRange) {
    failures.push(
      `${angularPackage} peer range ${peerRange ?? '(missing)'} does not match ${documentedAngularRange}.`,
    );
  }
}

if (!Number.isFinite(aerisMajor) || !Number.isFinite(angularMajor) || aerisMajor !== angularMajor) {
  failures.push(
    `Aeris major ${Number.isFinite(aerisMajor) ? aerisMajor : '(invalid)'} does not match Angular major ${Number.isFinite(angularMajor) ? angularMajor : '(invalid)'}.`,
  );
}

if (!documentedAngularRange.includes(`<${angularMajor + 1}.0.0`)) {
  failures.push(
    `Angular peer range ${documentedAngularRange} must exclude Angular ${angularMajor + 1}.`,
  );
}

if (!releaseData.includes(`aeris: '${aerisMajor}.x'`)) {
  failures.push(
    `The compatibility matrix does not contain the Aeris ${aerisMajor}.x release line.`,
  );
}

if (!releaseData.includes(`angular: '${angularMajor}.x'`)) {
  failures.push(
    `The compatibility matrix does not contain the Angular ${angularMajor}.x release line.`,
  );
}

if (!releaseData.includes(`version: '${documentedVersion}'`)) {
  failures.push(`The changelog data does not contain the current version ${documentedVersion}.`);
}

if (failures.length) {
  console.error('Aeris version metadata is inconsistent:\n');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log(
    `Aeris ${documentedVersion} metadata is aligned with Angular ${documentedAngularRange}.`,
  );
}
