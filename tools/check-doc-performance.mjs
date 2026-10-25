import { existsSync, readFileSync } from 'node:fs';
import { basename, resolve } from 'node:path';
import { gzipSync } from 'node:zlib';
import { budgetRows, reportPerformance } from './performance-budget.mjs';

const outputDirectory = resolve('dist/docs/browser');
const legacyStatsPath = resolve('dist/docs/stats.json');
const statsPath = existsSync(legacyStatsPath)
  ? legacyStatsPath
  : resolve('dist/docs/browser-stats.json');
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
const initialContributors = new Map();
for (const name of initialOutputs) {
  for (const [input, data] of Object.entries(stats.outputs[name]?.inputs ?? {})) {
    initialContributors.set(
      input,
      (initialContributors.get(input) ?? 0) + (data.bytesInOutput ?? 0),
    );
  }
}
const largestInitialInputs = [...initialContributors.entries()]
  .sort((a, b) => b[1] - a[1])
  .slice(0, 5);
const stylesOutput = Object.entries(stats.outputs).find(
  ([, output]) => output.entryPoint === 'angular:styles/global:styles',
)?.[0];

if (!stylesOutput) fail('The documentation global stylesheet output is missing.');

const globalStyles = measure([stylesOutput]);
const catalogEntry = Object.entries(stats.outputs).find(([, output]) =>
  Object.keys(output.inputs ?? {}).some((input) => input.endsWith('/component-catalog.page.ts')),
)?.[0];
if (!catalogEntry) fail('The component catalog output is missing.');
const collect = (roots) => {
  const outputs = new Set();
  const visitOutput = (name) => {
    if (outputs.has(name) || initialOutputs.has(name)) return;
    outputs.add(name);
    for (const dependency of stats.outputs[name]?.imports ?? []) {
      if (dependency.kind !== 'dynamic-import' && !dependency.external)
        visitOutput(dependency.path);
    }
  };
  roots.forEach(visitOutput);
  return [...outputs].filter((name) => name.endsWith('.js'));
};
const previewEntries = Object.entries(stats.outputs)
  .filter(([, output]) =>
    Object.keys(output.inputs ?? {}).some((input) =>
      /\/catalog\/catalog-.*preview\.component\.ts$/.test(input),
    ),
  )
  .map(([name]) => name);
if (previewEntries.length === 0) fail('Catalog preview outputs are missing.');
const catalogRoute = measure(collect([catalogEntry]));
const catalogPreviews = measure(collect([catalogEntry, ...previewEntries]));
const rows = [];
if (budgets.initialTotal)
  check(
    'Initial JavaScript and CSS',
    {
      raw: initialJavaScript.raw + globalStyles.raw,
      gzip: initialJavaScript.gzip + globalStyles.gzip,
    },
    budgets.initialTotal,
  );
check('Initial JavaScript', initialJavaScript, budgets.initialJavaScript);
check('Global styles', globalStyles, budgets.globalStyles);
check('Catalog route (excluding initial JavaScript)', catalogRoute, budgets.catalogRoute);
check(
  'Catalog with every deferred preview (excluding initial JavaScript)',
  catalogPreviews,
  budgets.catalogPreviews,
);

if (
  !reportPerformance('docs', rows, [
    'Initial JavaScript excludes CSS; Angular initial budgets include both. Both limits are calibrated against the same reviewed production build.',
    'Catalog previews include every deferred family, not just startup downloads.',
    `Largest initial input contributors (build-tool attribution, not independently removable bytes): ${largestInitialInputs.map(([name, bytes]) => `${name}: ${bytes} B`).join('; ')}.`,
  ])
) {
  process.stderr.write('Documentation performance verification failed:\n\n');
  process.exit(1);
}

process.stdout.write(
  `Verified documentation payload: ${format(initialJavaScript.raw)} raw / ${format(initialJavaScript.gzip)} gzip initial JavaScript and ${format(globalStyles.raw)} raw / ${format(globalStyles.gzip)} gzip global CSS.\n`,
);
process.stdout.write(
  `Catalog route: ${format(catalogRoute.raw)} raw / ${format(catalogRoute.gzip)} gzip; all preview families: ${format(catalogPreviews.raw)} raw / ${format(catalogPreviews.gzip)} gzip.\n`,
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
  rows.push(...budgetRows(label, size, budget));
}

function format(bytes) {
  return `${(bytes / 1024).toFixed(1)} KiB`;
}

function fail(message) {
  process.stderr.write(`${message}\n`);
  process.exit(1);
}
