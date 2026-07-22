import { mkdir, readFile, readdir, unlink, writeFile } from 'node:fs/promises';
import { basename, dirname, extname, join, relative } from 'node:path';

import { HtmlParser } from '@angular/compiler';
import ts from 'typescript';

const COMPONENT_ROOT = 'projects/docs/src/app/pages/components';
const CATALOG_PATH = 'projects/docs/src/app/data/component-catalog.ts';
const DEMO_CODE_PATH = 'projects/docs/src/app/shared/demo-code.ts';
const GENERATED_STYLES_PATH = 'projects/docs/src/app/shared/generated-example-styles.ts';
const GUIDE_DATA_PATH = 'projects/docs/src/app/pages/guides/guide-data.ts';
const RELEASE_DATA_PATH = 'projects/docs/src/app/pages/guides/release-data.ts';
const PALETTE_DATA_PATH = 'projects/docs/src/app/data/docs-palettes.ts';
const PACKAGE_PATH = 'projects/aeris-ui/package.json';
const SCHEMA_PATH = 'projects/docs/public/ai/schema/aeris-docs.schema.v1.json';
const DOCS_ORIGIN = 'https://aeris-ui.dev';
const SCHEMA_VERSION = 1;

const shouldWrite = process.argv.includes('--write');
const shouldCheck = process.argv.includes('--check') || !shouldWrite;
const parser = new HtmlParser();
const unsupported = Symbol('unsupported');

const [{ COMPONENT_CATALOG, COMPONENT_CATEGORIES }, { buildAngularDemoSources }, stylesModule] =
  await Promise.all([
    loadSelfContainedModule(CATALOG_PATH),
    loadSelfContainedModule(DEMO_CODE_PATH),
    loadSelfContainedModule(GENERATED_STYLES_PATH),
  ]);
const DOC_EXAMPLE_STYLES = stylesModule.DOC_EXAMPLE_STYLES;
const packageJson = JSON.parse(await readFile(PACKAGE_PATH, 'utf8'));
const angularMajor = packageJson.version.split('.')[0];
const JSON_OUTPUT_PATH = `projects/docs/public/ai/${angularMajor}/aeris-docs.json`;
const COMPONENT_MARKDOWN_ROOT = `projects/docs/public/ai/${angularMajor}/components`;
const LLMS_PATH = 'projects/docs/public/llms.txt';
const LLMS_FULL_PATH = 'projects/docs/public/llms-full.txt';
const htmlFiles = await findFiles(COMPONENT_ROOT, '.html');
const pagesBySlug = new Map(htmlFiles.map((path) => [basename(path, '.page.html'), path]));

const guideExternalValues = await buildGuideExternalValues();
const guideArticles = evaluateExportedVariable(
  await readFile(GUIDE_DATA_PATH, 'utf8'),
  'GUIDE_ARTICLES',
  guideExternalValues,
);
if (!Array.isArray(guideArticles)) {
  fail(`Could not statically evaluate GUIDE_ARTICLES in ${GUIDE_DATA_PATH}.`);
}

const components = [];
for (const catalogItem of COMPONENT_CATALOG) {
  const htmlPath = pagesBySlug.get(catalogItem.slug);
  if (!htmlPath) fail(`Catalog component ${catalogItem.slug} has no documentation page.`);

  const tsPath = htmlPath.replace(/\.html$/, '.ts');
  const entryPointPath = join('projects/aeris-ui', catalogItem.slug, 'public-api.ts');
  await assertReadable(tsPath, `${catalogItem.slug} page source`);
  await assertReadable(entryPointPath, `${catalogItem.slug} library entry point`);

  const [html, pageSource] = await Promise.all([
    readFile(htmlPath, 'utf8'),
    readFile(tsPath, 'utf8'),
  ]);
  const parsed = parser.parse(html, htmlPath, { tokenizeBlocks: false });
  if (parsed.errors.length) {
    fail(`${htmlPath} could not be parsed:\n${parsed.errors.join('\n')}`);
  }

  const values = evaluatePageClass(pageSource);
  const importCode = values.get('importCode');
  if (typeof importCode !== 'string' || !importCode.trim()) {
    fail(
      `${relative('.', tsPath)} does not expose a static importCode string (evaluated: ${[
        ...values.keys(),
      ].join(', ')}).`,
    );
  }

  const header = findNode(parsed.rootNodes, (node) => node.name === 'app-component-page-header');
  validateHeader(header, catalogItem, htmlPath);

  const apiArrays = [...values.entries()]
    .filter(([, value]) => isApiEntryArray(value))
    .map(([name, entries]) => ({ name, kind: classifyApiGroup(name), entries }));
  const designTokens = uniqueApiEntries([
    ...apiArrays.filter((group) => group.kind === 'token').flatMap((group) => group.entries),
    ...extractStaticTokens(parsed.rootNodes),
  ]);
  const api = apiArrays
    .filter((group) => group.kind !== 'token')
    .map((group) => ({
      name: humanize(group.name),
      kind: group.kind,
      entries: group.entries.map(normalizeApiEntry),
    }));

  const examples = extractExamples(parsed.rootNodes, values, buildAngularDemoSources);
  const accessibility = extractAccessibility(parsed.rootNodes);
  const interfaces = [...values.entries()]
    .filter(
      ([name, value]) =>
        typeof value === 'string' && value.trim() && /(?:interfaces?|types?)code$/i.test(name),
    )
    .map(([name, code]) => ({ name: humanize(name.replace(/Code$/i, '')), code: code.trim() }));

  components.push({
    name: catalogItem.name,
    slug: catalogItem.slug,
    category: catalogItem.category,
    description: catalogItem.description,
    entryPoint: `${packageJson.name}/${catalogItem.slug}`,
    documentationUrl: `${DOCS_ORIGIN}/components/${catalogItem.slug}`,
    imports: extractAerisImports(importCode),
    importCode: importCode.trim(),
    api,
    referenceTables: extractStaticApiTables(parsed.rootNodes),
    interfaces: uniqueBy(interfaces, (item) => item.code),
    designTokens: designTokens.map(normalizeApiEntry),
    examples,
    accessibility,
  });
}

const document = {
  $schema: '../schema/aeris-docs.schema.v1.json',
  schemaVersion: SCHEMA_VERSION,
  library: {
    name: packageJson.name,
    version: packageJson.version,
    status: prereleaseStatus(packageJson.version),
    angularPeerRange: packageJson.peerDependencies['@angular/core'],
    documentationUrl: DOCS_ORIGIN,
    repositoryUrl: normalizeRepositoryUrl(packageJson.repository.url),
    license: packageJson.license,
    styleImports: [
      `@import '${packageJson.name}/styles/aeris.css';`,
      `@import '${packageJson.name}/styles/controls.css';`,
    ],
    peerDependencies: packageJson.peerDependencies,
    principles: [
      'Aeris is alpha software and is not production ready.',
      'Use Angular standalone APIs and import each component from its secondary entry point.',
      'Aeris supports any icon library; documentation examples use Lucide only as a consumer-provided icon library.',
      'Aeris components are responsive, themeable, and designed to meet WCAG 2.2 AA.',
      'Aeris coexists with current Tailwind CSS and Bootstrap without requiring either framework.',
    ],
  },
  categories: COMPONENT_CATEGORIES,
  guides: sanitizeGuides(guideArticles),
  components,
};

validateDocument(document);
const schema = JSON.parse(await readFile(SCHEMA_PATH, 'utf8'));
const schemaErrors = validateAgainstSchema(document, schema, schema);
if (schemaErrors.length) {
  fail(
    `Generated documentation does not match ${SCHEMA_PATH}:\n${schemaErrors.slice(0, 20).join('\n')}`,
  );
}
const componentMarkdown = new Map(
  document.components.map((component) => [
    join(COMPONENT_MARKDOWN_ROOT, `${component.slug}.md`),
    renderComponentMarkdown(component, document.library),
  ]),
);
const generatedOutputs = new Map([
  [JSON_OUTPUT_PATH, `${JSON.stringify(document, null, 2)}\n`],
  ...componentMarkdown,
  [LLMS_PATH, renderLlms(document, angularMajor)],
  [LLMS_FULL_PATH, renderLlmsFull(document)],
]);

validateMarkdownOutputs(document, generatedOutputs, angularMajor);
await synchronizeOutputs(generatedOutputs, new Set(componentMarkdown.keys()));

process.stdout.write(
  `${shouldWrite ? 'Generated' : 'Verified'} ${components.length} component Markdown files, ${document.guides.length} guides, ${components.reduce((total, component) => total + component.examples.length, 0)} examples, aeris-docs.json, llms.txt, and llms-full.txt.\n`,
);

async function synchronizeOutputs(outputs, expectedComponentFiles) {
  const stale = await findStaleComponentMarkdown(expectedComponentFiles);
  if (shouldWrite) {
    for (const [path, output] of outputs) {
      const existing = await readFile(path, 'utf8').catch(() => '');
      if (existing === output) continue;
      await mkdir(dirname(path), { recursive: true });
      await writeFile(path, output, 'utf8');
    }
    await Promise.all(stale.map((path) => unlink(path)));
  }

  if (!shouldCheck) return;
  const mismatches = [];
  for (const [path, output] of outputs) {
    const existing = await readFile(path, 'utf8').catch(() => '');
    if (existing !== output) mismatches.push(path);
  }
  mismatches.push(...stale);
  if (mismatches.length) {
    fail(
      `AI documentation is out of date:\n${mismatches
        .slice(0, 30)
        .map((path) => `- ${path}`)
        .join(
          '\n',
        )}${mismatches.length > 30 ? `\n- ...and ${mismatches.length - 30} more` : ''}\nRun npm run generate:ai-docs.`,
    );
  }
}

async function findStaleComponentMarkdown(expectedFiles) {
  const files = await readdir(COMPONENT_MARKDOWN_ROOT, { withFileTypes: true }).catch(() => []);
  return files
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
    .map((entry) => join(COMPONENT_MARKDOWN_ROOT, entry.name))
    .filter((path) => !expectedFiles.has(path));
}

async function loadSelfContainedModule(path) {
  const source = await readFile(path, 'utf8');
  const javascript = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ES2022,
      target: ts.ScriptTarget.ES2022,
    },
    fileName: path,
  }).outputText;
  const url = `data:text/javascript;base64,${Buffer.from(javascript).toString('base64')}`;
  return import(url);
}

async function findFiles(directory, extension) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => {
      const path = join(directory, entry.name);
      return entry.isDirectory() ? findFiles(path, extension) : [path];
    }),
  );
  return nested
    .flat()
    .filter((path) => extname(path) === extension)
    .sort();
}

async function assertReadable(path, label) {
  await readFile(path, 'utf8').catch(() => fail(`Missing ${label}: ${path}.`));
}

function validateHeader(header, catalogItem, path) {
  if (!header) fail(`${relative('.', path)} has no shared component page header.`);
  const title = attributeValue(header, 'title');
  const category = attributeValue(header, 'category');
  if (slugify(title ?? '') !== catalogItem.slug || category !== catalogItem.category) {
    fail(
      `${relative('.', path)} header (${category}/${title}) does not match the catalog (${catalogItem.category}/${catalogItem.name}).`,
    );
  }
}

function extractExamples(nodes, values, buildSources) {
  const demos = findNodes(
    nodes,
    (node) => node.name === 'app-form-demo' || node.name === 'app-button-demo',
  );
  const result = [];
  for (const demo of demos) {
    const code = findNode(demo.children ?? [], (node) => node.name === 'code');
    const htmlBinding = resolveAttribute(demo, 'htmlCode', values);
    if (!code && typeof htmlBinding !== 'string') continue;

    const id = resolveAttribute(demo, 'id', values);
    const title = resolveAttribute(demo, 'title', values);
    const description = resolveAttribute(demo, 'description', values);
    if (![id, title, description].every((value) => typeof value === 'string' && value.trim())) {
      fail('Every documented example must have a static id, title, and description.');
    }

    const template = normalizeCode(
      typeof htmlBinding === 'string' ? htmlBinding : textContent(code),
    );
    const classCode = resolveAttribute(demo, 'tsCode', values);
    const explicitCss = resolveAttribute(demo, 'cssCode', values);
    const cssCode = [DOC_EXAMPLE_STYLES[id], explicitCss]
      .filter((value) => typeof value === 'string' && value.trim())
      .join('\n\n');
    const sources = buildSources({
      anchor: id,
      title,
      template,
      classCode: typeof classCode === 'string' ? classCode : undefined,
      cssCode: cssCode || undefined,
    });
    result.push({ id, title, description, sources });
  }
  return uniqueBy(result, (example) => example.id);
}

function extractAccessibility(nodes) {
  const panel = findNode(
    nodes,
    (node) => node.name === 'aeris-tab-panel' && attributeValue(node, 'value') === 'accessibility',
  );
  if (!panel) return { guidance: [], keyboard: [] };

  const guidance = findNodes(
    panel.children ?? [],
    (node) => node.name === 'li' || node.name === 'p',
  )
    .map((node) => normalizeText(textContent(node)))
    .filter((value) => value && !value.includes('{{'));
  const keyboardTable = findNode(
    panel.children ?? [],
    (node) =>
      attributeValue(node, 'role') === 'table' &&
      /keyboard/i.test(attributeValue(node, 'aria-label') ?? ''),
  );
  const keyboard = keyboardTable
    ? tableRows(keyboardTable)
        .filter((row) => row.cells.length >= 2 && row.role !== 'header')
        .map((row) => ({ keys: row.cells[0], behavior: row.cells[1] }))
    : [];
  return {
    guidance: uniqueBy(guidance, (item) => item),
    keyboard,
  };
}

function extractStaticTokens(nodes) {
  const tables = findNodes(
    nodes,
    (node) =>
      attributeValue(node, 'role') === 'table' &&
      /token/i.test(attributeValue(node, 'aria-label') ?? ''),
  );
  return tables.flatMap((table) => {
    const rows = tableRows(table);
    const header = rows
      .find((row) => row.role === 'header')
      ?.cells.map((cell) => cell.toLowerCase());
    if (!header) return [];
    return rows
      .filter(
        (row) =>
          row.role !== 'header' &&
          row.cells[0]?.startsWith('--aeris-') &&
          !row.cells.some((cell) => cell.includes('{{')),
      )
      .map((row) => {
        const value = Object.fromEntries(header.map((key, index) => [key, row.cells[index] ?? '']));
        return {
          name: row.cells[0],
          type: value.type || 'CSS custom property',
          defaultValue: value.default || value.value || '',
          description: value.description || value.purpose || row.cells.at(-1) || '',
        };
      });
  });
}

function extractStaticApiTables(nodes) {
  const panel = findNode(
    nodes,
    (node) => node.name === 'aeris-tab-panel' && attributeValue(node, 'value') === 'api',
  );
  if (!panel) return [];
  return findNodes(
    panel.children ?? [],
    (node) => attributeValue(node, 'role') === 'table',
  ).flatMap((table) => {
    const rows = tableRows(table);
    const columns = rows.find((row) => row.role === 'header')?.cells ?? [];
    const body = rows
      .filter(
        (row) =>
          row.role !== 'header' &&
          row.cells.length > 0 &&
          !row.cells.some((cell) => cell.includes('{{')),
      )
      .map((row) => row.cells);
    if (!columns.length || !body.length) return [];
    return [
      {
        caption: attributeValue(table, 'aria-label') ?? 'API reference',
        columns,
        rows: body,
      },
    ];
  });
}

function tableRows(table) {
  return findNodes(table.children ?? [], (node) => attributeValue(node, 'role') === 'row').map(
    (row) => {
      const headerCells = findNodes(
        row.children ?? [],
        (node) => attributeValue(node, 'role') === 'columnheader',
      );
      const cells = (
        headerCells.length
          ? headerCells
          : findNodes(row.children ?? [], (node) => attributeValue(node, 'role') === 'cell')
      ).map((cell) => normalizeText(textContent(cell)));
      return { role: headerCells.length ? 'header' : 'row', cells };
    },
  );
}

function resolveAttribute(node, name, values) {
  const literal = attributeValue(node, name);
  if (literal !== undefined) return literal;
  const expression = attributeValue(node, `[${name}]`);
  if (expression === undefined) return undefined;
  const result = evaluateExpressionText(expression, values);
  return result === unsupported ? undefined : result;
}

function extractAerisImports(code) {
  const imports = [];
  for (const match of code.matchAll(
    /import\s*{([^}]+)}\s*from\s*['"]@aeris-ui\/core\/[^'"]+['"]/gs,
  )) {
    for (const item of match[1].split(',')) {
      const name = item
        .trim()
        .replace(/^type\s+/, '')
        .split(/\s+as\s+/)[0]
        ?.trim();
      if (name) imports.push(name);
    }
  }
  if (!imports.length) fail(`Could not identify an Aeris import in:\n${code}`);
  return [...new Set(imports)].sort();
}

function isApiEntryArray(value) {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every(
      (entry) =>
        isRecord(entry) &&
        typeof entry.name === 'string' &&
        typeof entry.type === 'string' &&
        typeof entry.description === 'string',
    )
  );
}

function classifyApiGroup(name) {
  const normalized = name.toLowerCase();
  if (normalized.includes('token')) return 'token';
  if (normalized.includes('input')) return 'input';
  if (normalized.includes('model')) return 'model';
  if (normalized.includes('output')) return 'output';
  if (/template|slot|content/.test(normalized)) return 'template';
  if (normalized.includes('method')) return 'method';
  if (normalized.includes('service')) return 'service';
  if (/propert|ref|config/.test(normalized)) return 'property';
  return 'other';
}

function normalizeApiEntry(entry) {
  return {
    name: String(entry.name).trim(),
    type: String(entry.type).trim(),
    ...(entry.defaultValue === undefined ? {} : { defaultValue: String(entry.defaultValue) }),
    description: String(entry.description).trim(),
  };
}

function uniqueApiEntries(entries) {
  return uniqueBy(entries.map(normalizeApiEntry), (entry) => entry.name);
}

function sanitizeGuides(guides) {
  return guides.map((guide) => ({
    id: guide.id,
    path: guide.path,
    group: guide.group,
    title: guide.title,
    description: guide.description,
    summary: guide.summary,
    sections: guide.sections.map((section) => ({
      id: section.id,
      title: section.title,
      ...(section.advanced === undefined ? {} : { advanced: section.advanced }),
      ...(section.paragraphs ? { paragraphs: section.paragraphs } : {}),
      ...(section.bullets ? { bullets: section.bullets } : {}),
      ...(section.code ? { code: section.code } : {}),
      ...(section.note ? { note: section.note } : {}),
      ...(section.table ? { table: section.table } : {}),
      ...(section.themePresets
        ? {
            themePresets: section.themePresets.map((preset) => ({
              id: preset.id,
              name: preset.name,
              description: preset.description,
            })),
          }
        : {}),
      ...(section.links ? { links: section.links } : {}),
    })),
    related: guide.related,
  }));
}

async function buildGuideExternalValues() {
  const versionSource = await readFile('projects/docs/src/app/data/aeris-version.ts', 'utf8');
  const releaseSource = await readFile(RELEASE_DATA_PATH, 'utf8');
  const paletteSource = await readFile(PALETTE_DATA_PATH, 'utf8');
  const values = evaluateModuleVariables(versionSource);
  Object.assign(values, evaluateModuleVariables(releaseSource, values));
  const presetStub = new Proxy(
    {},
    {
      get: (_target, key) => ({
        palette: { id: String(key) },
      }),
    },
  );
  const paletteValues = evaluateModuleVariables(paletteSource, {
    ...values,
    AERIS_THEME_PRESETS: presetStub,
  });
  return { ...values, ...paletteValues };
}

function evaluatePageClass(source) {
  const sourceFile = ts.createSourceFile('page.ts', source, ts.ScriptTarget.Latest, true);
  const moduleValues = evaluateModuleVariables(source);
  const classDeclaration = sourceFile.statements.find(
    (statement) => ts.isClassDeclaration(statement) && statement.name?.text.endsWith('Page'),
  );
  if (!classDeclaration) fail('Could not find a documentation page class.');

  const values = new Map(Object.entries(moduleValues));
  const pending = classDeclaration.members
    .filter((member) => ts.isPropertyDeclaration(member) && member.initializer)
    .map((member) => ({
      name: propertyName(member.name),
      expression: member.initializer,
    }))
    .filter((item) => item.name);

  evaluatePending(pending, values);
  return values;
}

function evaluateModuleVariables(source, externalValues = {}) {
  const sourceFile = ts.createSourceFile('module.ts', source, ts.ScriptTarget.Latest, true);
  const values = new Map(Object.entries(externalValues));
  const pending = [];
  for (const statement of sourceFile.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    for (const declaration of statement.declarationList.declarations) {
      if (ts.isIdentifier(declaration.name) && declaration.initializer) {
        pending.push({ name: declaration.name.text, expression: declaration.initializer });
      }
    }
  }
  evaluatePending(pending, values);
  return Object.fromEntries(values);
}

function evaluateExportedVariable(source, name, externalValues = {}) {
  return evaluateModuleVariables(source, externalValues)[name];
}

function evaluatePending(pending, values) {
  let remaining = pending;
  let progressed = true;
  while (remaining.length && progressed) {
    progressed = false;
    const next = [];
    for (const item of remaining) {
      const value = evaluateExpression(item.expression, values);
      if (value === unsupported) {
        next.push(item);
      } else {
        values.set(item.name, value);
        progressed = true;
      }
    }
    remaining = next;
  }
}

function evaluateExpressionText(expression, values) {
  const sourceFile = ts.createSourceFile(
    'expression.ts',
    `const value = (${expression});`,
    ts.ScriptTarget.Latest,
    true,
  );
  const statement = sourceFile.statements[0];
  const initializer = statement?.declarationList?.declarations?.[0]?.initializer;
  return initializer ? evaluateExpression(initializer, values) : unsupported;
}

function evaluateExpression(expression, values, locals = new Map()) {
  if (
    ts.isParenthesizedExpression(expression) ||
    ts.isAsExpression(expression) ||
    ts.isTypeAssertionExpression(expression) ||
    ts.isNonNullExpression(expression) ||
    ts.isSatisfiesExpression(expression)
  ) {
    return evaluateExpression(expression.expression, values, locals);
  }
  if (ts.isStringLiteralLike(expression)) return expression.text;
  if (ts.isNumericLiteral(expression)) return Number(expression.text);
  if (expression.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (expression.kind === ts.SyntaxKind.FalseKeyword) return false;
  if (expression.kind === ts.SyntaxKind.NullKeyword) return null;
  if (ts.isIdentifier(expression)) {
    if (expression.text === 'undefined') return undefined;
    if (locals.has(expression.text)) return locals.get(expression.text);
    return getValue(values, expression.text);
  }
  if (ts.isNoSubstitutionTemplateLiteral(expression)) return expression.text;
  if (ts.isTemplateExpression(expression)) {
    let result = expression.head.text;
    for (const span of expression.templateSpans) {
      const value = evaluateExpression(span.expression, values, locals);
      if (value === unsupported) return unsupported;
      result += String(value) + span.literal.text;
    }
    return result;
  }
  if (ts.isArrayLiteralExpression(expression)) {
    const result = [];
    for (const element of expression.elements) {
      if (ts.isSpreadElement(element)) {
        const value = evaluateExpression(element.expression, values, locals);
        if (!Array.isArray(value)) return unsupported;
        result.push(...value);
      } else {
        const value = evaluateExpression(element, values, locals);
        if (value === unsupported) return unsupported;
        result.push(value);
      }
    }
    return result;
  }
  if (ts.isObjectLiteralExpression(expression)) {
    const result = {};
    for (const property of expression.properties) {
      if (ts.isSpreadAssignment(property)) {
        const value = evaluateExpression(property.expression, values, locals);
        if (isRecord(value)) Object.assign(result, value);
        continue;
      }
      if (ts.isPropertyAssignment(property)) {
        const name = propertyName(property.name);
        const value = evaluateExpression(property.initializer, values, locals);
        if (name && value !== unsupported) result[name] = value;
      } else if (ts.isShorthandPropertyAssignment(property)) {
        const value = evaluateExpression(property.name, values, locals);
        if (value !== unsupported) result[property.name.text] = value;
      }
    }
    return result;
  }
  if (ts.isPropertyAccessExpression(expression)) {
    if (expression.expression.kind === ts.SyntaxKind.ThisKeyword) {
      return getValue(values, expression.name.text);
    }
    const owner = evaluateExpression(expression.expression, values, locals);
    if (owner === unsupported || owner === null || owner === undefined) return unsupported;
    return owner[expression.name.text] ?? unsupported;
  }
  if (ts.isElementAccessExpression(expression)) {
    const owner = evaluateExpression(expression.expression, values, locals);
    const key = evaluateExpression(expression.argumentExpression, values, locals);
    if (owner === unsupported || key === unsupported || owner == null) return unsupported;
    return owner[key] ?? unsupported;
  }
  if (ts.isBinaryExpression(expression)) {
    const left = evaluateExpression(expression.left, values, locals);
    const right = evaluateExpression(expression.right, values, locals);
    if (left === unsupported || right === unsupported) return unsupported;
    switch (expression.operatorToken.kind) {
      case ts.SyntaxKind.PlusToken:
        return left + right;
      case ts.SyntaxKind.EqualsEqualsToken:
        return left == right;
      case ts.SyntaxKind.EqualsEqualsEqualsToken:
        return left === right;
      case ts.SyntaxKind.ExclamationEqualsToken:
        return left != right;
      case ts.SyntaxKind.ExclamationEqualsEqualsToken:
        return left !== right;
      default:
        return unsupported;
    }
  }
  if (ts.isConditionalExpression(expression)) {
    const condition = evaluateExpression(expression.condition, values, locals);
    if (condition === unsupported) return unsupported;
    return evaluateExpression(
      condition ? expression.whenTrue : expression.whenFalse,
      values,
      locals,
    );
  }
  if (ts.isPrefixUnaryExpression(expression)) {
    const operand = evaluateExpression(expression.operand, values, locals);
    if (operand === unsupported) return unsupported;
    if (expression.operator === ts.SyntaxKind.MinusToken) return -operand;
    if (expression.operator === ts.SyntaxKind.PlusToken) return +operand;
    if (expression.operator === ts.SyntaxKind.ExclamationToken) return !operand;
  }
  if (ts.isCallExpression(expression)) {
    if (ts.isIdentifier(expression.expression) && expression.expression.text === 'source') {
      const args = expression.arguments.map((argument) =>
        evaluateExpression(argument, values, locals),
      );
      if (args.some((value) => value === unsupported)) return unsupported;
      return { label: args[0], language: args[1], code: args[2] };
    }
    if (
      ts.isPropertyAccessExpression(expression.expression) &&
      expression.expression.name.text === 'map' &&
      expression.arguments.length === 1 &&
      (ts.isArrowFunction(expression.arguments[0]) ||
        ts.isFunctionExpression(expression.arguments[0]))
    ) {
      const source = evaluateExpression(expression.expression.expression, values, locals);
      if (!Array.isArray(source)) return unsupported;
      const callback = expression.arguments[0];
      if (!ts.isExpression(callback.body)) return unsupported;
      return source.map((item, index) => {
        const callbackLocals = new Map(locals);
        if (callback.parameters[0] && ts.isIdentifier(callback.parameters[0].name)) {
          callbackLocals.set(callback.parameters[0].name.text, item);
        }
        if (callback.parameters[1] && ts.isIdentifier(callback.parameters[1].name)) {
          callbackLocals.set(callback.parameters[1].name.text, index);
        }
        return evaluateExpression(callback.body, values, callbackLocals);
      });
    }
  }
  return unsupported;
}

function getValue(values, name) {
  if (values instanceof Map) return values.has(name) ? values.get(name) : unsupported;
  return Object.hasOwn(values, name) ? values[name] : unsupported;
}

function propertyName(name) {
  if (ts.isIdentifier(name) || ts.isStringLiteralLike(name) || ts.isNumericLiteral(name)) {
    return name.text;
  }
  return undefined;
}

function findNodes(nodes, predicate) {
  const result = [];
  visit(nodes, (node) => {
    if (predicate(node)) result.push(node);
  });
  return result;
}

function findNode(nodes, predicate) {
  let result;
  visit(nodes, (node) => {
    if (!result && predicate(node)) result = node;
  });
  return result;
}

function visit(nodes, callback) {
  for (const node of nodes ?? []) {
    callback(node);
    visit(node.children, callback);
    for (const branch of node.branches ?? []) visit(branch.children, callback);
  }
}

function attributeValue(node, name) {
  return node?.attrs?.find((attribute) => attribute.name === name)?.value;
}

function textContent(node) {
  let result = '';
  visit(node?.children ?? [], (child) => {
    if (typeof child.value === 'string') result += child.value;
  });
  return result;
}

function normalizeCode(value) {
  const normalized = value.replace(/\r\n/g, '\n').trim();
  const lines = normalized.split('\n');
  const indents = lines
    .slice(1)
    .filter((line) => line.trim())
    .map((line) => line.match(/^\s*/)?.[0].length ?? 0);
  const indent = indents.length ? Math.min(...indents) : 0;
  return lines
    .map((line, index) => (index === 0 ? line.trimStart() : line.slice(indent)))
    .join('\n')
    .trimEnd();
}

function normalizeText(value) {
  return value.replace(/\s+/g, ' ').trim();
}

function humanize(value) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[-_]+/g, ' ')
    .replace(/^./, (character) => character.toUpperCase());
}

function slugify(value) {
  return value
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/\s+/g, '-')
    .toLowerCase();
}

function uniqueBy(values, key) {
  const seen = new Set();
  return values.filter((value) => {
    const identity = key(value);
    if (seen.has(identity)) return false;
    seen.add(identity);
    return true;
  });
}

function isRecord(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function prereleaseStatus(version) {
  if (version.includes('-alpha')) return 'alpha';
  if (version.includes('-beta') || version.includes('-rc')) return 'beta';
  return 'stable';
}

function normalizeRepositoryUrl(url) {
  return url.replace(/^git\+/, '').replace(/\.git$/, '');
}

function renderComponentMarkdown(
  component,
  library,
  { headingOffset = 0, includeLibraryContext = true } = {},
) {
  const heading = (level, title) => `${'#'.repeat(level + headingOffset)} ${title}`;
  const lines = [heading(1, component.name), '', `> ${component.description}`, ''];

  if (includeLibraryContext) {
    lines.push(
      `Aeris ${library.version} is ${library.status} software for Angular ${library.angularPeerRange}. It is not production ready.`,
      '',
      `- Package entry point: \`${component.entryPoint}\``,
      `- Human-readable documentation: [${component.documentationUrl}](${component.documentationUrl})`,
      '- Icons: Aeris accepts consumer-provided icons from any icon library; documentation examples use Lucide.',
      '',
      heading(2, 'Global styles'),
      '',
      'Load these styles once in the application global stylesheet:',
      '',
      fencedCode('css', library.styleImports.join('\n')),
      '',
    );
  }

  lines.push(heading(2, 'Import'), '', fencedCode('ts', component.importCode), '');

  if (component.api.length || component.referenceTables.length) {
    lines.push(heading(2, 'API'), '');
    for (const group of component.api) {
      lines.push(
        heading(3, group.name),
        '',
        markdownTable(
          ['Name', 'Type', 'Default', 'Description'],
          group.entries.map((entry) => [
            inlineCode(entry.name),
            inlineCode(entry.type),
            entry.defaultValue === undefined ? '—' : inlineCode(entry.defaultValue),
            entry.description,
          ]),
        ),
        '',
      );
    }
    for (const table of component.referenceTables) {
      lines.push(heading(3, table.caption), '', markdownTable(table.columns, table.rows), '');
    }
  }

  if (component.interfaces.length) {
    lines.push(heading(2, 'Interfaces and types'), '');
    for (const block of component.interfaces) {
      lines.push(heading(3, block.name), '', fencedCode('ts', block.code), '');
    }
  }

  if (component.designTokens.length) {
    lines.push(
      heading(2, 'Design tokens'),
      '',
      markdownTable(
        ['Token', 'Type', 'Default', 'Description'],
        component.designTokens.map((token) => [
          inlineCode(token.name),
          inlineCode(token.type),
          token.defaultValue ? inlineCode(token.defaultValue) : '—',
          token.description,
        ]),
      ),
      '',
    );
  }

  lines.push(heading(2, 'Examples'), '');
  for (const example of component.examples) {
    lines.push(heading(3, example.title), '', example.description, '');
    for (const source of example.sources) {
      lines.push(
        heading(4, source.label),
        '',
        fencedCode(markdownLanguage(source.language), source.code),
        '',
      );
    }
  }

  lines.push(heading(2, 'Accessibility'), '');
  for (const item of component.accessibility.guidance) lines.push(`- ${item}`);
  lines.push(
    '',
    heading(3, 'Keyboard support'),
    '',
    markdownTable(
      ['Key', 'Function'],
      component.accessibility.keyboard.map((row) => [inlineCode(row.keys), row.behavior]),
    ),
    '',
  );
  return normalizeGeneratedText(lines.join('\n'));
}

function renderLlms(documentation, major) {
  const { library, guides, components, categories } = documentation;
  const lines = [
    '# Aeris UI',
    '',
    `> Aeris UI ${library.version} is an accessible, responsive, themeable Angular ${major} component library using standalone and signal-based APIs. It is currently alpha software and is not production ready.`,
    '',
    'Use component secondary entry points and load both global Aeris styles once. Aeris has no required icon library; the documentation uses Lucide only to demonstrate consumer-provided icons. Components are designed for WCAG 2.2 AA, mobile layouts, light and dark themes, RTL, Tailwind CSS, and Bootstrap coexistence.',
    '',
    'Prefer the component Markdown files for focused implementation context, `llms-full.txt` for one self-contained context file, and `aeris-docs.json` for structured retrieval or tooling.',
    '',
    '## Essential documentation',
    '',
    `- [Installation](${DOCS_ORIGIN}/guides/installation): Install and configure Aeris, including global styles and the theme provider.`,
    `- [Configuration](${DOCS_ORIGIN}/guides/configuration): Configure runtime behavior, themes, direction, density, and corners.`,
    `- [Theming](${DOCS_ORIGIN}/guides/theming): Use built-in themes, custom palettes, runtime theming, and build-time generation.`,
    `- [Accessibility](${DOCS_ORIGIN}/guides/accessibility): Understand the Aeris accessibility contract and consumer responsibilities.`,
    `- [Canonical JSON](${DOCS_ORIGIN}/ai/${major}/aeris-docs.json): Versioned structured documentation for programmatic retrieval.`,
    `- [Full LLM context](${DOCS_ORIGIN}/llms-full.txt): All Aeris guides and component references in one Markdown document.`,
    '',
    '## Guides',
    '',
    ...guides.map(
      (guide) => `- [${guide.title}](${DOCS_ORIGIN}${guide.path}): ${guide.description}`,
    ),
    '',
  ];

  for (const category of categories) {
    lines.push(`## ${category} components`, '');
    for (const component of components.filter((item) => item.category === category)) {
      lines.push(
        `- [${component.name}](${componentMarkdownUrl(component, major)}): ${component.description}`,
      );
    }
    lines.push('');
  }

  lines.push(
    '## Optional',
    '',
    `- [JSON Schema](${DOCS_ORIGIN}/ai/schema/aeris-docs.schema.v1.json): Schema version ${documentation.schemaVersion} for the canonical JSON corpus.`,
    `- [Repository](${library.repositoryUrl}): Aeris source, tests, documentation, and contribution guidance.`,
    `- [Changelog](${DOCS_ORIGIN}/guides/changelog): Consumer-visible release history and current alpha work.`,
    '',
  );
  return normalizeGeneratedText(lines.join('\n'));
}

function renderLlmsFull(documentation) {
  const { library } = documentation;
  const lines = [
    '# Aeris UI full documentation',
    '',
    `> Complete machine-readable context for Aeris UI ${library.version}, an Angular ${library.angularPeerRange} component library. Aeris is currently ${library.status} software and is not production ready.`,
    '',
    'This generated document combines the canonical developer guides and every component reference. The source documentation, generated component Markdown, and canonical JSON are validated together during documentation builds.',
    '',
    '## Library contract',
    '',
    `- Package: \`${library.name}\``,
    `- Version: \`${library.version}\``,
    `- Angular peer range: \`${library.angularPeerRange}\``,
    `- License: ${library.license}`,
    ...library.principles.map((principle) => `- ${principle}`),
    '',
    '### Global styles',
    '',
    fencedCode('css', library.styleImports.join('\n')),
    '',
    '## Developer guides',
    '',
  ];

  for (const guide of documentation.guides) {
    lines.push(renderGuideMarkdown(guide));
  }

  lines.push('## Component reference', '');
  for (const component of documentation.components) {
    lines.push(
      renderComponentMarkdown(component, library, {
        headingOffset: 2,
        includeLibraryContext: false,
      }),
    );
  }
  return normalizeGeneratedText(lines.join('\n'));
}

function renderGuideMarkdown(guide) {
  const lines = [
    `### ${guide.title}`,
    '',
    `> ${guide.description}`,
    '',
    guide.summary,
    '',
    `Human-readable documentation: [${DOCS_ORIGIN}${guide.path}](${DOCS_ORIGIN}${guide.path})`,
    '',
  ];
  for (const section of guide.sections) {
    lines.push(`#### ${section.title}`, '');
    for (const paragraph of section.paragraphs ?? []) lines.push(paragraph, '');
    for (const bullet of section.bullets ?? []) lines.push(`- ${bullet}`);
    if (section.bullets?.length) lines.push('');
    if (section.note) lines.push(`> Note: ${section.note}`, '');
    if (section.table) {
      lines.push(markdownTable(section.table.columns, section.table.rows), '');
    }
    for (const source of section.code ?? []) {
      lines.push(
        `##### ${source.label}`,
        '',
        fencedCode(markdownLanguage(source.language), source.code),
        '',
      );
    }
    if (section.themePresets?.length) {
      for (const preset of section.themePresets) {
        lines.push(`- **${preset.name}:** ${preset.description}`);
      }
      lines.push('');
    }
    for (const link of section.links ?? []) {
      const href = link.href.startsWith('/') ? `${DOCS_ORIGIN}${link.href}` : link.href;
      lines.push(`- [${link.label}](${href})`);
    }
    if (section.links?.length) lines.push('');
  }
  if (guide.related.length) {
    lines.push(
      '#### Related guides',
      '',
      ...guide.related.map((id) => `- [${humanize(id)}](${DOCS_ORIGIN}/guides/${id})`),
      '',
    );
  }
  return lines.join('\n');
}

function componentMarkdownUrl(component, major) {
  return `${DOCS_ORIGIN}/ai/${major}/components/${component.slug}.md`;
}

function markdownTable(columns, rows) {
  const renderRow = (row) => `| ${row.map(markdownTableCell).join(' | ')} |`;
  return [
    renderRow(columns),
    renderRow(columns.map(() => '---')),
    ...rows.map((row) => renderRow(row)),
  ].join('\n');
}

function markdownTableCell(value) {
  return String(value ?? '')
    .replaceAll('|', '&#124;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replace(/\r?\n/g, '<br>')
    .trim();
}

function inlineCode(value) {
  return `\`${String(value).replaceAll('`', '&#96;').replaceAll('|', '&#124;')}\``;
}

function fencedCode(language, code) {
  const longestFence = Math.max(
    2,
    ...[...String(code).matchAll(/`+/g)].map((match) => match[0].length),
  );
  const fence = '`'.repeat(longestFence + 1);
  return `${fence}${language}\n${normalizeCode(String(code))}\n${fence}`;
}

function markdownLanguage(language) {
  return (
    {
      TypeScript: 'ts',
      HTML: 'html',
      CSS: 'css',
      SCSS: 'scss',
      JSON: 'json',
      Shell: 'bash',
    }[language] ?? String(language).toLowerCase()
  );
}

function normalizeGeneratedText(value) {
  return `${value.replace(/\r\n?/g, '\n').trim()}\n`;
}

function validateMarkdownOutputs(documentation, outputs, major) {
  const llms = outputs.get(LLMS_PATH);
  const full = outputs.get(LLMS_FULL_PATH);
  if (!llms.startsWith('# Aeris UI\n\n> '))
    fail(`${LLMS_PATH} does not follow the llms.txt preamble.`);
  if (!full.startsWith('# Aeris UI full documentation\n\n> ')) {
    fail(`${LLMS_FULL_PATH} does not have the expected full-context preamble.`);
  }
  for (const component of documentation.components) {
    const path = join(COMPONENT_MARKDOWN_ROOT, `${component.slug}.md`);
    const markdown = outputs.get(path);
    if (!markdown?.startsWith(`# ${component.name}\n`)) {
      fail(`${path} does not start with its component heading.`);
    }
    if (!markdown.includes(normalizeCode(component.importCode))) {
      fail(`${path} is missing its documented import.`);
    }
    if (!llms.includes(componentMarkdownUrl(component, major))) {
      fail(`${LLMS_PATH} does not link to ${component.slug}.md.`);
    }
    if (!full.includes(`### ${component.name}\n`)) {
      fail(`${LLMS_FULL_PATH} is missing ${component.name}.`);
    }
  }
  for (const guide of documentation.guides) {
    if (!full.includes(`### ${guide.title}\n`)) {
      fail(`${LLMS_FULL_PATH} is missing the ${guide.title} guide.`);
    }
  }
  for (const [path, output] of outputs) {
    if (output.includes('[object Object]')) fail(`${path} contains an unserialized object.`);
  }
}

function validateDocument(value) {
  if (value.schemaVersion !== SCHEMA_VERSION) fail('Unexpected AI documentation schema version.');
  if (value.components.length !== COMPONENT_CATALOG.length) {
    fail('The generated component count does not match the component catalog.');
  }
  const componentIds = new Set();
  const exampleIds = new Set();
  for (const component of value.components) {
    if (componentIds.has(component.slug)) fail(`Duplicate component slug: ${component.slug}.`);
    componentIds.add(component.slug);
    if (!component.imports.length) fail(`${component.slug} has no documented Aeris import.`);
    if (!component.examples.length) fail(`${component.slug} has no extractable examples.`);
    if (!component.accessibility.guidance.length) {
      fail(`${component.slug} has no extractable accessibility guidance.`);
    }
    if (!component.accessibility.keyboard.length) {
      fail(`${component.slug} has no extractable keyboard support table.`);
    }
    for (const example of component.examples) {
      if (exampleIds.has(example.id)) fail(`Duplicate example id: ${example.id}.`);
      exampleIds.add(example.id);
      if (!example.sources.some((source) => source.language === 'TypeScript')) {
        fail(`${example.id} does not produce a complete TypeScript example.`);
      }
    }
  }
  const guideIds = new Set(value.guides.map((guide) => guide.id));
  for (const guide of value.guides) {
    for (const related of guide.related) {
      if (!guideIds.has(related)) fail(`${guide.id} links to missing guide ${related}.`);
    }
  }
}

function validateAgainstSchema(value, schema, rootSchema, path = '$') {
  if (schema.$ref) {
    const target = schema.$ref
      .replace(/^#\//, '')
      .split('/')
      .reduce(
        (current, segment) => current?.[segment.replaceAll('~1', '/').replaceAll('~0', '~')],
        rootSchema,
      );
    return target
      ? validateAgainstSchema(value, target, rootSchema, path)
      : [`${path}: unresolved schema reference ${schema.$ref}.`];
  }

  const errors = [];
  if (schema.const !== undefined && value !== schema.const) {
    errors.push(`${path}: expected the constant value ${JSON.stringify(schema.const)}.`);
  }
  if (schema.enum && !schema.enum.includes(value)) {
    errors.push(`${path}: expected one of ${schema.enum.join(', ')}.`);
  }
  if (schema.type && !matchesJsonType(value, schema.type)) {
    return [`${path}: expected ${schema.type}, received ${jsonType(value)}.`];
  }
  if (typeof value === 'string') {
    if (schema.minLength !== undefined && value.length < schema.minLength) {
      errors.push(`${path}: string is shorter than ${schema.minLength}.`);
    }
    if (schema.pattern && !new RegExp(schema.pattern).test(value)) {
      errors.push(`${path}: value does not match ${schema.pattern}.`);
    }
    if (schema.format === 'uri') {
      try {
        new URL(value);
      } catch {
        errors.push(`${path}: value is not a valid URI.`);
      }
    }
  }
  if (Array.isArray(value)) {
    if (schema.minItems !== undefined && value.length < schema.minItems) {
      errors.push(`${path}: array has fewer than ${schema.minItems} items.`);
    }
    if (schema.uniqueItems) {
      const serialized = value.map((item) => JSON.stringify(item));
      if (new Set(serialized).size !== serialized.length) {
        errors.push(`${path}: array items must be unique.`);
      }
    }
    if (schema.items) {
      value.forEach((item, index) => {
        errors.push(...validateAgainstSchema(item, schema.items, rootSchema, `${path}[${index}]`));
      });
    }
  }
  if (isRecord(value)) {
    for (const required of schema.required ?? []) {
      if (!Object.hasOwn(value, required))
        errors.push(`${path}: missing required property ${required}.`);
    }
    for (const [key, item] of Object.entries(value)) {
      if (schema.properties?.[key]) {
        errors.push(
          ...validateAgainstSchema(item, schema.properties[key], rootSchema, `${path}.${key}`),
        );
      } else if (schema.additionalProperties === false) {
        errors.push(`${path}: unexpected property ${key}.`);
      } else if (isRecord(schema.additionalProperties)) {
        errors.push(
          ...validateAgainstSchema(item, schema.additionalProperties, rootSchema, `${path}.${key}`),
        );
      }
    }
  }
  return errors;
}

function matchesJsonType(value, type) {
  return jsonType(value) === type;
}

function jsonType(value) {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  if (typeof value === 'number') return Number.isInteger(value) ? 'integer' : 'number';
  if (typeof value === 'object') return 'object';
  return typeof value;
}

function fail(message) {
  throw new Error(message);
}
