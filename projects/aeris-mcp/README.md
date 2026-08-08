# @aeris-ui/mcp

Local, read-only Model Context Protocol server for Aeris UI documentation, APIs, examples, design
tokens, and accessibility guidance.

> Aeris UI and this MCP package are alpha software and are not production ready.

The package is available on npm as [`@aeris-ui/mcp`](https://www.npmjs.com/package/@aeris-ui/mcp).
Use the same exact version as `@aeris-ui/core` during alpha.

The package runs locally over `stdio`. It does not start an HTTP server, inspect application files,
modify a workspace, collect telemetry, or require network access at runtime. The matching canonical
Aeris documentation corpus is bundled with each release.

## Recommended client configuration

No project installation is required. Configure an MCP-compatible client to download and launch the
pinned package with `npx`:

```json
{
  "mcpServers": {
    "aeris": {
      "command": "npx",
      "args": ["-y", "@aeris-ui/mcp@22.0.0-alpha.4"]
    }
  }
}
```

Do not add `@aeris-ui/mcp` to an Angular application's dependencies. It is a local development tool
launched by the MCP client and is not part of the application runtime or bundle.

## Optional global installation

If the client cannot use `npx`, install the executable globally:

```bash
npm install --global @aeris-ui/mcp@22.0.0-alpha.4
```

Then configure the client to launch the installed executable:

```json
{
  "mcpServers": {
    "aeris": {
      "command": "aeris-mcp"
    }
  }
}
```

Restart the client after installing or updating the package. The npm global binary directory must
be available on `PATH`.

During repository development, build the package and point the client at the absolute path to its
CLI:

```json
{
  "mcpServers": {
    "aeris-local": {
      "command": "node",
      "args": ["D:/path/to/Aeris/dist/aeris-mcp/cli.js"]
    }
  }
}
```

The exact location of MCP configuration differs by client. Restart or reload the client after
changing it.

## Capabilities

Resources:

- `aeris://docs/overview`
- `aeris://docs/canonical`
- `aeris://components`
- `aeris://components/{slug}`
- `aeris://guides`
- `aeris://guides/{id}`

Tools:

- `list_aeris_components`
- `search_aeris_docs`
- `get_aeris_component`
- `get_aeris_guide`
- `find_aeris_examples`

Use `search_aeris_docs` for discovery, then retrieve the focused component or guide for exact API
and example details.

## Repository development

These commands are contributor scripts defined by the root `package.json` in the AerisUI
repository. They do not work from an Angular application or another project. From the cloned
repository root, first install its development dependencies:

```bash
npm ci
```

Then build and verify the MCP package:

```bash
npm run build:mcp
npm run test:mcp
npm run check:mcp-package
```

See the [Aeris MCP guide](https://aeris-ui.dev/guides/mcp) for setup, troubleshooting, versioning,
and client behavior.
