#!/usr/bin/env node

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

import { loadAerisDocumentation } from './corpus.js';
import { createAerisMcpServer } from './server.js';

async function main(): Promise<void> {
  const documentation = await loadAerisDocumentation();
  const server = createAerisMcpServer(documentation);
  const transport = new StdioServerTransport();

  process.on('SIGINT', () => {
    void server.close().finally(() => process.exit(0));
  });

  await server.connect(transport);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.stack : String(error);
  process.stderr.write(`Aeris MCP failed to start:\n${message}\n`);
  process.exitCode = 1;
});
