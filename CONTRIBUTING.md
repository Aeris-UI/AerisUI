# Contributing to Aeris UI

Thank you for helping improve Aeris UI. The project values focused changes, accessible behavior,
clear APIs, and documentation that matches the shipped library.

## Before contributing

- Search existing issues before opening a new one.
- Use GitHub Security Advisories for suspected vulnerabilities. Do not disclose them in an issue.
- Keep feature requests and fixes independently designed. Do not submit copied source, markup,
  styles, examples, wording, or assets from another component library.
- Confirm that any new asset or dependency can legally be redistributed and document its license.

## Local setup

Requirements:

- A Node.js version supported by Angular 22
- npm

```bash
git clone https://github.com/Aeris-UI/AerisUI.git
cd AerisUI
npm ci
npm start
```

`npm start` builds the library and then serves the documentation application. It does not publish
anything.

## Repository structure

- `projects/aeris-ui` contains the publishable `@aeris-ui/core` package and its secondary entry
  points.
- `projects/aeris-mcp` contains the independently publishable, Node-only `@aeris-ui/mcp` package.
- `projects/aeris-ui/src/lib/testing` contains the complete library test suite.
- `projects/docs` contains the documentation application and live examples.
- `tools` contains local validation and development scripts.

All contributions must preserve strict typing, standalone Angular APIs, signal-based state,
WCAG 2.2 AA behavior, responsive layouts, framework-safe prefixed styles, and the existing
secondary-entry-point architecture. Prefer focused changes and framework-native solutions.

## Making a change

1. Read the [branching strategy](BRANCHING.md), update the intended target branch, and create a
   focused working branch such as `fix/dialog-focus` or `feature/component-name`.
2. Follow the existing Angular 22 standalone and signal-based patterns.
3. Add or update tests for public API, behavior, accessibility, keyboard interaction, responsive
   structure, and regressions relevant to the change.
4. Update documentation and displayed example code whenever a public contract changes.
5. Run `npm run generate:ai-docs` after changing the component catalog, guides, API tables,
   accessibility guidance, or examples. Commit the deterministic JSON, component Markdown,
   `llms.txt`, and `llms-full.txt` outputs with their source.
6. Add user-visible changes under `Unreleased` in `CHANGELOG.md`.
7. Run the complete verification commands before opening a pull request.

## Verification

```bash
npm run check:versions
npm audit --audit-level=moderate
npm run build:lib
npm run build:mcp
npm run check:package
npm run check:mcp-package
npm run test:lib
npm run test:mcp
npm run check:ai-docs
npm run build:docs
```

Pull requests should not weaken tests, suppress legitimate warnings, introduce undocumented
dependencies, or leave development servers running.

## Commits and pull requests

Use Conventional Commits with an imperative summary:

```text
feat(button): add loading announcement
fix(dialog): restore focus after close
docs(theming): clarify palette generation
```

Keep the summary under 72 characters when practical. Explain what changed, why it changed, how it
was verified, and whether it affects public APIs. Include screenshots or recordings for visual
changes and keyboard notes for interactive changes.

Open pull requests against `main` unless the change is a patch for an existing Angular-major
maintenance branch. Aeris squash-merges pull requests, so the pull-request title must also use
Conventional Commit format. Delete the working branch after merge; do not push directly to `main`
or rewrite shared branch history.

By participating, you agree to follow the [Code of Conduct](CODE_OF_CONDUCT.md).
