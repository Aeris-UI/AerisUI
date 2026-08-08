import { readdir, readFile, writeFile } from 'node:fs/promises';
import { basename, dirname, extname, join, relative } from 'node:path';

import ts from 'typescript';

const LIBRARY_ROOT = 'projects/aeris-ui';
const DOCS_ROOT = 'projects/docs/src/app/pages/components';
const write = process.argv.includes('--write');

const libraryFiles = (await findFiles(LIBRARY_ROOT)).filter(isSourceFile);
const pageFiles = (await findFiles(DOCS_ROOT)).filter((path) => path.endsWith('.page.ts'));
const aliases = new Map();

for (const path of libraryFiles) {
  const source = await readFile(path, 'utf8');
  const sourceFile = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true);
  for (const statement of sourceFile.statements) {
    if (ts.isTypeAliasDeclaration(statement)) {
      aliases.set(statement.name.text, { node: statement.type, path });
    }
  }
}

const finiteAliases = new Map();
for (const name of aliases.keys()) {
  const values = resolveFiniteAlias(name, new Set());
  if (values?.length && values.length <= 32) finiteAliases.set(name, values);
}

const pagesByEntryPoint = new Map();
const pageRecords = new Map();
for (const path of pageFiles) {
  const entryPoint = basename(dirname(path));
  const paths = pagesByEntryPoint.get(entryPoint) ?? [];
  paths.push(path);
  pagesByEntryPoint.set(entryPoint, paths);
  pageRecords.set(path, await readApiRows(path));
}

const diagnostics = [];
let updatedRows = 0;

for (const [path, page] of pageRecords) {
  const replacements = [];
  for (const row of page.rows) {
    const referenced = [...finiteAliases.entries()].filter(([name]) =>
      new RegExp(`\\b${escapeRegExp(name)}\\b`).test(row.type),
    );
    if (!referenced.length) continue;

    const missing = referenced.flatMap(([name, values]) =>
      hasEveryOption(`${row.type} ${row.description}`, values) ? [] : [{ name, values }],
    );
    if (!missing.length) continue;

    diagnostics.push(
      `${relative('.', path)}: ${row.name} does not list every option for ${missing
        .map((item) => item.name)
        .join(', ')}.`,
    );
    if (!write) continue;

    const options = unique(missing.flatMap((item) => item.values));
    const suffix = `Options: ${options.map(formatOption).join(', ')}.`;
    const description = `${row.description.trim().replace(/[.]?$/, '.')} ${suffix}`;
    replacements.push({
      start: row.descriptionNode.getStart(page.sourceFile),
      end: row.descriptionNode.getEnd(),
      value: JSON.stringify(description),
    });
    updatedRows += 1;
  }

  if (write && replacements.length) {
    let updated = page.source;
    for (const replacement of replacements.sort((left, right) => right.start - left.start)) {
      updated =
        updated.slice(0, replacement.start) + replacement.value + updated.slice(replacement.end);
    }
    await writeFile(path, updated, 'utf8');
  }
}

const constrainedInputs = await findConstrainedInputs(libraryFiles);
for (const input of constrainedInputs) {
  const pages = pagesByEntryPoint.get(input.entryPoint) ?? [];
  const rows = pages
    .flatMap((path) => pageRecords.get(path)?.rows ?? [])
    .filter((row) => row.name === input.name);
  if (!rows.length) {
    diagnostics.push(
      `${relative('.', input.path)}: ${input.owner}.${input.name} uses ${input.alias}, but no matching API row was found under the ${input.entryPoint} documentation page.`,
    );
    continue;
  }

  if (!rows.some((row) => hasEveryOption(`${row.type} ${row.description}`, input.values))) {
    diagnostics.push(
      `${relative('.', input.path)}: ${input.owner}.${input.name} does not expose every ${input.alias} option in its API documentation.`,
    );
  }
}

if (write) {
  process.stdout.write(
    `Added finite API options to ${updatedRows} documentation row${updatedRows === 1 ? '' : 's'}.\n`,
  );
} else if (diagnostics.length) {
  process.stderr.write(`${unique(diagnostics).join('\n')}\n`);
  process.stderr.write(
    'Component API documentation has incomplete finite-choice inputs. Run npm run sync:doc-api-options.\n',
  );
  process.exitCode = 1;
} else {
  process.stdout.write(
    `Verified finite-choice API options across ${pageFiles.length} component pages.\n`,
  );
}

async function findConstrainedInputs(paths) {
  const inputs = [];
  for (const path of paths) {
    const entryPoint = relative(LIBRARY_ROOT, path).split(/[\\/]/)[0];
    if (!pagesByEntryPoint.has(entryPoint)) continue;
    const source = await readFile(path, 'utf8');
    const sourceFile = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true);

    visit(sourceFile, (node) => {
      if (!ts.isPropertyDeclaration(node) || !node.initializer || !node.name) return;
      const call = unwrapInputCall(node.initializer);
      const typeNode = call?.typeArguments?.[0];
      if (!call || !typeNode) return;
      const names = referencedTypeNames(typeNode);
      const choices = names.flatMap((alias) => {
        const values = finiteAliases.get(alias);
        return values ? [{ alias, values }] : [];
      });
      const inlineValues = resolveFiniteType(typeNode, new Set());
      if (!choices.length && inlineValues && inlineValues.length > 1) {
        choices.push({ alias: typeNode.getText(sourceFile), values: inlineValues });
      }
      for (const choice of choices) {
        inputs.push({
          path,
          entryPoint,
          owner: node.parent?.name?.text ?? 'Unknown',
          name: inputAlias(call) ?? node.name.getText(sourceFile).replace(/^['"]|['"]$/g, ''),
          alias: choice.alias,
          values: choice.values,
        });
      }
    });
  }
  return inputs;
}

function inputAlias(call) {
  for (const argument of call.arguments) {
    if (!ts.isObjectLiteralExpression(argument)) continue;
    const alias = stringProperty(argument, 'alias');
    if (alias) return alias.text;
  }
  return undefined;
}

function unwrapInputCall(node) {
  if (!ts.isCallExpression(node)) return undefined;
  if (ts.isIdentifier(node.expression) && ['input', 'model'].includes(node.expression.text)) {
    return node;
  }
  if (
    ts.isPropertyAccessExpression(node.expression) &&
    ts.isIdentifier(node.expression.expression) &&
    ['input', 'model'].includes(node.expression.expression.text) &&
    node.expression.name.text === 'required'
  ) {
    return node;
  }
  return undefined;
}

function referencedTypeNames(node) {
  const names = [];
  visit(node, (candidate) => {
    if (ts.isTypeReferenceNode(candidate) && ts.isIdentifier(candidate.typeName)) {
      names.push(candidate.typeName.text);
    }
  });
  return unique(names);
}

async function readApiRows(path) {
  const source = await readFile(path, 'utf8');
  const sourceFile = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true);
  const rows = [];
  visit(sourceFile, (node) => {
    if (!ts.isObjectLiteralExpression(node)) return;
    const nameNode = stringProperty(node, 'name');
    const typeNode = stringProperty(node, 'type');
    const defaultNode = stringProperty(node, 'defaultValue');
    const descriptionNode = stringProperty(node, 'description');
    if (!nameNode || !typeNode || !defaultNode || !descriptionNode) return;
    rows.push({
      name: nameNode.text,
      type: typeNode.text,
      description: descriptionNode.text,
      descriptionNode,
    });
  });
  return { source, sourceFile, rows };
}

function stringProperty(node, name) {
  const property = node.properties.find(
    (candidate) =>
      ts.isPropertyAssignment(candidate) && candidate.name?.getText().replace(/['"]/g, '') === name,
  );
  if (!property || !ts.isPropertyAssignment(property)) return undefined;
  return ts.isStringLiteralLike(property.initializer) ? property.initializer : undefined;
}

function resolveFiniteAlias(name, seen) {
  if (seen.has(name)) return undefined;
  const alias = aliases.get(name);
  if (!alias) return undefined;
  const nextSeen = new Set(seen).add(name);
  return resolveFiniteType(alias.node, nextSeen);
}

function resolveFiniteType(node, seen) {
  if (ts.isParenthesizedTypeNode(node)) return resolveFiniteType(node.type, seen);
  if (ts.isLiteralTypeNode(node)) {
    if (ts.isStringLiteral(node.literal) || ts.isNumericLiteral(node.literal)) {
      return [node.literal.text];
    }
    return undefined;
  }
  if (ts.isUnionTypeNode(node)) {
    const values = node.types.map((type) => resolveFiniteType(type, seen));
    return values.every(Boolean) ? unique(values.flat()) : undefined;
  }
  if (ts.isTypeReferenceNode(node) && ts.isIdentifier(node.typeName)) {
    return resolveFiniteAlias(node.typeName.text, seen);
  }
  return undefined;
}

function hasEveryOption(text, values) {
  return values.every((value) =>
    new RegExp(`(^|[^a-zA-Z0-9_-])${escapeRegExp(value)}($|[^a-zA-Z0-9_-])`, 'i').test(text),
  );
}

function formatOption(value) {
  return /^-?\d+(?:\.\d+)?$/.test(value) ? value : `'${value}'`;
}

function visit(node, callback) {
  callback(node);
  node.forEachChild((child) => visit(child, callback));
}

async function findFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => {
      const path = join(directory, entry.name);
      return entry.isDirectory() ? findFiles(path) : [path];
    }),
  );
  return nested.flat();
}

function isSourceFile(path) {
  return extname(path) === '.ts' && !path.endsWith('.spec.ts') && !path.endsWith('.d.ts');
}

function unique(values) {
  return [...new Set(values)];
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
