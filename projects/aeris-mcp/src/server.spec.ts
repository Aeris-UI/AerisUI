import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { loadAerisDocumentation } from './corpus.js';
import { createAerisMcpServer } from './server.js';

describe('@aeris-ui/mcp server', () => {
  let server: McpServer;
  let client: Client;

  beforeEach(async () => {
    const documentation = await loadAerisDocumentation(
      new URL('../../docs/public/ai/22/aeris-docs.json', import.meta.url),
    );
    server = createAerisMcpServer(documentation);
    client = new Client({ name: 'aeris-mcp-test', version: '1.0.0' });
    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
    await server.connect(serverTransport);
    await client.connect(clientTransport);
  });

  afterEach(async () => {
    await client.close();
    await server.close();
  });

  it('advertises the focused read-only tools', async () => {
    const { tools } = await client.listTools();

    expect(tools.map((tool) => tool.name)).toEqual([
      'list_aeris_components',
      'search_aeris_docs',
      'get_aeris_component',
      'get_aeris_guide',
      'find_aeris_examples',
    ]);
    expect(tools.every((tool) => tool.annotations?.readOnlyHint === true)).toBe(true);
  });

  it('lists and reads component resources', async () => {
    const resources = await client.listResources();
    const button = resources.resources.find(
      (resource) => resource.uri === 'aeris://components/button',
    );

    expect(button?.name).toBe('Button');
    const result = await client.readResource({ uri: 'aeris://components/button' });
    const content = result.contents[0];
    expect(content && 'text' in content ? content.text : '').toContain('@aeris-ui/core/button');
  });

  it('searches the canonical documentation', async () => {
    const result = await client.callTool({
      name: 'search_aeris_docs',
      arguments: { query: 'dismissable mask dialog', limit: 5 },
    });

    expect(textContent(result)).toContain('dialog');
    expect(result.isError).not.toBe(true);
  });

  it('returns exact component documentation with examples', async () => {
    const result = await client.callTool({
      name: 'get_aeris_component',
      arguments: { component: 'button', includeExamples: true },
    });

    expect(textContent(result)).toContain('AerisButton');
    expect(textContent(result)).toContain('examples');
  });

  it('reports invalid component names as actionable tool errors', async () => {
    const result = await client.callTool({
      name: 'get_aeris_component',
      arguments: { component: 'not-a-component' },
    });

    expect(result.isError).toBe(true);
    expect(textContent(result)).toContain('Unknown Aeris component');
  });
});

function textContent(result: Awaited<ReturnType<Client['callTool']>>): string {
  return result.content
    .filter((item) => item.type === 'text')
    .map((item) => item.text)
    .join('\n');
}
