import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { gzipSync } from 'node:zlib';
import { budgetRows, reportPerformance } from './performance-budget.mjs';

const bundleDirectory = resolve('dist/aeris-ui/fesm2022');
const budgets = JSON.parse(readFileSync(resolve('tools/library-performance-budgets.json'), 'utf8'));

if (!existsSync(bundleDirectory)) {
  fail('Production bundles are missing. Run npm run build:lib before checking bundle size.');
}
if (
  !readFileSync(resolve(bundleDirectory, 'aeris-ui-core-toolbar.mjs'), 'utf8').includes(
    'ɵɵngDeclareComponent',
  )
)
  fail(
    'Library size budgets require a production partial-compilation build. Stop the watcher and run npm run build:lib.',
  );

const bundles = readdirSync(bundleDirectory)
  .filter((name) => name.endsWith('.mjs'))
  .map((name) => {
    const source = readFileSync(resolve(bundleDirectory, name));
    return { name, raw: source.byteLength, gzip: gzipSync(source, { level: 9 }).byteLength };
  });
const failures = [];
const rows = [];
const total = bundles.reduce(
  (size, bundle) => ({ raw: size.raw + bundle.raw, gzip: size.gzip + bundle.gzip }),
  { raw: 0, gzip: 0 },
);
const largestRaw = bundles.reduce((largest, bundle) =>
  bundle.raw > largest.raw ? bundle : largest,
);
const largestGzip = bundles.reduce((largest, bundle) =>
  bundle.gzip > largest.gzip ? bundle : largest,
);

checkBudget('All FESM entry points', total, budgets.total);
checkBudget('Largest raw entry point', largestRaw, {
  raw: budgets.largestEntryPoint.raw,
  baseline: budgets.largestEntryPoint.baseline,
});
checkBudget('Largest compressed entry point', largestGzip, {
  gzip: budgets.largestEntryPoint.gzip,
  baseline: budgets.largestEntryPoint.baseline,
});

for (const [name, budget] of Object.entries(budgets.entryPoints)) {
  const bundle = bundles.find((candidate) => candidate.name === name);
  if (!bundle) {
    failures.push(`Required bundle ${name} is missing.`);
    continue;
  }
  checkBudget(name, bundle, budget);
}
for (const bundle of bundles) {
  if (!budgets.entryPoints[bundle.name])
    failures.push(`New entry point ${bundle.name} needs a reviewed production baseline.`);
}

const withinBudgets = reportPerformance('library', rows, [
  'FESM package totals are secondary guardrails, not the payload of an individual application. Production consumer budgets are the primary payload checks.',
  'All entry points have reviewed limits; adding one requires an explicit baseline review.',
]);
if (failures.length > 0 || !withinBudgets) {
  process.stderr.write('Aeris bundle-size verification failed:\n\n');
  for (const failure of failures) process.stderr.write(`- ${failure}\n`);
  process.exit(1);
}

process.stdout.write(
  `Verified ${bundles.length} FESM entry points: ${format(total.raw)} raw, ${format(total.gzip)} gzip; largest ${largestRaw.name} at ${format(largestRaw.raw)} raw.\n`,
);

function checkBudget(label, size, budget) {
  rows.push(...budgetRows(label, size, budget));
}

function format(bytes) {
  return `${(bytes / 1024).toFixed(1)} KiB`;
}

function fail(message) {
  process.stderr.write(`${message}\n`);
  process.exit(1);
}
