import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { gzipSync } from 'node:zlib';

const bundleDirectory = resolve('dist/aeris-ui/fesm2022');
const budgets = {
  total: { raw: 4_200_000, gzip: 710_000 },
  largestEntryPoint: { raw: 195_000, gzip: 30_000 },
  entryPoints: {
    'aeris-ui-core.mjs': { raw: 42_000, gzip: 9_000 },
    'aeris-ui-core-tabs.mjs': { raw: 48_000, gzip: 10_000 },
  },
};

if (!existsSync(bundleDirectory)) {
  fail('Production bundles are missing. Run npm run build:lib before checking bundle size.');
}

const bundles = readdirSync(bundleDirectory)
  .filter((name) => name.endsWith('.mjs'))
  .map((name) => {
    const source = readFileSync(resolve(bundleDirectory, name));
    return { name, raw: source.byteLength, gzip: gzipSync(source, { level: 9 }).byteLength };
  });
const failures = [];
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
checkBudget('Largest raw entry point', largestRaw, { raw: budgets.largestEntryPoint.raw });
checkBudget('Largest compressed entry point', largestGzip, {
  gzip: budgets.largestEntryPoint.gzip,
});

for (const [name, budget] of Object.entries(budgets.entryPoints)) {
  const bundle = bundles.find((candidate) => candidate.name === name);
  if (!bundle) {
    failures.push(`Required bundle ${name} is missing.`);
    continue;
  }
  checkBudget(name, bundle, budget);
}

if (failures.length > 0) {
  process.stderr.write('Aeris bundle-size verification failed:\n\n');
  for (const failure of failures) process.stderr.write(`- ${failure}\n`);
  process.exit(1);
}

process.stdout.write(
  `Verified ${bundles.length} FESM entry points: ${format(total.raw)} raw, ${format(total.gzip)} gzip; largest ${largestRaw.name} at ${format(largestRaw.raw)} raw.\n`,
);

function checkBudget(label, size, budget) {
  for (const formatName of ['raw', 'gzip']) {
    const limit = budget[formatName];
    if (limit === undefined || size[formatName] <= limit) continue;
    failures.push(
      `${label} is ${format(size[formatName])} ${formatName}, above the ${format(limit)} budget.`,
    );
  }
}

function format(bytes) {
  return `${(bytes / 1024).toFixed(1)} KiB`;
}

function fail(message) {
  process.stderr.write(`${message}\n`);
  process.exit(1);
}
