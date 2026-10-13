import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, isAbsolute, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.txt': 'text/plain',
  '.webmanifest': 'application/manifest+json',
};

/** Local-only SPA server for built browser-test applications, not a deployment server. */
export function createBrowserAppServer(directory) {
  const root = resolve(directory);
  return createServer(async (request, response) => {
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      response.writeHead(405, { Allow: 'GET, HEAD' }).end();
      return;
    }
    let path;
    try {
      path = resolve(
        root,
        `.${decodeURIComponent(new URL(request.url, 'http://localhost').pathname)}`,
      );
    } catch {
      response.writeHead(400).end();
      return;
    }
    const withinRoot = relative(root, path);
    if (withinRoot.startsWith('..') || isAbsolute(withinRoot)) {
      response.writeHead(403).end();
      return;
    }
    try {
      const exists = await stat(path).then(
        (entry) => entry.isFile(),
        () => false,
      );
      if (!exists) {
        if (extname(path)) {
          response.writeHead(404).end();
          return;
        }
        path = resolve(root, 'index.html');
      }
      const content = await readFile(path);
      response.writeHead(200, {
        'Content-Type': MIME_TYPES[extname(path)] ?? 'application/octet-stream',
        'Cache-Control': 'no-store',
        'Content-Length': content.byteLength,
      });
      response.end(request.method === 'HEAD' ? undefined : content);
    } catch {
      response.writeHead(404).end();
    }
  });
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [directory, portValue] = process.argv.slice(2);
  const port = Number(portValue);
  if (!directory || !Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('Usage: node tools/serve-browser-app.mjs <built directory> <port>');
  }
  await stat(resolve(directory, 'index.html'));
  createBrowserAppServer(directory).listen(port, '127.0.0.1', () => {
    process.stdout.write(`Serving built application at http://127.0.0.1:${port}\n`);
  });
}
