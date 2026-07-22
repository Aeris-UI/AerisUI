import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { basename, dirname, resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const OUTPUT = resolve(ROOT, 'dist/aeris-mcp');
const expectedParent = resolve(ROOT, 'dist');

if (dirname(OUTPUT) !== expectedParent || basename(OUTPUT) !== 'aeris-mcp') {
  throw new Error(`Refusing to prepare unexpected MCP output path: ${OUTPUT}`);
}

const packagePath = resolve(ROOT, 'projects/aeris-mcp/package.json');
const docsPath = resolve(ROOT, 'projects/docs/public/ai/22/aeris-docs.json');
const [packageSource, documentationSource] = await Promise.all([
  readFile(packagePath, 'utf8'),
  readFile(docsPath, 'utf8'),
]);
const packageJson = JSON.parse(packageSource);
const documentation = JSON.parse(documentationSource);

if (packageJson.version !== documentation.library?.version) {
  throw new Error(
    `MCP version ${packageJson.version} does not match documentation version ${documentation.library?.version ?? '(missing)'}.`,
  );
}

await rm(OUTPUT, { recursive: true, force: true });
await mkdir(resolve(OUTPUT, 'docs'), { recursive: true });
await Promise.all([
  writeFile(resolve(OUTPUT, 'package.json'), `${JSON.stringify(packageJson, null, 2)}\n`, 'utf8'),
  cp(resolve(ROOT, 'projects/aeris-mcp/README.md'), resolve(OUTPUT, 'README.md')),
  cp(resolve(ROOT, 'LICENSE'), resolve(OUTPUT, 'LICENSE')),
  writeFile(resolve(OUTPUT, 'docs/aeris-docs.json'), documentationSource, 'utf8'),
]);

process.stdout.write(
  `Prepared @aeris-ui/mcp ${packageJson.version} with Aeris ${documentation.library.version} documentation.\n`,
);
