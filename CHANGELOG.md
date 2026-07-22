# Changelog

All notable Aeris UI changes are recorded here. The project follows the structure of
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Aeris major versions align with Angular
major versions; minor and patch numbers retain their semantic-version meanings within that Angular
release line.

## [Unreleased]

No consumer-visible changes have been recorded since the initial alpha release.

## [22.0.0-alpha.0] - 2026-07-22

### Added

- Angular-aligned versioning beginning with the Aeris 22 release line.
- Clear alpha and not-production-ready status across package and documentation metadata.
- Angular 22 peer dependencies constrained to `>=22.0.6 <23.0.0`.
- Public Aeris-to-Angular compatibility, changelog, and updating documentation.
- Automated validation that package and documentation version metadata remain aligned.
- Versioned canonical AI documentation with a JSON schema, structured corpus, focused component
  Markdown, `llms.txt`, and a self-contained `llms-full.txt` context file.
- The separately published `@aeris-ui/mcp` package with read-only documentation resources,
  focused search and retrieval tools, and bundled version-matched documentation.
- Angular 22 component library with standalone secondary entry points.
- Semantic theming with palettes, light and dark modes, density, corner styles, and RTL.
- Component documentation covering APIs, accessibility, tokens, examples, and responsive behavior.

### Changed

- Verify production package exports, dependencies, CSS preservation, and tarball contents in CI.

### Fixed

- Align the published Lexical peer range with the version Aeris uses and declare the required
  Angular platform-browser and RxJS peers.

[Unreleased]: https://github.com/Aeris-UI/AerisUI/commits/main
