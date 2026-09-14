import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { resolve, relative, sep } from 'node:path';
import { spawnSync } from 'node:child_process';
import { gzipSync } from 'node:zlib';
import { createServer } from 'node:http';
import { performance } from 'node:perf_hooks';

const root = resolve('.');
const workspace = resolve('.angular/consumer-performance');
const benchmark = process.argv.includes('--benchmark');
const scenarios = [
  {
    name: 'baseline',
    imports: '',
    modules: '',
    template: '<label>Name <input /></label><button>Save</button>',
  },
  {
    name: 'basic',
    imports: `import { AerisButton } from '@aeris-ui/core/button';
import { AerisInputText } from '@aeris-ui/core/input-text';
import { AerisTextarea } from '@aeris-ui/core/textarea';`,
    modules: 'AerisButton, AerisInputText, AerisTextarea',
    template:
      '<label>Name <input aerisInputText /></label><textarea aerisTextarea aria-label="Notes"></textarea><button aerisButton>Save</button>',
  },
  {
    name: 'forms',
    imports: `import { AerisSelect } from '@aeris-ui/core/select';
import { AerisDatePicker } from '@aeris-ui/core/date-picker';`,
    modules: 'AerisSelect, AerisDatePicker',
    template:
      '<aeris-select ariaLabel="Team" [options]="options" filter /><aeris-date-picker ariaLabel="Start date" />',
    data: `readonly options = Array.from({length: 10000}, (_, i) => ({label: 'Team ' + i, value: String(i)}));`,
  },
  {
    name: 'data-overlays',
    imports: `import { AerisTableModule } from '@aeris-ui/core/table';
import { AerisDialogModule } from '@aeris-ui/core/dialog';
import { AerisPopoverModule } from '@aeris-ui/core/popover';`,
    modules: 'AerisTableModule, AerisDialogModule, AerisPopoverModule',
    template:
      '<aeris-table ariaLabel="Inventory" [columns]="columns" [data]="rows" paginator [rows]="20" globalFilter /><button id="open" (click)="visible.set(true)">Open dialog</button><aeris-dialog header="Details" [(visible)]="visible">Details</aeris-dialog><aeris-popover #popover>Actions</aeris-popover><button (click)="popover.toggle($event)">Actions</button>',
    data: `readonly visible = signal(false);
readonly columns = [{field: 'name', header: 'Name'}, {field: 'amount', header: 'Amount'}];
readonly rows = Array.from({length: 10000}, (_, i) => ({id: i, name: 'Item ' + i, amount: i}));`,
  },
  {
    name: 'chart',
    imports: `import { AerisChartModule } from '@aeris-ui/core/chart';`,
    modules: 'AerisChartModule',
    template: '<aeris-chart type="bar" ariaLabel="Delivery" [data]="chartData" />',
    data: `readonly chartData = {labels: ['Week 1'], datasets: [{label: 'Delivered', data: [12]}]};`,
  },
  {
    name: 'editor',
    imports: `import { AerisEditor } from '@aeris-ui/core/editor';`,
    modules: 'AerisEditor',
    template: '<aeris-editor ariaLabel="Notes" />',
  },
];

mkdirSync(workspace, { recursive: true });
const budgets = JSON.parse(
  readFileSync(resolve('tools/consumer-performance-budgets.json'), 'utf8'),
);
const results = [];
for (const scenario of scenarios) {
  const directory = resolve(workspace, scenario.name);
  mkdirSync(directory, { recursive: true });
  const styles =
    scenario.name === 'baseline'
      ? []
      : ['aeris.css', 'controls.css'].map((name) => resolve('dist/aeris-ui/styles', name));
  writeJson(resolve(directory, 'angular.json'), {
    version: 1,
    projects: {
      consumer: {
        projectType: 'application',
        root: '',
        architect: {
          build: {
            builder: '@angular/build:application',
            options: {
              browser: 'main.ts',
              tsConfig: 'tsconfig.json',
              outputPath: 'output',
              optimization: true,
              sourceMap: false,
              statsJson: true,
              styles,
              index: 'index.html',
            },
          },
        },
      },
    },
  });
  writeJson(resolve(directory, 'tsconfig.json'), {
    compilerOptions: {
      target: 'ES2022',
      module: 'preserve',
      moduleResolution: 'bundler',
      strict: true,
      skipLibCheck: true,
      experimentalDecorators: true,
      paths: {
        '@aeris-ui/core': [resolve('dist/aeris-ui')],
        '@aeris-ui/core/*': [resolve('dist/aeris-ui/*')],
      },
    },
    angularCompilerOptions: { strictTemplates: true },
    files: ['main.ts'],
  });
  writeFileSync(
    resolve(directory, 'index.html'),
    '<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"></head><body><app-root></app-root></body></html>',
  );
  writeFileSync(
    resolve(directory, 'main.ts'),
    `import { Component, signal } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
${scenario.imports}
@Component({selector: 'app-root', imports: [${scenario.modules}], template: \`${scenario.template}\`})
class App { ${scenario.data ?? ''} }
bootstrapApplication(App).catch(console.error);
`,
  );
  const started = performance.now();
  const build = spawnSync(
    process.execPath,
    [resolve('node_modules/@angular/cli/bin/ng.js'), 'build', 'consumer'],
    { cwd: directory, encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 },
  );
  if (build.status !== 0)
    throw new Error(`${scenario.name} build failed:\n${build.stdout}\n${build.stderr}`);
  const output = resolve(directory, 'output/browser');
  const stats = JSON.parse(readFileSync(resolve(directory, 'output/stats.json'), 'utf8'));
  const inputs = Object.keys(stats.inputs);
  const optional = inputs.filter((name) =>
    /node_modules\/(?:chart\.js|(?:@lexical\/|lexical\/))/.test(name.replaceAll('\\', '/')),
  );
  if (!['chart', 'editor'].includes(scenario.name) && optional.length)
    throw new Error(`${scenario.name} pulled in optional dependencies: ${optional.join(', ')}`);
  if (scenario.name === 'chart' && !optional.some((name) => name.includes('chart.js')))
    throw new Error('Chart fixture did not include Chart.js.');
  if (scenario.name === 'editor' && !optional.some((name) => name.includes('lexical')))
    throw new Error('Editor fixture did not include Lexical.');
  if (scenario.name === 'chart' && optional.some((name) => name.includes('lexical')))
    throw new Error('Chart pulled in Lexical.');
  if (scenario.name === 'editor' && optional.some((name) => name.includes('chart.js')))
    throw new Error('Editor pulled in Chart.js.');
  const entryPoints = inputs
    .filter((name) => /fesm2022\/.+\.mjs$/.test(name.replaceAll('\\', '/')))
    .map((name) => name.split(/[\\/]/).at(-1));
  for (const unrelated of ['galleria', 'tree-table', 'mega-menu']) {
    if (entryPoints.some((name) => name === `aeris-ui-core-${unrelated}.mjs`))
      throw new Error(`${scenario.name} pulled in unrelated ${unrelated}.`);
  }
  const js = measure(output, '.js');
  const css = measure(output, '.css');
  const initialOutputs = new Set();
  const visit = (name) => {
    if (initialOutputs.has(name)) return;
    initialOutputs.add(name);
    for (const dependency of stats.outputs[name]?.imports ?? [])
      if (dependency.kind !== 'dynamic-import' && !dependency.external) visit(dependency.path);
  };
  for (const [name, data] of Object.entries(stats.outputs))
    if (data.entryPoint?.endsWith('main.ts')) visit(name);
  const initialJs = { raw: 0, gzip: 0 };
  for (const name of initialOutputs) {
    if (!name.endsWith('.js')) continue;
    const bytes = readFileSync(resolve(output, name.split(/[\\/]/).at(-1)));
    initialJs.raw += bytes.length;
    initialJs.gzip += gzipSync(bytes, { level: 9 }).length;
  }
  const baseline = scenario.name === 'baseline' ? js : results[0].js;
  const incremental = { raw: js.raw - baseline.raw, gzip: js.gzip - baseline.gzip };
  if (scenario.name !== 'baseline') {
    const budget = budgets.scenarios[scenario.name];
    for (const key of ['raw', 'gzip'])
      if (incremental[key] > budget[key])
        throw new Error(
          `${scenario.name} incremental ${key} ${incremental[key]} exceeds ${budget[key]}.`,
        );
    if (css.gzip > budgets.sharedCssGzip)
      throw new Error(`${scenario.name} CSS exceeds shared CSS gzip budget.`);
  }
  results.push({
    name: scenario.name,
    js,
    initialJs,
    css,
    incremental,
    entryPoints,
    buildMs: Math.round(performance.now() - started),
  });
  console.log(
    `${scenario.name}: JS ${format(js.raw)} / ${format(js.gzip)} gzip; incremental ${format(incremental.gzip)} gzip; CSS ${format(css.gzip)} gzip; initial JS ${format(initialJs.gzip)} gzip`,
  );
}

const report = {
  node: process.version,
  angular: JSON.parse(readFileSync(resolve('node_modules/@angular/core/package.json'), 'utf8'))
    .version,
  methodology:
    'Production Angular AOT build, all emitted JS (including lazy optional integrations), gzip level 9 per file; incremental JS versus the same minimal Angular bootstrap. CSS reported separately. No network installation.',
  scenarios: results,
};
if (benchmark) report.interactions = await runBenchmarks();
writeJson(resolve(workspace, 'report.json'), report);
console.log(`Report: ${relative(root, resolve(workspace, 'report.json'))}`);

async function runBenchmarks() {
  const { chromium } = await import('@playwright/test');
  const server = createServer((request, response) => {
    const path = new URL(request.url, 'http://localhost').pathname;
    const parts = path.split('/').filter(Boolean);
    const scenario = parts.shift();
    if (!scenarios.some((item) => item.name === scenario)) {
      response.writeHead(404).end();
      return;
    }
    const base = resolve(workspace, scenario, 'output/browser');
    const file = resolve(base, parts.join('/') || 'index.html');
    if (file !== base && !file.startsWith(`${base}${sep}`)) {
      response.writeHead(404).end();
      return;
    }
    try {
      response.setHeader(
        'Content-Type',
        file.endsWith('.js') ? 'text/javascript' : file.endsWith('.css') ? 'text/css' : 'text/html',
      );
      response.end(readFileSync(file));
    } catch {
      response.writeHead(404).end();
    }
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  let browser;
  try {
    browser = await chromium.launch();
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    const base = `http://127.0.0.1:${server.address().port}`;
    await page.goto(`${base}/data-overlays/`);
    await page.getByRole('table').waitFor();
    const rows = await page.locator('tbody tr').count();
    if (rows > 20 || rows === 0)
      throw new Error(`Pagination rendered ${rows} rows for 10,000 records.`);
    const tableSearch = page.getByRole('searchbox', { name: 'Search' });
    const filter = await sample(async () => {
      await tableSearch.fill('Item 9999');
      await page.getByText('Item 9999', { exact: true }).waitFor();
      await tableSearch.fill('');
      await page.getByText('Item 0', { exact: true }).waitFor();
    });
    const overlays = await sample(async () => {
      await page.locator('#open').click();
      await page.getByRole('dialog').waitFor();
      await page.keyboard.press('Escape');
      await page.getByRole('dialog').waitFor({ state: 'hidden' });
    });
    await page.goto(`${base}/forms/`);
    await page.getByRole('combobox', { name: 'Team', exact: true }).click();
    const search = page.getByRole('searchbox');
    const filtering = await sample(async () => {
      await search.fill('Team 9999');
      await page.getByRole('option', { name: 'Team 9999', exact: true }).waitFor();
      await search.fill('Team 9998');
      await page.getByRole('option', { name: 'Team 9998', exact: true }).waitFor();
    });
    if (errors.length) throw new Error(`Production benchmark browser errors: ${errors.join('; ')}`);
    const result = {
      records: 10000,
      renderedTableRows: rows,
      tableFilterRoundTrip: filter,
      dialogOpenClose: overlays,
      selectFilterRoundTrip: filtering,
      note: '5 warmups + 20 measured Playwright round trips. Includes automation, layout, and two state changes; timings are informational, not CI limits.',
    };
    console.log(JSON.stringify(result, null, 2));
    return result;
  } finally {
    await browser?.close();
    await new Promise((resolve) => server.close(resolve));
  }
}

async function sample(action) {
  for (let i = 0; i < 5; i++) await action();
  const durations = [];
  for (let i = 0; i < 20; i++) {
    const start = performance.now();
    await action();
    durations.push(performance.now() - start);
  }
  durations.sort((a, b) => a - b);
  return { medianMs: Math.round(durations[10]), p95Ms: Math.round(durations[18]) };
}
function writeJson(path, data) {
  writeFileSync(path, JSON.stringify(data, null, 2) + '\n');
}
function measure(directory, extension) {
  return readdirSync(directory)
    .filter((name) => name.endsWith(extension))
    .reduce(
      (total, name) => {
        const bytes = readFileSync(resolve(directory, name));
        return {
          raw: total.raw + bytes.length,
          gzip: total.gzip + gzipSync(bytes, { level: 9 }).length,
        };
      },
      { raw: 0, gzip: 0 },
    );
}
function format(bytes) {
  return `${(bytes / 1024).toFixed(1)} KiB`;
}
