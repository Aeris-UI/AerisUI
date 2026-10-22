import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { basename, join } from 'node:path';
import test from 'node:test';
import ts from 'typescript';

const read = (path) => readFile(path, 'utf8');
const library = JSON.parse(await read('projects/aeris-ui/package.json'));
const document = JSON.parse(
  await read(`projects/docs/public/ai/${library.version.split('.')[0]}/aeris-docs.json`),
);
const catalogModule = ts.transpileModule(
  await read('projects/docs/src/app/data/component-catalog.ts'),
  { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ESNext } },
).outputText;
const { COMPONENT_CATALOG, COMPONENT_GROUPS } = await import(
  `data:text/javascript;base64,${Buffer.from(catalogModule).toString('base64')}`
);
const routes = ts.createSourceFile(
  'app.routes.ts',
  await read('projects/docs/src/app/app.routes.ts'),
  ts.ScriptTarget.Latest,
  true,
);
const lazyPaths = [];
function visitRoutes(node) {
  if (ts.isObjectLiteralExpression(node)) {
    const path = node.properties.find(
      (property) => ts.isPropertyAssignment(property) && property.name.getText(routes) === 'path',
    );
    if (
      path &&
      ts.isStringLiteral(path.initializer) &&
      node.properties.some((property) => property.name?.getText(routes) === 'loadComponent')
    )
      lazyPaths.push(path.initializer.text);
  }
  ts.forEachChild(node, visitRoutes);
}
visitRoutes(routes);

async function files(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (
    await Promise.all(
      entries.map((entry) => {
        const path = join(directory, entry.name);
        return entry.isDirectory() ? files(path) : [path];
      }),
    )
  ).flat();
}
const pages = new Map(
  (await files('projects/docs/src/app/pages/components'))
    .filter((path) => path.endsWith('.page.html'))
    .map((path) => [basename(path, '.page.html'), path]),
);
const components = new Map(document.components.map((component) => [component.slug, component]));

test('every component example ships complete code without docs-shell color dependencies', () => {
  const ids = new Set();
  for (const component of document.components) {
    for (const example of component.examples) {
      assert.ok(example.title.trim(), `${component.slug}: example title`);
      assert.ok(example.description.trim(), `${example.id}: feature description`);
      assert.ok(!ids.has(example.id), `${example.id}: unique example ID`);
      ids.add(example.id);
      const typeScript = example.sources.find((source) => source.language === 'TypeScript');
      assert.match(typeScript?.code ?? '', /@Component\s*\(/, `${example.id}: complete component`);
      assert.match(typeScript?.code ?? '', /export class \w+/, `${example.id}: exported component`);
      for (const source of example.sources) {
        assert.doesNotMatch(
          source.code,
          /var\(--(?:primary(?:-hover|-text|-soft)?|accent|warm|danger|success|warning(?:-text)?|page|surface(?:-[23])?|text(?:-[23])?|border|focus|radius-(?:sm|md|lg)|control-height)(?=[,\s)])/,
          `${example.id}: use public Aeris tokens, not docs aliases`,
        );
        assert.doesNotMatch(
          source.code,
          /(?:DOC_ICONS|DOC_EXAMPLE_STYLES|DOC_EXAMPLE_CODE)\b/,
          `${example.id}: no private documentation helpers`,
        );
      }
    }
  }
  assert.ok(ids.size >= 769, 'all component examples remain covered');
});
const extendedFamilies = [
  'button',
  'button-group',
  'listbox',
  'command-palette',
  'chip',
  'popover',
  'date-picker',
  'sidebar',
  'navbar',
  'kbd',
  'color-picker',
  'select',
  'table',
  'tree-table',
];

test('catalog, grouped navigation, lazy routes and AI entries describe the same components', async () => {
  assert.equal(components.size, COMPONENT_CATALOG.length);
  const grouped = COMPONENT_GROUPS.flatMap((group) => group.items.map((item) => item.slug));
  assert.deepEqual([...grouped].sort(), COMPONENT_CATALOG.map((item) => item.slug).sort());
  for (const item of COMPONENT_CATALOG) {
    const component = components.get(item.slug);
    assert.equal(component?.category, item.category, item.slug);
    assert.equal(component?.description, item.description, item.slug);
    assert.equal(
      lazyPaths.filter((path) => path === `components/${item.slug}`).length,
      1,
      item.slug,
    );
    assert.ok(pages.has(item.slug), item.slug);
    await read(`projects/aeris-ui/${item.slug}/public-api.ts`);
    assert.ok(component.accessibility.keyboard.length, `${item.slug}: keyboard support`);
    assert.ok(component.examples.length, `${item.slug}: examples`);
  }
});

test('extended families retain one page with shared header, import and all reference tabs', async () => {
  for (const slug of extendedFamilies) {
    const html = await read(pages.get(slug));
    assert.match(html, /<app-component-page-header\b/, slug);
    const importPosition = html.indexOf('class="import-section"');
    assert.ok(
      importPosition >= 0 && importPosition < html.indexOf('<aeris-tabs'),
      `${slug}: import`,
    );
    for (const tab of ['features', 'api', 'interfaces', 'tokens', 'accessibility']) {
      assert.match(html, new RegExp(`<aeris-tab-panel\\b[^>]*value="${tab}"`), `${slug}: ${tab}`);
    }
    assert.ok(components.get(slug).interfaces.length, `${slug}: interfaces`);
  }
});

test('public signal inputs and outputs of extended families are present in consumer API tables', async () => {
  for (const slug of extendedFamilies) {
    const component = components.get(slug);
    const names = [
      ...component.api.flatMap((group) => group.entries.map((entry) => entry.name)),
      ...component.referenceTables.flatMap((table) => table.rows.map((row) => row[0])),
    ].join(' ');
    for (const path of (await files(`projects/aeris-ui/${slug}`)).filter((path) =>
      path.endsWith('.ts'),
    )) {
      const source = ts.createSourceFile(path, await read(path), ts.ScriptTarget.Latest, true);
      for (const declaration of source.statements) {
        if (
          !ts.isClassDeclaration(declaration) ||
          !declaration.name ||
          declaration.name.text.startsWith('ɵ') ||
          !declaration.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword)
        )
          continue;
        for (const member of declaration.members) {
          if (
            !ts.isPropertyDeclaration(member) ||
            !member.initializer ||
            !ts.isCallExpression(member.initializer) ||
            member.modifiers?.some((modifier) =>
              [ts.SyntaxKind.PrivateKeyword, ts.SyntaxKind.ProtectedKeyword].includes(
                modifier.kind,
              ),
            ) ||
            !/^(input|model|output)(\.required)?$/.test(
              member.initializer.expression.getText(source),
            )
          )
            continue;
          const alias = member.initializer.arguments
            .filter(ts.isObjectLiteralExpression)
            .flatMap((argument) => argument.properties)
            .find(
              (property) =>
                ts.isPropertyAssignment(property) &&
                property.name.getText(source) === 'alias' &&
                ts.isStringLiteral(property.initializer),
            );
          const name = alias ? alias.initializer.text : member.name.getText(source);
          assert.match(
            names,
            new RegExp(`\\b${name}\\b`),
            `${slug}: ${declaration.name.text}.${name}`,
          );
        }
      }
    }
  }
});

test('AI tokens retain the defaults and descriptions shown by all supported table formats', () => {
  const expected = [
    ['listbox', '--aeris-listbox-background', '--aeris-surface'],
    ['sidebar', '--aeris-sidebar-width', '16rem'],
    ['navbar', '--aeris-navbar-background', '--aeris-surface'],
    ['kbd', '--aeris-kbd-symbol-font-family', 'system-ui, sans-serif'],
    ['chip', '--aeris-chip-group-selected-background', '--aeris-primary-soft'],
    ['code-block', '--aeris-code-block-background', '--aeris-surface-2'],
  ];
  for (const [slug, name, fallback] of expected) {
    const token = components.get(slug).designTokens.find((entry) => entry.name === name);
    assert.equal(token?.defaultValue, fallback, `${slug}: ${name}`);
    assert.ok(token.description.trim(), `${slug}: ${name} description`);
  }
});

test('consumer guide component links resolve to real catalog routes', () => {
  for (const guide of document.guides) {
    for (const link of guide.sections.flatMap((section) => section.links ?? [])) {
      if (!link.href.startsWith('/components/')) continue;
      const slug = link.href.slice('/components/'.length).split(/[?#]/)[0];
      assert.ok(components.has(slug), `${guide.id}: ${link.href}`);
    }
  }
});
