import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const routesPath = resolve(root, 'projects/docs/src/app/app.routes.ts');
const indexPath = resolve(root, 'projects/docs/src/index.html');
const manifestPath = resolve(root, 'projects/docs/public/site.webmanifest');
const publicDirectory = resolve(root, 'projects/docs/public');
const siteUrl = 'https://aeris-ui.dev';
const mode = process.argv[2] ?? '--check';

if (mode !== '--check' && mode !== '--write') {
  throw new Error('Use --check or --write.');
}

const routesSource = readFileSync(routesPath, 'utf8');
const routeMatches = [...routesSource.matchAll(/^\s*path:\s*'([^']*)',/gm)];
const canonicalPaths = [];

for (const [index, match] of routeMatches.entries()) {
  const path = match[1];
  const start = match.index ?? 0;
  const end = routeMatches[index + 1]?.index ?? routesSource.length;
  const routeBlock = routesSource.slice(start, end);

  if (routeBlock.includes('redirectTo:') || path === '**' || path.includes(':')) continue;

  const canonicalPath = path ? `/${path}` : '/';
  if (!canonicalPaths.includes(canonicalPath)) canonicalPaths.push(canonicalPath);
}

const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...canonicalPaths.map((path) => `  <url>\n    <loc>${siteUrl}${path}</loc>\n  </url>`),
  '</urlset>',
  '',
].join('\n');

const robots = ['User-agent: *', 'Allow: /', '', `Sitemap: ${siteUrl}/sitemap.xml`, ''].join('\n');

const generatedFiles = new Map([
  [resolve(publicDirectory, 'sitemap.xml'), sitemap],
  [resolve(publicDirectory, 'robots.txt'), robots],
]);

if (mode === '--write') {
  for (const [path, content] of generatedFiles) writeFileSync(path, content, 'utf8');
  console.log(`Generated SEO discovery files for ${canonicalPaths.length} canonical routes.`);
  process.exit(0);
}

const errors = [];
for (const [path, expected] of generatedFiles) {
  let actual = '';
  try {
    actual = readFileSync(path, 'utf8');
  } catch {
    errors.push(`${path} is missing.`);
    continue;
  }
  if (actual !== expected) errors.push(`${path} is stale. Run npm run generate:seo.`);
}

const indexHtml = readFileSync(indexPath, 'utf8');
const requiredIndexMarkers = [
  'name="description"',
  'name="robots"',
  'property="og:title"',
  'name="twitter:card"',
  'rel="canonical"',
  'type="application/ld+json"',
];
for (const marker of requiredIndexMarkers) {
  if (!indexHtml.includes(marker))
    errors.push(`projects/docs/src/index.html is missing ${marker}.`);
}

const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
if (manifest.start_url !== '/' || !Array.isArray(manifest.icons) || manifest.icons.length < 2) {
  errors.push('site.webmanifest must define the root start URL and both application icons.');
}

if (errors.length > 0) {
  for (const error of errors) console.error(error);
  process.exit(1);
}

console.log(`SEO discovery files cover ${canonicalPaths.length} canonical routes.`);
