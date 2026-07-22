import { readFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const OUTPUT = resolve(ROOT, 'dist/aeris-mcp');
const CORE_PACKAGE = resolve(ROOT, 'projects/aeris-ui/package.json');
const requiredFiles = [
  'package.json',
  'README.md',
  'LICENSE',
  'cli.js',
  'cli.d.ts',
  'index.js',
  'index.d.ts',
  'server.js',
  'search.js',
  'docs/aeris-docs.json',
];

const [packageSource, coreSource, cliSource, documentationSource] = await Promise.all([
  readFile(resolve(OUTPUT, 'package.json'), 'utf8'),
  readFile(CORE_PACKAGE, 'utf8'),
  readFile(resolve(OUTPUT, 'cli.js'), 'utf8'),
  readFile(resolve(OUTPUT, 'docs/aeris-docs.json'), 'utf8'),
]);
const packageJson = JSON.parse(packageSource);
const corePackage = JSON.parse(coreSource);
const documentation = JSON.parse(documentationSource);
const failures = [];

for (const file of requiredFiles) {
  const fileStat = await stat(resolve(OUTPUT, file)).catch(() => undefined);
  if (!fileStat?.isFile() || fileStat.size === 0) failures.push(`Missing or empty ${file}.`);
}
if (packageJson.name !== '@aeris-ui/mcp')
  failures.push(`Unexpected package name ${packageJson.name}.`);
if (packageJson.version !== corePackage.version) {
  failures.push(`MCP ${packageJson.version} does not match core ${corePackage.version}.`);
}
if (documentation.library?.version !== packageJson.version) {
  failures.push('Bundled documentation does not match the MCP version.');
}
if (packageJson.bin?.['aeris-mcp'] !== './cli.js') {
  failures.push('The aeris-mcp executable is not mapped to ./cli.js.');
}
if (!cliSource.startsWith('#!/usr/bin/env node')) failures.push('The CLI has no Node shebang.');
if (packageJson.dependencies?.['@aeris-ui/core']) {
  failures.push('@aeris-ui/mcp must not depend on @aeris-ui/core.');
}
if (packageJson.dependencies?.['@modelcontextprotocol/sdk'] !== '^1.29.0') {
  failures.push('The supported MCP SDK runtime dependency is missing.');
}

if (failures.length) {
  throw new Error(
    `Invalid @aeris-ui/mcp package:\n${failures.map((item) => `- ${item}`).join('\n')}`,
  );
}

process.stdout.write(
  `Verified @aeris-ui/mcp ${packageJson.version} with ${documentation.components.length} components and ${documentation.guides.length} guides.\n`,
);
