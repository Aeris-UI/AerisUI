import { existsSync, readFileSync } from 'node:fs';
import { basename, resolve } from 'node:path';
import { gzipSync } from 'node:zlib';

const outputDirectory = resolve('dist/docs/browser');
const statsPath = resolve('dist/docs/stats.json');
const budgets = JSON.parse(readFileSync(resolve('tools/doc-performance-budgets.json'), 'utf8'));

if (!existsSync(statsPath)) {
  fail('Documentation build statistics are missing. Build docs with --stats-json first.');
}

const stats = JSON.parse(readFileSync(statsPath, 'utf8'));
const initialOutputs = new Set();
const visit = (name) => {
  if (initialOutputs.has(name)) return;
  initialOutputs.add(name);
  for (const dependency of stats.outputs[name]?.imports ?? []) {
    if (dependency.kind !== 'dynamic-import' && !dependency.external) visit(dependency.path);
  }
};

for (const [name, output] of Object.entries(stats.outputs)) {
  if (output.entryPoint?.endsWith('main.ts')) visit(name);
}

const initialJavaScript = measure([...initialOutputs].filter((name) => name.endsWith('.js')));
const stylesOutput = Object.entries(stats.outputs).find(
  ([, output]) => output.entryPoint === 'angular:styles/global:styles',
)?.[0];

if (!stylesOutput) fail('The documentation global stylesheet output is missing.');

const globalStyles = measure([stylesOutput]);
const failures = [];
check('Initial JavaScript', initialJavaScript, budgets.initialJavaScript);
check('Global styles', globalStyles, budgets.globalStyles);

if (failures.length > 0) {
  process.stderr.write('Documentation performance verification failed:\n\n');
  for (const failure of failures) process.stderr.write(`- ${failure}\n`);
  process.exit(1);
}

process.stdout.write(
  `Verified documentation payload: ${format(initialJavaScript.raw)} raw / ${format(initialJavaScript.gzip)} gzip initial JavaScript and ${format(globalStyles.raw)} raw / ${format(globalStyles.gzip)} gzip global CSS.\n`,
);

function measure(outputs) {
  return outputs.reduce(
    (size, output) => {
      const source = readFileSync(resolve(outputDirectory, basename(output)));
      return {
        raw: size.raw + source.byteLength,
        gzip: size.gzip + gzipSync(source, { level: 9 }).byteLength,
      };
    },
    { raw: 0, gzip: 0 },
  );
}

function check(label, size, budget) {
  for (const format of ['raw', 'gzip']) {
    if (size[format] <= budget[format]) continue;
    failures.push(
      `${label} is ${formatBytes(size[format])} ${format}, above the ${formatBytes(budget[format])} budget.`,
    );
  }
}

function format(bytes) {
  return `${(bytes / 1024).toFixed(1)} KiB`;
}

function formatBytes(bytes) {
  return `${bytes} bytes (${format(bytes)})`;
}

function fail(message) {
  process.stderr.write(`${message}\n`);
  process.exit(1);
}
