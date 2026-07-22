import { readFile } from 'node:fs/promises';

import type { AerisDocumentation } from './documentation.types.js';

let defaultDocumentation: Promise<AerisDocumentation> | undefined;

export function loadAerisDocumentation(
  url: URL = new URL('./docs/aeris-docs.json', import.meta.url),
): Promise<AerisDocumentation> {
  if (url.href !== new URL('./docs/aeris-docs.json', import.meta.url).href) {
    return readDocumentation(url);
  }
  defaultDocumentation ??= readDocumentation(url);
  return defaultDocumentation;
}

async function readDocumentation(url: URL): Promise<AerisDocumentation> {
  const source = await readFile(url, 'utf8');
  const value: unknown = JSON.parse(source);
  assertAerisDocumentation(value);
  return value;
}

function assertAerisDocumentation(value: unknown): asserts value is AerisDocumentation {
  if (!isRecord(value)) throw new Error('Aeris documentation must be a JSON object.');
  if (typeof value['schemaVersion'] !== 'number') {
    throw new Error('Aeris documentation is missing schemaVersion.');
  }
  if (!isRecord(value['library']) || typeof value['library']['version'] !== 'string') {
    throw new Error('Aeris documentation is missing library version metadata.');
  }
  if (!Array.isArray(value['categories']) || !value['categories'].every(isString)) {
    throw new Error('Aeris documentation categories are invalid.');
  }
  if (!Array.isArray(value['guides']) || !value['guides'].every(isGuide)) {
    throw new Error('Aeris documentation guides are invalid.');
  }
  if (!Array.isArray(value['components']) || !value['components'].every(isComponent)) {
    throw new Error('Aeris documentation components are invalid.');
  }
}

function isGuide(value: unknown): boolean {
  return (
    isRecord(value) &&
    typeof value['id'] === 'string' &&
    typeof value['title'] === 'string' &&
    Array.isArray(value['sections'])
  );
}

function isComponent(value: unknown): boolean {
  return (
    isRecord(value) &&
    typeof value['name'] === 'string' &&
    typeof value['slug'] === 'string' &&
    typeof value['category'] === 'string' &&
    Array.isArray(value['examples']) &&
    Array.isArray(value['api'])
  );
}

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}
