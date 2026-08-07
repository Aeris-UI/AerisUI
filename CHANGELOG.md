# Changelog

All notable Aeris UI changes are recorded here. The project follows the structure of
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Aeris major versions align with Angular
major versions; minor and patch numbers retain their semantic-version meanings within that Angular
release line.

## [Unreleased]

No consumer-visible changes have been recorded since 22.0.0-alpha.4.

## [22.0.0-alpha.4] - 2026-08-07

### Added

- Add configurable `appendTo` support for overlay-producing components, with local targets and a
  global default for panels that must escape clipping containers.

### Changed

- Unify structural and selectable-item corner radii across themes and components while preserving
  intentional circular, media, and checkbox geometry.
- Synchronize Design Lab appearance choices with the documentation theme controls.
- Upgrade the development stack to Angular 22.1.1, Angular tooling 22.1.3, Lexical 0.49, Lucide
  Angular 1.30, MCP SDK 1.30, and jsdom 30 without changing the supported Angular 22 peer range.
- Refresh transitive dependencies and security overrides to resolve newly disclosed advisories.

### Fixed

- Keep appended tooltips positioned against their owning element while the document scrolls.
- Restore visible, consistently sized close controls in Drawer examples.
- Match hovered and selected item corners to their containing Menu, TieredMenu, ContextMenu,
  Select, tree, and list surfaces.

## [22.0.0-alpha.3] - 2026-07-28

### Changed

- Refine the Coastal, Earth, and Orchid palettes with more cohesive, role-based color systems.
- Use subtle neutral boundaries consistently across components, controls, overlays, tables, and
  documentation surfaces.
- Synchronize generated examples, AI documentation, and theme metadata with the updated tokens.
- Refresh the Angular toolchain and routine development dependencies without changing the supported
  Angular 22 peer range.
- Show guided and package-only installation commands directly on the landing page.

## [22.0.0-alpha.2] - 2026-07-28

### Added

- Trusted npm publishing for `@aeris-ui/core` and `@aeris-ui/mcp` from versioned GitHub Releases.
- Discreet sponsorship and supporter-recognition guidance for the project and documentation site.

### Changed

- Refresh the Earth theme with olive, forest, cornsilk, caramel, and copper tones.
- Centralize component fallback colors so future built-in palette changes remain focused in the
  theming layer.
- Clarify Aeris UI's open-source positioning across the landing page and documentation.
- Update development dependencies while preserving the supported Angular 22 peer range.

### Fixed

- Render Tabs correctly on the first lazy navigation without reading required panel inputs too
  early.
- Match ContextMenu item corner radii to the containing menu surface.
- Polish Toast stacking, entry and exit motion, rapid interactions, and pointer or touch swipe
  dismissal.
- Animate MeterGroup fills from the logical start edge in both LTR and RTL layouts.
- Keep canonical URLs consistent after production-domain redirects.

## [22.0.0-alpha.1] - 2026-07-23

### Fixed

- Prevent touch taps from leaving buttons in a persistent hover appearance while preserving active
  press feedback, pointer hover, and keyboard focus visibility.

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

[Unreleased]: https://github.com/Aeris-UI/AerisUI/compare/v22.0.0-alpha.4...HEAD
[22.0.0-alpha.4]: https://github.com/Aeris-UI/AerisUI/compare/v22.0.0-alpha.3...v22.0.0-alpha.4
[22.0.0-alpha.3]: https://github.com/Aeris-UI/AerisUI/compare/v22.0.0-alpha.2...v22.0.0-alpha.3
[22.0.0-alpha.2]: https://github.com/Aeris-UI/AerisUI/compare/v22.0.0-alpha.1...v22.0.0-alpha.2
[22.0.0-alpha.1]: https://github.com/Aeris-UI/AerisUI/compare/v22.0.0-alpha.0...v22.0.0-alpha.1
[22.0.0-alpha.0]: https://github.com/Aeris-UI/AerisUI/releases/tag/v22.0.0-alpha.0
