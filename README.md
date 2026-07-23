# Aeris UI

Aeris UI is an original Angular component library for building minimal, responsive, themeable,
high-performance, and WCAG 2.2 AA accessible interfaces. The repository contains the library,
tests, documentation application, design lab, and release tooling so implementation and guidance
evolve together.

> **Alpha software:** Aeris UI is under active development and is not production ready. The
> current `22.0.0-alpha.1` version may introduce breaking API, styling, and behavior changes before
> the first stable release. Pin prerelease versions exactly and review the changelog when updating.

Explore the components, guides, and Design Lab at [aeris-ui.dev](https://www.aeris-ui.dev/).

## Principles

- Angular-first standalone and signal-based APIs
- Semantic HTML, complete keyboard behavior, and accessible focus management
- Responsive behavior for narrow viewports and flexible containers
- Design-token theming with palettes, light and dark modes, density, corner styles, RTL, and glass
  surfaces
- Framework-safe styles that coexist with current Tailwind CSS and Bootstrap releases
- Secondary entry points and no unnecessary runtime dependencies
- Icon-library independence in the published package

## Version compatibility

Aeris major versions align with Angular major versions. Aeris `22.x` supports Angular `22.x`; the
current Angular peer range is `>=22.0.6 <23.0.0`.

- [Changelog](CHANGELOG.md)
- [Updating and release process](RELEASING.md)
- [Branching and integration](BRANCHING.md)
- Run `npm run check:versions` to verify package and documentation metadata.

## Published packages

- [`@aeris-ui/core`](https://www.npmjs.com/package/@aeris-ui/core) — the Angular component
  library, theming system, and setup tooling
- [`@aeris-ui/mcp`](https://www.npmjs.com/package/@aeris-ui/mcp) — the local, read-only
  documentation server for MCP-compatible AI tools

Both packages are currently published under the `next` prerelease tag. During alpha, pin matching
exact versions when reproducibility matters.

## Workspace

- `projects/aeris-mcp` — local read-only `@aeris-ui/mcp` documentation server
- `projects/aeris-ui` — published `@aeris-ui/core` package and secondary entry points
- `projects/aeris-ui/src/lib/testing` — complete library test suite
- `projects/docs` — documentation application, live examples, landing page, and design lab
- `tools` — development and repository validation scripts

The documentation is hosted at [`aeris-ui.dev`](https://aeris-ui.dev). See
[Documentation deployment](DEPLOYMENT.md) for the version-controlled build and hosting settings.

## Develop locally

Use a Node.js version supported by Angular 22 and install the locked dependency graph:

```bash
git clone https://github.com/Aeris-UI/AerisUI.git
cd AerisUI
npm ci
npm start
```

`npm start` builds the library before serving the documentation application, ensuring the docs
consume package output rather than library source files.

### Verification commands

| Command                            | Purpose                                                            |
| ---------------------------------- | ------------------------------------------------------------------ |
| `npm run check:versions`           | Verify package, public API, peer range, and documentation versions |
| `npm audit --audit-level=moderate` | Fail on moderate, high, or critical dependency advisories          |
| `npm run build:lib`                | Build every library entry point in production mode                 |
| `npm run build:mcp`                | Build the local documentation MCP package                          |
| `npm run test:lib`                 | Run the complete library test suite                                |
| `npm run test:mcp`                 | Run the MCP search and protocol tests                              |
| `npm run build:docs`               | Build the documentation application in production mode             |
| `npm run build`                    | Run package validation and all production builds                   |

## AI-readable documentation

Aeris generates canonical AI documentation from the same catalog, guides, API tables,
accessibility guidance, and verified examples used by the documentation application. AI tools can
start with [`llms.txt`](projects/docs/public/llms.txt), load the self-contained
[`llms-full.txt`](projects/docs/public/llms-full.txt), retrieve focused
[component Markdown](projects/docs/public/ai/22/components/button.md), or query the structured
[`aeris-docs.json`](projects/docs/public/ai/22/aeris-docs.json). The accompanying
[`schema`](projects/docs/public/ai/schema/aeris-docs.schema.v1.json) provides a stable machine
contract for JSON consumers.

```bash
npm run generate:ai-docs # Refresh the committed corpus after documentation changes
npm run check:ai-docs    # Validate the schema and fail when generated output has drifted
```

The public deployment serves discovery files from `/llms.txt` and `/llms-full.txt`, with versioned
component Markdown and JSON under `/ai/22/`. The Angular-major directory versions the content; the
independent `schemaVersion` versions the JSON shape. Generated files must not be edited manually.

### Local documentation MCP server

The separately published `@aeris-ui/mcp` package lets compatible AI clients search and retrieve
focused, version-matched Aeris documentation over local `stdio`. It does not run in Angular
applications, start an HTTP server, inspect project files, modify workspaces, or require network
access at runtime.

```json
{
  "mcpServers": {
    "aeris": {
      "command": "npx",
      "args": ["-y", "@aeris-ui/mcp@22.0.0-alpha.1"]
    }
  }
}
```

For repository development, build it with `npm run build:mcp` and point an MCP client to
`dist/aeris-mcp/cli.js`. The documentation [MCP guide](https://aeris-ui.dev/guides/mcp) covers
package and local configuration.

## Package usage

Install the exact prerelease version during alpha. A consumer application imports only the entry
points it needs:

```bash
ng add @aeris-ui/core@22.0.0-alpha.1
```

The Angular initializer supports interactive setup, a schema-backed `aeris.setup.json`, custom
palette seeds, runtime or build-time theming, single- or dual-scheme output, built-in density and
corner choices, multi-project workspaces, LTR/RTL initialization, and Tailwind or Bootstrap
detection. Direct npm installation remains available for manual configuration.

```ts
import { AerisButton } from '@aeris-ui/core/button';
import { AERIS_THEME_PRESETS, AerisThemeService, provideAeris } from '@aeris-ui/core/theming';
```

Pass `AERIS_THEME_PRESETS.earth`, `.coastal`, `.orchid`, or `.monochrome` to `provideAeris({ theme })` to start
with an official theme. Aeris Earth is used when no theme is supplied.

For a fixed application theme, generate the resolved light and dark token stylesheet during the
build. The published `aeris-theme` CLI uses a schema-backed JSON configuration, audits contrast,
and emits deterministic CSS without loading Angular in Node.js:

```bash
npx aeris-theme --config aeris.theme.json
```

The framework-independent compiler API is available from `@aeris-ui/core/theme-builder`. See the
documentation Theming guide for configuration, CSS ordering, system-mode behavior, and runtime
theming tradeoffs. Build-time configurations pin the public color derivation version so an upgrade
cannot silently change existing derived token values.

Global theme assets:

```scss
@use '@aeris-ui/core/theming.scss' as aeris;
```

```css
@import '@aeris-ui/core/styles/aeris.css';
@import '@aeris-ui/core/styles/controls.css';
```

## Community and security

- Read [Contributing](CONTRIBUTING.md) before proposing a change.
- Follow the [Code of Conduct](CODE_OF_CONDUCT.md) in project spaces.
- Use [Support](SUPPORT.md) to choose the correct help channel.
- Report vulnerabilities privately according to the [Security Policy](SECURITY.md).

Aeris UI must remain independently designed. Contributions may use other projects only to
understand general use cases and accessibility expectations; copied source, DOM, CSS, APIs,
examples, wording, visual assets, or distinctive interaction designs are not accepted.

## License

Aeris UI source is available under the [MIT License](LICENSE). Separately licensed material is
listed in [Third-party licenses](THIRD_PARTY_LICENSES.md), including the Pexels-licensed
documentation images recorded in
[Documentation asset provenance](projects/docs/public/ASSET_LICENSES.md).
