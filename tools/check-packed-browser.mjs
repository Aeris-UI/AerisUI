import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createServer } from 'node:http';
import { build } from 'esbuild';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { chromium } from '@playwright/test';

const workspace = resolve(process.argv[2]);
const consumerRequire = createRequire(resolve(workspace, 'package.json'));
const { transformAsync } = await import(pathToFileURL(consumerRequire.resolve('@babel/core')).href);
const { default: linker } = await import(
  pathToFileURL(consumerRequire.resolve('@angular/compiler-cli/linker/babel')).href
);
const codeBlockOnly = process.argv.includes('--code-block');
// A consumer must install Shiki even for plain CodeBlock: bundlers resolve its lazy imports.
if (!codeBlockOnly)
  try {
    await build({
      stdin: {
        contents:
          "import { AerisCodeBlock } from '@aeris-ui/core/code-block'; console.log(AerisCodeBlock);",
        resolveDir: workspace,
      },
      bundle: true,
      write: false,
      logLevel: 'silent',
    });
    assert.fail('CodeBlock unexpectedly bundled without Shiki; revisit its dependency guidance.');
  } catch (error) {
    assert.ok(
      error.errors?.some((entry) => /Could not resolve ["']shiki\//.test(entry.text)),
      `Missing-Shiki probe did not fail for the expected dependency: ${error.message}`,
    );
  }
const bundle = await build({
  ...(codeBlockOnly
    ? {
        stdin: {
          contents: `import '@angular/compiler';
import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { AerisCodeBlock } from '@aeris-ui/core/code-block';
const App = Component({selector: 'plain-code-consumer', imports: [AerisCodeBlock], template: '<aeris-code-block code="const answer = 42;" [highlight]="false" />'})(class App {});
bootstrapApplication(App).then(async app => { await app.whenStable(); document.documentElement.dataset.hydrated = 'true'; }).catch(console.error);`,
          resolveDir: workspace,
          sourcefile: 'hydration.js',
        },
      }
    : { entryPoints: { hydration: resolve(workspace, 'consumer-browser.js') } }),
  outdir: resolve(workspace, 'browser'),
  entryNames: 'hydration',
  bundle: true,
  format: 'esm',
  splitting: true,
  metafile: true,
  plugins: [
    {
      name: 'angular-linker',
      setup(builder) {
        builder.onLoad({ filter: /\.mjs$/ }, async ({ path }) => {
          const source = await readFile(path, 'utf8');
          if (!source.includes('ɵɵngDeclare')) return;
          const result = await transformAsync(source, {
            filename: path,
            configFile: false,
            babelrc: false,
            compact: false,
            plugins: [[linker, { linkerJitMode: false }]],
          });
          return { contents: result.code, loader: 'js' };
        });
      },
    },
  ],
});
const html = (
  codeBlockOnly
    ? '<!doctype html><html><body><plain-code-consumer></plain-code-consumer></body></html>'
    : await readFile(resolve(workspace, 'rendered.html'), 'utf8')
).replace(
  '</body>',
  '<script>window.packedServerNode = document.querySelector("aeris-select");</script><script type="module" src="/hydration.js"></script></body>',
);
const server = createServer(async (request, response) => {
  if (/^\/[\w-]+\.js$/.test(request.url)) {
    try {
      response.setHeader('Content-Type', 'text/javascript');
      response.end(await readFile(resolve(workspace, 'browser', request.url.slice(1))));
    } catch {
      response.writeHead(404).end();
    }
  } else {
    response.setHeader('Content-Type', 'text/html');
    response.end(html);
  }
});
let browser;
try {
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  browser = await chromium.launch();
  const page = await browser.newPage();
  const errors = [];
  const scripts = [];
  page.on('request', (request) => {
    if (request.resourceType() === 'script') scripts.push(request.url());
  });
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (['error', 'warning'].includes(message.type())) errors.push(message.text());
  });
  // Node identity must survive hydration, rather than silently rerendering the fixture.
  await page.goto(`http://127.0.0.1:${server.address().port}`);
  await page.waitForSelector('html[data-hydrated="true"]');
  assert.deepEqual(errors, [], 'Browser bootstrap or hydration logged errors.');
  if (codeBlockOnly) {
    assert.equal(
      await page
        .locator('aeris-code-block pre')
        .textContent()
        .then((text) => text.trim()),
      'const answer = 42;',
    );
    const initial = new Set();
    const visit = (name) => {
      if (initial.has(name)) return;
      initial.add(name);
      for (const dependency of bundle.metafile.outputs[name]?.imports ?? [])
        if (!dependency.external && dependency.kind !== 'dynamic-import') visit(dependency.path);
    };
    visit(Object.keys(bundle.metafile.outputs).find((name) => name.endsWith('/hydration.js')));
    const initialNames = new Set([...initial].map((name) => name.split(/[\\/]/).at(-1)));
    assert.ok(
      scripts.every((url) => initialNames.has(new URL(url).pathname.slice(1))),
      'Plain CodeBlock requested a deferred highlighting chunk.',
    );
    assert.ok(
      [...initial].every((name) =>
        Object.keys(bundle.metafile.outputs[name]?.inputs ?? {}).every(
          (input) => !/\/(?:shiki|@shikijs)\//.test(input.replaceAll('\\', '/')),
        ),
      ),
      'Plain CodeBlock includes Shiki in its initial graph.',
    );
  } else {
    assert.equal(
      await page.evaluate(() => window.packedServerNode === document.querySelector('aeris-select')),
      true,
      'Hydration replaced server nodes.',
    );
    const viewport = page.getByRole('toolbar', { name: 'Packed floating actions', exact: true });
    const contained = page.getByRole('toolbar', { name: 'Packed contained actions', exact: true });
    assert.equal(
      await viewport.evaluate((node) => node.parentElement === document.body),
      true,
      'Viewport toolbar was not portaled after hydration.',
    );
    assert.equal(
      await contained.evaluate((node) => !!node.closest('aeris-ssr-consumer')),
      true,
      'Container toolbar escaped its host.',
    );
    await page.getByRole('tab', { name: 'Statistics', exact: true }).click();
    await page.locator('[data-deferred-statistics]').waitFor({ state: 'visible' });
  }
  assert.deepEqual(errors, [], 'Browser hydration logged errors.');
  console.log(
    codeBlockOnly
      ? 'Verified plain CodeBlock renders without requesting Shiki chunks.'
      : 'Verified actual packed browser hydration, node reuse, deferred tabs, and floating Toolbar placement.',
  );
} finally {
  await browser?.close();
  await new Promise((resolve) => server.close(resolve));
}
