import { readdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, extname, join, relative, resolve } from 'node:path';

import { HtmlParser } from '@angular/compiler';
import * as sass from 'sass';
import ts from 'typescript';

const ROOT = 'projects/docs/src/app/pages/components';
const GENERATED_STYLES = 'projects/docs/src/app/shared/generated-example-styles.ts';
const SHARED_LAYOUT_CLASSES = new Set([
  'aeris-example-row',
  'align',
  'field',
  'field-grid',
  'field-row',
  'field-stack',
  'size-sample',
  'stack',
  'wrap',
]);
const write = process.argv.includes('--write');
const reportStyles = process.argv.includes('--report-styles');
const parser = new HtmlParser();
const files = await findHtmlFiles(ROOT);
let examples = 0;
let mismatches = 0;
let changedFiles = 0;
const diagnostics = [];
const uncoveredStyles = [];
const generatedStyles = {};

for (const path of files) {
  const source = await readFile(path, 'utf8');
  const pageStyles = await compilePageStyles(path);
  const cssProperties = await readCssProperties(path);
  // Block syntax remains plain text here so copied object literals and control-flow
  // braces inside ngNonBindable code elements cannot be mistaken for live blocks.
  const parsed = parser.parse(source, path, { tokenizeBlocks: false });
  if (parsed.errors.length) {
    throw new Error(`${path} could not be audited:\n${parsed.errors.join('\n')}`);
  }

  const demos = [];
  visit(parsed.rootNodes, (node) => {
    if (node.name === 'app-form-demo' || node.name === 'app-button-demo') demos.push(node);
  });

  const replacements = [];
  for (const demo of demos) {
    const preview = findDescendant(demo, (node) => hasAttribute(node, 'preview'));
    const code = findDescendant(demo, (node) => node.name === 'pre' && hasAttribute(node, 'code'));
    if (!preview || !code) continue;

    examples += 1;
    const codeElement = findDescendant(code, (node) => node.name === 'code');
    if (!codeElement) {
      diagnostics.push(`${path}: ${attributeValue(demo, 'id') ?? 'unknown'} has no code element.`);
      continue;
    }

    const previewSource = source.slice(
      preview.sourceSpan.start.offset,
      preview.sourceSpan.end.offset,
    );
    const expected = normalizeCode(
      normalizePreviewSource(previewSource, demo.name === 'app-button-demo'),
    );
    const customClasses = classNames(expected).filter((name) => !SHARED_LAYOUT_CLASSES.has(name));
    if (customClasses.length) {
      const anchor = attributeValue(demo, 'id') ?? 'unknown';
      const cssExpression =
        attributeValue(demo, '[cssCode]') ?? attributeValue(demo, 'cssCode') ?? '';
      const explicitCss = cssProperties[cssExpression.replace(/^this\./, '')] ?? '';
      const uncoveredClasses = customClasses.filter(
        (name) => !new RegExp(`\\.${escapeRegExp(name)}(?![a-zA-Z0-9_-])`).test(explicitCss),
      );
      const css = extractMatchingCss(pageStyles, uncoveredClasses);
      if (css) generatedStyles[anchor] = css;
      const unresolvedClasses = uncoveredClasses.filter(
        (name) => !new RegExp(`\\.${escapeRegExp(name)}(?![a-zA-Z0-9_-])`).test(css),
      );
      if (unresolvedClasses.length) {
        uncoveredStyles.push(
          `${relative('.', path)}: ${anchor} -> ${unresolvedClasses.join(', ')}`,
        );
      }
    }
    const actual = normalizeCode(textContent(codeElement));
    const isNonBindable = hasAttribute(codeElement, 'ngNonBindable');
    const codeSource = source.slice(
      codeElement.sourceSpan.start.offset,
      codeElement.sourceSpan.end.offset,
    );
    const hasSafeTemplateSyntax = !/[@{}]/.test(codeSource);
    if (expected === actual && isNonBindable && hasSafeTemplateSyntax) continue;

    mismatches += 1;
    diagnostics.push(
      `${relative('.', path)}: ${attributeValue(demo, 'id') ?? 'unknown'}${
        expected !== actual
          ? ' markup differs'
          : !isNonBindable
            ? ' needs ngNonBindable'
            : ' needs escaped template syntax'
      }`,
    );
    if (!write) continue;

    const indent = lineIndent(source, code.sourceSpan.start.offset);
    replacements.push({
      start: code.sourceSpan.start.offset,
      end: code.sourceSpan.end.offset,
      value: `${indent}<pre code><code ngNonBindable>${escapeHtml(expected)}</code></pre>`,
    });
  }

  if (!replacements.length) continue;
  let updated = source;
  for (const replacement of replacements.sort((left, right) => right.start - left.start)) {
    updated =
      updated.slice(0, replacement.start) +
      replacement.value.trimStart() +
      updated.slice(replacement.end);
  }
  await writeFile(path, updated, 'utf8');
  changedFiles += 1;
}

const generatedStyleSource = renderGeneratedStyles(generatedStyles);
const currentGeneratedStyles = await readFile(GENERATED_STYLES, 'utf8').catch(() => '');
const generatedStylesDiffer = currentGeneratedStyles !== generatedStyleSource;
if (write && generatedStylesDiffer) {
  await writeFile(GENERATED_STYLES, generatedStyleSource, 'utf8');
}

if (reportStyles) {
  process.stdout.write(`${uncoveredStyles.join('\n')}\n`);
  process.stdout.write(
    `${uncoveredStyles.length} examples use custom classes without CSS input.\n`,
  );
} else if (write) {
  process.stdout.write(
    `Synchronized ${mismatches} of ${examples} documentation examples across ${changedFiles} files${
      generatedStylesDiffer ? ' and refreshed example styles' : ''
    }.\n`,
  );
} else if (diagnostics.length || generatedStylesDiffer || uncoveredStyles.length) {
  if (generatedStylesDiffer) diagnostics.push(`${GENERATED_STYLES} is out of date.`);
  diagnostics.push(...uncoveredStyles.map((item) => `${item} has no reproducible CSS.`));
  process.stderr.write(`${diagnostics.slice(0, 80).join('\n')}\n`);
  if (diagnostics.length > 80) {
    process.stderr.write(`...and ${diagnostics.length - 80} more.\n`);
  }
  process.stderr.write(
    `${mismatches} of ${examples} documentation examples do not match their live preview. Run npm run sync:doc-examples.\n`,
  );
  process.exitCode = 1;
} else {
  process.stdout.write(`All ${examples} documentation examples match their live previews.\n`);
}

async function findHtmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const paths = await Promise.all(
    entries.map((entry) => {
      const path = join(directory, entry.name);
      return entry.isDirectory() ? findHtmlFiles(path) : [path];
    }),
  );
  return paths.flat().filter((path) => extname(path) === '.html');
}

function visit(nodes, callback) {
  for (const node of nodes) {
    callback(node);
    visit(node.children ?? [], callback);
    for (const branch of node.branches ?? []) visit(branch.children ?? [], callback);
  }
}

function findDescendant(node, predicate) {
  let result;
  visit(node.children ?? [], (candidate) => {
    if (!result && predicate(candidate)) result = candidate;
  });
  return result;
}

function hasAttribute(node, name) {
  return Boolean(node.attrs?.some((attribute) => attribute.name === name));
}

function attributeValue(node, name) {
  return node.attrs?.find((attribute) => attribute.name === name)?.value;
}

function textContent(node) {
  let value = '';
  visit(node.children ?? [], (child) => {
    if (typeof child.value === 'string') value += child.value;
  });
  return value;
}

function normalizePreviewSource(source, buttonDemo) {
  const openingEnd = source.indexOf('>');
  if (openingEnd < 0) return source;
  let opening = source
    .slice(0, openingEnd + 1)
    .replace(/\s+preview(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))?/, '');
  if (buttonDemo) opening = addClass(opening, 'aeris-example-row');
  return opening + source.slice(openingEnd + 1);
}

function addClass(opening, className) {
  if (/\bclass\s*=\s*"/.test(opening)) {
    return opening.replace(/\bclass\s*=\s*"([^"]*)"/, (_match, value) => {
      const classes = new Set(value.split(/\s+/).filter(Boolean));
      classes.add(className);
      return `class="${[...classes].join(' ')}"`;
    });
  }
  return opening.replace(/^(\s*<[\w-]+)/, `$1 class="${className}"`);
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

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('@', '&#64;')
    .replaceAll('{', '&#123;')
    .replaceAll('}', '&#125;');
}

function lineIndent(source, offset) {
  const lineStart = source.lastIndexOf('\n', offset - 1) + 1;
  return source.slice(lineStart, offset).match(/^\s*/)?.[0] ?? '';
}

function classNames(source) {
  return [
    ...new Set(
      [...source.matchAll(/\bclass\s*=\s*["']([^"']*)["']/g)].flatMap((match) =>
        (match[1] ?? '').split(/\s+/).filter(Boolean),
      ),
    ),
  ];
}

async function compilePageStyles(htmlPath) {
  let stylePath = htmlPath.replace(/\.html$/, '.scss');
  try {
    await readFile(stylePath, 'utf8');
  } catch {
    const componentSource = await readFile(htmlPath.replace(/\.html$/, '.ts'), 'utf8').catch(
      () => '',
    );
    const configuredStyle = /styleUrl\s*:\s*['"]([^'"]+)['"]/.exec(componentSource)?.[1];
    if (configuredStyle) stylePath = resolve(dirname(htmlPath), configuredStyle);
  }
  try {
    return sass.compile(stylePath, { style: 'expanded', quietDeps: true }).css;
  } catch (error) {
    if (String(error).includes('no such file or directory')) return '';
    throw error;
  }
}

async function readCssProperties(htmlPath) {
  const path = htmlPath.replace(/\.html$/, '.ts');
  const source = await readFile(path, 'utf8').catch(() => '');
  const file = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const declarations = new Map();
  const visitNode = (node) => {
    if (ts.isPropertyDeclaration(node) && ts.isIdentifier(node.name) && node.initializer) {
      declarations.set(node.name.text, node.initializer);
    }
    ts.forEachChild(node, visitNode);
  };
  visitNode(file);

  const values = {};
  const resolveValue = (name, seen = new Set()) => {
    if (values[name] !== undefined) return values[name];
    if (seen.has(name)) return '';
    seen.add(name);
    const initializer = declarations.get(name);
    if (!initializer) return '';
    if (ts.isStringLiteral(initializer) || ts.isNoSubstitutionTemplateLiteral(initializer)) {
      return (values[name] = initializer.text);
    }
    if (
      ts.isPropertyAccessExpression(initializer) &&
      initializer.expression.kind === ts.SyntaxKind.ThisKeyword
    ) {
      return (values[name] = resolveValue(initializer.name.text, seen));
    }
    return '';
  };
  for (const name of declarations.keys()) resolveValue(name);
  return values;
}

function extractMatchingCss(source, classes) {
  const patterns = classes.map((name) => new RegExp(`\\.${escapeRegExp(name)}(?![a-zA-Z0-9_-])`));
  return normalizePublicCss(selectCssRules(source, patterns));
}

function selectCssRules(source, patterns) {
  const output = [];
  let cursor = 0;
  while (cursor < source.length) {
    const opening = source.indexOf('{', cursor);
    if (opening < 0) break;
    const headerStart =
      Math.max(source.lastIndexOf('}', opening - 1), source.lastIndexOf(';', opening - 1)) + 1;
    const header = source.slice(headerStart, opening).trim();
    const closing = matchingBrace(source, opening);
    if (closing < 0) break;
    const body = source.slice(opening + 1, closing);

    if (
      header.startsWith('@media') ||
      header.startsWith('@supports') ||
      header.startsWith('@container')
    ) {
      const selected = selectCssRules(body, patterns);
      if (selected) output.push(`${header} {\n${indent(selected, 2)}\n}`);
    } else if (!header.startsWith('@') && patterns.some((pattern) => pattern.test(header))) {
      output.push(`${stripDocumentationScope(header)} {${body}}`);
    }
    cursor = closing + 1;
  }
  return output.join('\n\n');
}

function matchingBrace(source, opening) {
  let depth = 0;
  for (let index = opening; index < source.length; index += 1) {
    if (source[index] === '{') depth += 1;
    else if (source[index] === '}') {
      depth -= 1;
      if (depth === 0) return index;
    }
  }
  return -1;
}

function stripDocumentationScope(selector) {
  return selector
    .replace(/\.(?:button|[a-z0-9-]+)-docs\s+/gi, '')
    .replaceAll('::ng-deep ', '')
    .trim();
}

function normalizePublicCss(source) {
  const aliases = {
    '--border': '--aeris-border',
    '--danger': '--aeris-danger',
    '--focus': '--aeris-focus',
    '--page': '--aeris-page',
    '--primary': '--aeris-primary',
    '--primary-text': '--aeris-primary-text',
    '--radius-md': '--aeris-radius-md',
    '--success': '--aeris-success',
    '--surface': '--aeris-surface',
    '--surface-2': '--aeris-surface-2',
    '--surface-3': '--aeris-surface-3',
    '--text': '--aeris-text',
    '--text-2': '--aeris-text-2',
    '--text-3': '--aeris-text-3',
    '--warning': '--aeris-warning',
  };
  let result = source;
  for (const [alias, token] of Object.entries(aliases).sort(
    ([left], [right]) => right.length - left.length,
  )) {
    result = result.replaceAll(`var(${alias})`, `var(${token})`);
  }
  return result.replace(/\n{3,}/g, '\n\n').trim();
}

function renderGeneratedStyles(styles) {
  const entries = Object.entries(styles)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([anchor, css]) => `  ${JSON.stringify(anchor)}: ${JSON.stringify(css)},`)
    .join('\n');
  return `// Generated by tools/sync-doc-examples.mjs. Do not edit manually.\nexport const DOC_EXAMPLE_STYLES: Readonly<Record<string, string>> = {\n${entries}\n};\n`;
}

function indent(value, spaces) {
  const prefix = ' '.repeat(spaces);
  return value
    .split('\n')
    .map((line) => `${prefix}${line}`)
    .join('\n');
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
