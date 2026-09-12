import { mkdtemp, readFile, rm, writeFile, mkdir } from 'node:fs/promises';
import { basename, dirname, extname, join, relative, resolve } from 'node:path';
import vm from 'node:vm';

import { HtmlParser } from '@angular/compiler';
import {
  createCompilerHost,
  createProgram as createAngularProgram,
  formatDiagnostics,
  readConfiguration,
} from '@angular/compiler-cli';
import ts from 'typescript';

const DOCS_ROOT = 'projects/docs/src/app/pages/components';
const DEMO_CODE_PATH = 'projects/docs/src/app/shared/demo-code.ts';
const GENERATED_CODE_PATH = 'projects/docs/src/app/shared/generated-example-code.ts';
const GENERATED_STYLES_PATH = 'projects/docs/src/app/shared/generated-example-styles.ts';
const parser = new HtmlParser();
const workspaceRoot = resolve('.');
const temporaryRoot = await mkdtemp(join(workspaceRoot, '.aeris-doc-examples-'));

try {
  const buildAngularDemoSources = await loadExport(DEMO_CODE_PATH, 'buildAngularDemoSources');
  const generatedCode = await loadExport(GENERATED_CODE_PATH, 'DOC_EXAMPLE_CODE');
  const generatedStyles = await loadExport(GENERATED_STYLES_PATH, 'DOC_EXAMPLE_STYLES');
  const htmlPaths = (await findFiles(DOCS_ROOT)).filter((path) => extname(path) === '.html');
  const rootNames = [];
  const diagnostics = [];
  let exampleCount = 0;

  for (const htmlPath of htmlPaths) {
    const source = await readFile(htmlPath, 'utf8');
    const parsed = parser.parse(source, htmlPath, { tokenizeBlocks: false });
    if (parsed.errors.length) {
      diagnostics.push(...parsed.errors.map((error) => `${htmlPath}: ${error}`));
      continue;
    }

    const pageValues = await readStaticStringValues(htmlPath.replace(/\.html$/, '.ts'));
    const demos = [];
    visit(parsed.rootNodes, (node) => {
      if (node.name === 'app-form-demo' || node.name === 'app-button-demo') demos.push(node);
    });

    for (const demo of demos) {
      const preview = findDescendant(demo, (node) => hasAttribute(node, 'preview'));
      const code = findDescendant(
        demo,
        (node) => node.name === 'pre' && hasAttribute(node, 'code'),
      );
      const codeElement = code && findDescendant(code, (node) => node.name === 'code');
      if (!preview || !codeElement) continue;

      const anchor = attributeValue(demo, 'id');
      const title = attributeValue(demo, 'title');
      if (!anchor || !title) {
        diagnostics.push(
          `${relative('.', htmlPath)} contains a demo without a static id or title.`,
        );
        continue;
      }

      const htmlCode = resolveBoundString(demo, '[htmlCode]', pageValues, diagnostics, htmlPath);
      const classCode = resolveBoundString(demo, '[tsCode]', pageValues, diagnostics, htmlPath);
      const cssCode = resolveBoundString(demo, '[cssCode]', pageValues, diagnostics, htmlPath);
      const template = htmlCode ?? normalizeCode(textContent(codeElement));
      const combinedCss = [generatedStyles[anchor], cssCode].filter(Boolean).join('\n\n');
      const sources = buildAngularDemoSources({
        anchor,
        title,
        template,
        classCode: [generatedCode[anchor], classCode].filter(Boolean).join('\n\n'),
        cssCode: combinedCss,
      });
      const typeScript = sources.find((item) => item.language === 'TypeScript')?.code;
      if (!typeScript) {
        diagnostics.push(`${relative('.', htmlPath)}: ${anchor} generated no TypeScript source.`);
        continue;
      }

      const exampleDirectory = join(temporaryRoot, relative(DOCS_ROOT, dirname(htmlPath)), anchor);
      await mkdir(exampleDirectory, { recursive: true });
      const typeScriptPath = join(exampleDirectory, 'example.ts');
      await writeFile(typeScriptPath, typeScript, 'utf8');
      rootNames.push(typeScriptPath);

      const templateUrl = /templateUrl:\s*['"]\.\/([^'"]+)['"]/.exec(typeScript)?.[1];
      const styleUrl = /styleUrl:\s*['"]\.\/([^'"]+)['"]/.exec(typeScript)?.[1];
      const html = sources.find((item) => item.language === 'HTML')?.code;
      const css = sources.find((item) => item.language === 'CSS')?.code;
      if (templateUrl && html !== undefined) {
        await writeFile(join(exampleDirectory, templateUrl), html, 'utf8');
      }
      if (styleUrl && css !== undefined) {
        await writeFile(join(exampleDirectory, styleUrl), css, 'utf8');
      }
      exampleCount += 1;
    }
  }

  if (diagnostics.length) throw new Error(diagnostics.join('\n'));

  const configPath = join(temporaryRoot, 'tsconfig.json');
  await writeFile(
    configPath,
    JSON.stringify(
      {
        extends: resolve('tsconfig.json'),
        compilerOptions: {
          outDir: join(temporaryRoot, 'out'),
          rootDir: temporaryRoot,
          strict: true,
          skipLibCheck: true,
          types: [],
        },
        angularCompilerOptions: {
          strictTemplates: true,
        },
        files: rootNames,
      },
      null,
      2,
    ),
    'utf8',
  );

  const configuration = readConfiguration(configPath);
  const host = createCompilerHost({ options: configuration.options });
  const program = createAngularProgram({
    rootNames: configuration.rootNames,
    options: configuration.options,
    host,
  });
  const compileDiagnostics = [
    ...configuration.errors,
    ...program.getTsOptionDiagnostics(),
    ...program.getNgOptionDiagnostics(),
    ...program.getTsSyntacticDiagnostics(),
    ...program.getTsSemanticDiagnostics(),
    ...program.getNgStructuralDiagnostics(),
    ...program.getNgSemanticDiagnostics(),
  ];

  if (compileDiagnostics.length) {
    const diagnosticsByFile = new Map();
    for (const diagnostic of compileDiagnostics) {
      const key = diagnostic.file?.fileName ?? '<configuration>';
      const entries = diagnosticsByFile.get(key) ?? [];
      entries.push(diagnostic);
      diagnosticsByFile.set(key, entries);
    }
    const fileLimit = 120;
    const entries = [...diagnosticsByFile.entries()];
    for (const [, fileDiagnostics] of entries.slice(0, fileLimit)) {
      process.stderr.write(formatDiagnostics(fileDiagnostics.slice(0, 3)));
      if (fileDiagnostics.length > 3) {
        process.stderr.write(
          `...and ${fileDiagnostics.length - 3} more diagnostics in this file.\n`,
        );
      }
    }
    if (entries.length > fileLimit) {
      process.stderr.write(`...and ${entries.length - fileLimit} more files with diagnostics.\n`);
    }
    process.stderr.write(
      `Generated documentation examples failed strict Angular compilation (${exampleCount} checked, ${compileDiagnostics.length} diagnostics in ${entries.length} files).\n`,
    );
    process.exitCode = 1;
  } else {
    process.stdout.write(
      `Strictly compiled ${exampleCount} generated Angular documentation examples.\n`,
    );
  }
} finally {
  const resolvedTemporaryRoot = resolve(temporaryRoot);
  if (
    dirname(resolvedTemporaryRoot) === workspaceRoot &&
    basename(resolvedTemporaryRoot).startsWith('.aeris-doc-examples-')
  ) {
    await rm(resolvedTemporaryRoot, { recursive: true, force: true });
  }
}

async function loadExport(path, name) {
  const source = await readFile(path, 'utf8');
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
    fileName: path,
  }).outputText;
  const module = { exports: {} };
  vm.runInNewContext(output, { exports: module.exports, module }, { filename: path });
  const value = module.exports[name];
  if (value === undefined) throw new Error(`${path} does not export ${name}.`);
  return value;
}

async function readStaticStringValues(path) {
  const source = await readFile(path, 'utf8');
  const sourceFile = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true);
  const declarations = new Map();
  const methods = new Map();

  visitTypeScript(sourceFile, (node) => {
    if (ts.isPropertyDeclaration(node) && ts.isIdentifier(node.name) && node.initializer) {
      declarations.set(node.name.text, node.initializer);
    }
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.initializer) {
      declarations.set(node.name.text, node.initializer);
    }
    if (ts.isMethodDeclaration(node) && ts.isIdentifier(node.name) && node.body) {
      methods.set(node.name.text, node);
    }
  });

  const values = new Map();
  const resolveExpression = (expression, seen = new Set(), bindings = new Map()) => {
    if (ts.isStringLiteral(expression) || ts.isNoSubstitutionTemplateLiteral(expression)) {
      return expression.text;
    }
    if (ts.isTemplateExpression(expression)) {
      let value = expression.head.text;
      for (const span of expression.templateSpans) {
        const expressionValue = resolveExpression(span.expression, seen, bindings);
        if (expressionValue === undefined) return undefined;
        value += expressionValue + span.literal.text;
      }
      return value;
    }
    if (ts.isTaggedTemplateExpression(expression)) {
      return resolveExpression(expression.template, seen, bindings);
    }
    if (
      ts.isParenthesizedExpression(expression) ||
      ts.isAsExpression(expression) ||
      ts.isSatisfiesExpression(expression) ||
      ts.isNonNullExpression(expression)
    ) {
      return resolveExpression(expression.expression, seen, bindings);
    }
    if (
      ts.isPropertyAccessExpression(expression) &&
      expression.expression.kind === ts.SyntaxKind.ThisKeyword
    ) {
      return resolveName(expression.name.text, seen);
    }
    if (ts.isIdentifier(expression)) {
      return bindings.has(expression.text)
        ? bindings.get(expression.text)
        : resolveName(expression.text, seen);
    }
    if (
      ts.isBinaryExpression(expression) &&
      expression.operatorToken.kind === ts.SyntaxKind.PlusToken
    ) {
      const left = resolveExpression(expression.left, seen, bindings);
      const right = resolveExpression(expression.right, seen, bindings);
      return left === undefined || right === undefined ? undefined : left + right;
    }
    if (
      ts.isCallExpression(expression) &&
      ts.isPropertyAccessExpression(expression.expression) &&
      expression.expression.expression.kind === ts.SyntaxKind.ThisKeyword
    ) {
      const method = methods.get(expression.expression.name.text);
      const returned = method?.body?.statements.find(ts.isReturnStatement)?.expression;
      if (!method || !returned) return undefined;
      const argumentsValues = expression.arguments.map((argument) =>
        resolveExpression(argument, seen, bindings),
      );
      if (argumentsValues.some((value) => value === undefined)) return undefined;
      const methodBindings = new Map(bindings);
      method.parameters.forEach((parameter, index) => {
        if (ts.isIdentifier(parameter.name)) {
          methodBindings.set(parameter.name.text, argumentsValues[index]);
        }
      });
      return resolveExpression(returned, seen, methodBindings);
    }
    return undefined;
  };
  const resolveName = (name, seen = new Set()) => {
    if (values.has(name)) return values.get(name);
    if (seen.has(name)) return undefined;
    const initializer = declarations.get(name);
    if (!initializer) return undefined;
    const nextSeen = new Set(seen).add(name);
    const value = resolveExpression(initializer, nextSeen);
    if (value !== undefined) values.set(name, value);
    return value;
  };

  for (const name of declarations.keys()) resolveName(name);
  return {
    get: (name) => resolveName(name),
    resolve: (expression) => {
      const expressionFile = ts.createSourceFile(
        'binding.ts',
        `const value = ${expression};`,
        ts.ScriptTarget.Latest,
        true,
      );
      const statement = expressionFile.statements[0];
      const declaration =
        statement && ts.isVariableStatement(statement)
          ? statement.declarationList.declarations[0]
          : undefined;
      return declaration?.initializer
        ? resolveExpression(declaration.initializer, new Set())
        : undefined;
    },
  };
}

function resolveBoundString(node, binding, values, diagnostics, path) {
  const expression = attributeValue(node, binding);
  if (!expression) return undefined;
  const value = values.resolve(expression);
  if (value === undefined) {
    diagnostics.push(
      `${relative('.', path)}: ${attributeValue(node, 'id') ?? 'unknown'} cannot statically resolve ${binding}="${expression}".`,
    );
  }
  return value;
}

async function findFiles(directory) {
  const { readdir } = await import('node:fs/promises');
  const entries = await readdir(directory, { withFileTypes: true });
  const paths = await Promise.all(
    entries.map((entry) => {
      const path = join(directory, entry.name);
      return entry.isDirectory() ? findFiles(path) : [path];
    }),
  );
  return paths.flat();
}

function visit(nodes, callback) {
  for (const node of nodes) {
    callback(node);
    visit(node.children ?? [], callback);
    for (const branch of node.branches ?? []) visit(branch.children ?? [], callback);
  }
}

function visitTypeScript(node, callback) {
  callback(node);
  ts.forEachChild(node, (child) => visitTypeScript(child, callback));
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

function normalizeCode(value) {
  return value.replace(/\r\n/g, '\n').trim();
}
