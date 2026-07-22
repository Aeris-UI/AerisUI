import { resolve } from 'node:path';

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

const cli = resolve(import.meta.dirname, '../dist/aeris-mcp/cli.js');
const client = new Client({ name: 'aeris-package-check', version: '1.0.0' });
const transport = new StdioClientTransport({
  command: process.execPath,
  args: [cli],
  stderr: 'pipe',
});
let stderr = '';
transport.stderr?.on('data', (chunk) => {
  stderr += String(chunk);
});

try {
  await client.connect(transport);
  const { tools } = await client.listTools();
  const expectedTools = [
    'list_aeris_components',
    'search_aeris_docs',
    'get_aeris_component',
    'get_aeris_guide',
    'find_aeris_examples',
  ];
  const names = tools.map((tool) => tool.name);
  if (expectedTools.some((name) => !names.includes(name))) {
    throw new Error(`The packaged CLI did not expose all expected tools: ${names.join(', ')}.`);
  }

  const result = await client.callTool({
    name: 'get_aeris_component',
    arguments: { component: 'button', includeExamples: false },
  });
  const text = result.content
    .filter((item) => item.type === 'text')
    .map((item) => item.text)
    .join('\n');
  if (result.isError || !text.includes('@aeris-ui/core/button')) {
    throw new Error('The packaged CLI could not retrieve bundled Button documentation.');
  }
} finally {
  await client.close();
}

if (stderr.trim()) throw new Error(`The packaged CLI wrote to stderr:\n${stderr}`);
process.stdout.write('Verified the packaged aeris-mcp executable over stdio.\n');
