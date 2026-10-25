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

`npm start` builds the library and then serves the documentation application. It anchors child
processes to the checked-out repository, rejects duplicate sessions and occupied ports, and clears
Angular cache metadata when the checkout moves to a different absolute path. Stop the complete
development stack with `Ctrl+C`. It does not publish anything.

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
npm run check:packed-install
npm run check:minimum-angular
npm run check:mcp-package
npm run test:performance-budgets
npm run check:bundle-size
npm run check:consumer-performance
npm run test:lib
npm run test:mcp
npm run check:ai-docs
npm run build:docs
```

`check:consumer-performance` builds isolated production consumers and compares their JavaScript
cost with a plain Angular application. It also verifies that Chart.js, Lexical, and unrelated Aeris
entry points are not pulled into core scenarios. Run `npm run benchmark:consumer-performance` when
changing Table filtering or overlay interaction hot paths; its browser timings are diagnostic and
are not used as environment-sensitive CI limits.

`npm run build:site` builds the library and documentation for static hosting, including the
documentation checks and budgets. Vercel uses this target. Full `npm run build` verification,
including packed consumers and Chromium hydration, remains a CI and release responsibility.

The packed-install checks use a temporary directory outside the repository so workspace
dependencies cannot hide missing peers. They compile with the consumer's own Angular compiler,
render on the server, and hydrate in Chromium, checking server-node reuse, deferred tabs, and
floating Toolbar placement. Install Chromium with `npx playwright install chromium` first.
`check:minimum-angular` repeats this against the exact lower bound of the declared Angular peer range.

### Performance budgets

Production consumer bundles are the primary payload checks. They cover basic controls, native
select, popup forms, editable dates, data overlays, Chart.js, Lexical, runtime theming, and
CodeBlock/Shiki. Deferred highlighting has a separate startup check. Optional dependency isolation
is mandatory even during measurement-only runs.

Library package totals and individual entry-point sizes are secondary guardrails: they do not
represent what an application downloads. Documentation startup, CSS, catalog navigation and all
deferred preview families are measured separately. Angular's `initial` limit includes both
JavaScript and CSS; keep it aligned with the documentation measurements.
The separate Angular component-stylesheet guard warns at 14 kB and fails at 16 kB; it is not part
of the startup JavaScript calculation.

The checked-in budget files contain reviewed production baselines and fixed hard ceilings.
Warnings start at 2% growth, with a minimum change of 1 KiB raw or 256 bytes gzip. Reviewed ceilings
allow approximately 5% growth, with at least 4 KiB raw or 1 KiB gzip of headroom, rounded up to KiB.
This tolerates small compiler and CSS changes without hiding meaningful growth. Reports include
the baseline, actual size, byte delta, ceiling and result. CI adds a summary and uploads full JSON
and Markdown artifacts, including on budget failures.

To review an intentional size change:

1. Stop the development watcher and run `npm run build:lib`. Development output is rejected.
2. Run `npm run measure:consumer-performance` to capture new measurements without changing limits.
   This local-only mode still enforces dependency isolation and is prohibited in CI.
3. Run `npm run check:bundle-size` and `npm run build:docs`; inspect
   `.angular/performance-reports/` and `.angular/consumer-performance/report.json`.
4. Investigate unexpected imports and eager loading before changing a baseline. For an intentional
   change, manually update the affected entries in `tools/library-performance-budgets.json`,
   `tools/consumer-performance-budgets.json` or `tools/doc-performance-budgets.json`, with the reason
   and before/after measurements in the pull request. Align `angular.json` when startup sizes change.
5. Rerun the normal checks. Never update baselines automatically in CI, disable isolation checks,
   or merely move a ceiling a few bytes above a failure.

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
