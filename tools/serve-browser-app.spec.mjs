import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { once } from 'node:events';
import { createBrowserAppServer } from './serve-browser-app.mjs';

test('built application server handles routes, assets, and invalid requests safely', async () => {
  const root = await mkdtemp(join(tmpdir(), 'aeris-browser-server-'));
  const server = createBrowserAppServer(root);
  try {
    await writeFile(join(root, 'index.html'), '<h1>Application</h1>');
    await writeFile(join(root, 'chunk.js'), 'export const ready = true;');
    server.listen(0, '127.0.0.1');
    await once(server, 'listening');
    const url = `http://127.0.0.1:${server.address().port}`;
    const route = await fetch(`${url}/components/select`);
    assert.equal(route.status, 200);
    assert.equal(await route.text(), '<h1>Application</h1>');
    const script = await fetch(`${url}/chunk.js`);
    assert.equal(script.headers.get('content-type'), 'text/javascript');
    assert.equal(await script.text(), 'export const ready = true;');
    assert.equal((await fetch(`${url}/missing.js`)).status, 404);
    assert.equal((await fetch(`${url}/%2e%2e%2foutside`)).status, 403);
    assert.equal((await fetch(`${url}/%ZZ`)).status, 400);
    assert.equal((await fetch(url, { method: 'POST' })).status, 405);
    const head = await fetch(url, { method: 'HEAD' });
    assert.equal(head.status, 200);
    assert.equal(await head.text(), '');
  } finally {
    server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
    await rm(root, { recursive: true, force: true });
  }
});
