import { readFile } from 'node:fs/promises';

import ts from 'typescript';

export async function readPageExampleContext(path) {
  const source = await readFile(path, 'utf8');
  const file = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const pageClass = file.statements.find(
    (statement) => ts.isClassDeclaration(statement) && statement.name?.text.endsWith('Page'),
  );
  const members = new Map();
  const topLevel = new Map();
  const imports = new Map();
  const stringDeclarations = new Map();
  const methods = new Map();

  for (const statement of file.statements) {
    if (ts.isImportDeclaration(statement) && statement.importClause) {
      const clause = statement.importClause;
      if (clause.name) imports.set(clause.name.text, statement.getText(file));
      for (const element of clause.namedBindings && ts.isNamedImports(clause.namedBindings)
        ? clause.namedBindings.elements
        : []) {
        imports.set(element.name.text, statement.getText(file));
      }
      continue;
    }
    if (statement === pageClass) continue;
    for (const name of declarationNames(statement)) topLevel.set(name, statement.getText(file));
  }

  for (const member of pageClass?.members ?? []) {
    if (!member.name || !ts.isIdentifier(member.name)) continue;
    members.set(member.name.text, member.getText(file));
    if (ts.isPropertyDeclaration(member) && member.initializer) {
      stringDeclarations.set(member.name.text, member.initializer);
    } else if (ts.isMethodDeclaration(member) && member.body) {
      methods.set(member.name.text, member);
    }
  }

  const resolvedStrings = new Map();
  const resolveName = (name, seen = new Set()) => {
    if (resolvedStrings.has(name)) return resolvedStrings.get(name);
    if (seen.has(name)) return undefined;
    const initializer = stringDeclarations.get(name);
    if (!initializer) return undefined;
    const value = resolveExpression(initializer, new Set(seen).add(name));
    if (value !== undefined) resolvedStrings.set(name, value);
    return value;
  };
  const resolveExpression = (expression, seen = new Set(), bindings = new Map()) => {
    if (ts.isStringLiteral(expression) || ts.isNoSubstitutionTemplateLiteral(expression)) {
      return expression.text;
    }
    if (ts.isTemplateExpression(expression)) {
      let value = expression.head.text;
      for (const span of expression.templateSpans) {
        const resolved = resolveExpression(span.expression, seen, bindings);
        if (resolved === undefined) return undefined;
        value += resolved + span.literal.text;
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
      const values = expression.arguments.map((argument) =>
        resolveExpression(argument, seen, bindings),
      );
      if (values.some((value) => value === undefined)) return undefined;
      const nextBindings = new Map(bindings);
      method.parameters.forEach((parameter, index) => {
        if (ts.isIdentifier(parameter.name)) nextBindings.set(parameter.name.text, values[index]);
      });
      return resolveExpression(returned, seen, nextBindings);
    }
    return undefined;
  };

  return {
    resolveString(expression) {
      if (!expression) return '';
      const bindingFile = ts.createSourceFile(
        'binding.ts',
        `const value = ${expression};`,
        ts.ScriptTarget.Latest,
        true,
      );
      const statement = bindingFile.statements[0];
      const declaration =
        statement && ts.isVariableStatement(statement)
          ? statement.declarationList.declarations[0]
          : undefined;
      return declaration?.initializer ? (resolveExpression(declaration.initializer) ?? '') : '';
    },
    missingCode(template, seed) {
      const declared = declaredNames(seed);
      const selectedMembers = new Map();
      const selectedTopLevel = new Map();
      const selectedImports = new Map();
      const pending = [templateExpressions(template), seed];
      let cursor = 0;

      while (cursor < pending.length) {
        const text = pending[cursor++] ?? '';
        for (const [name, code] of members) {
          if (declared.has(name) || selectedMembers.has(name) || !hasIdentifier(text, name))
            continue;
          selectedMembers.set(name, code);
          pending.push(code);
        }
        for (const [name, code] of topLevel) {
          if (declared.has(name) || selectedTopLevel.has(name) || !hasIdentifier(text, name))
            continue;
          selectedTopLevel.set(name, code);
          pending.push(code);
        }
        for (const [name, code] of imports) {
          if (
            selectedImports.has(code) ||
            !hasIdentifier(text, name) ||
            /from\s+['"](?:@angular\/|@aeris-ui\/|\.)/.test(code)
          )
            continue;
          selectedImports.set(code, code);
        }
      }

      return [
        ...selectedImports.values(),
        ...selectedTopLevel.values(),
        ...[...selectedMembers.values()].filter(
          (code) => !/^protected readonly icons = DOC_ICONS;$/m.test(code.trim()),
        ),
      ]
        .join('\n\n')
        .trim();
    },
  };
}

function templateExpressions(template) {
  const expressions = [];
  for (const match of template.matchAll(
    /(?:\[\([^\]]+\)\]|\[[^\]]+\]|\([^\)]+\))\s*=\s*["']([^"']*)["']/g,
  )) {
    expressions.push(match[1] ?? '');
  }
  for (const match of template.matchAll(/\{\{([\s\S]*?)\}\}/g)) expressions.push(match[1] ?? '');
  for (const match of template.matchAll(/@(if|for|switch)\s*\(([^)]*)\)/g))
    expressions.push(match[2] ?? '');
  return expressions.join('\n');
}

function declaredNames(source) {
  const names = new Set();
  for (const match of source.matchAll(
    /\b(?:protected|private|public)\s+(?:static\s+)?(?:readonly\s+)?([A-Za-z_$][\w$]*)\b/g,
  )) {
    names.add(match[1]);
  }
  const file = ts.createSourceFile('snippet.ts', source, ts.ScriptTarget.Latest, true);
  const visit = (node) => {
    if (
      (ts.isPropertyDeclaration(node) ||
        ts.isMethodDeclaration(node) ||
        ts.isVariableDeclaration(node) ||
        ts.isFunctionDeclaration(node) ||
        ts.isInterfaceDeclaration(node) ||
        ts.isTypeAliasDeclaration(node) ||
        ts.isEnumDeclaration(node) ||
        ts.isClassDeclaration(node)) &&
      node.name &&
      ts.isIdentifier(node.name)
    ) {
      names.add(node.name.text);
    }
    ts.forEachChild(node, visit);
  };
  visit(file);
  return names;
}

function declarationNames(statement) {
  if (
    (ts.isInterfaceDeclaration(statement) ||
      ts.isTypeAliasDeclaration(statement) ||
      ts.isEnumDeclaration(statement) ||
      ts.isFunctionDeclaration(statement) ||
      ts.isClassDeclaration(statement)) &&
    statement.name
  ) {
    return [statement.name.text];
  }
  if (ts.isVariableStatement(statement)) {
    return statement.declarationList.declarations.flatMap((declaration) =>
      ts.isIdentifier(declaration.name) ? [declaration.name.text] : [],
    );
  }
  return [];
}

function hasIdentifier(source, name) {
  return new RegExp(`\\b${escapeRegExp(name)}\\b`).test(source);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
