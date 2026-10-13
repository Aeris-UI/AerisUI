import { build } from 'esbuild';
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const root = new URL('./', import.meta.url);
const output = new URL('../../dist/browser-tests/browser/', root);
await build({
  entryPoints: [fileURLToPath(new URL('native-bridge.mjs', root))],
  outfile: fileURLToPath(new URL('native-bridge.js', output)),
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: 'es2022',
});
const index = new URL('index.html', output);
const html = await readFile(index, 'utf8');
const tag = '<script type="module" src="native-bridge.js"></script>';
if (!html.includes(tag)) await writeFile(index, html.replace('</body>', `${tag}</body>`));
