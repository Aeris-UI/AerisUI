# Releasing Aeris UI

This process keeps package metadata, compatibility information, and consumer guidance synchronized
for every Aeris release.

## Version policy

- The Aeris major version matches the Angular major version it supports.
- Minor releases add backward-compatible Aeris features within an Angular release line.
- Patch releases contain backward-compatible fixes and documentation corrections.
- Prereleases use standard identifiers such as `22.0.0-alpha.0` and `22.0.0-rc.0`.
- Public APIs are not intentionally broken within an Aeris major. Deprecate them first and remove
  them only in the next Angular-aligned major release.
- Angular peer dependencies use an explicit lower bound and exclude the next Angular major, for
  example `>=22.0.6 <23.0.0`.

## Publishing a release

1. Follow the [branching strategy](BRANCHING.md). Create a short-lived
   `chore/release-<version>` branch from the active release line; use the next major only when moving
   to the corresponding Angular major.
2. Update `version` and Angular peer dependencies in `projects/aeris-ui/package.json`, update the
   matching `version` in `projects/aeris-mcp/package.json`, then update `AERIS_UI_VERSION` in
   `projects/aeris-ui/src/public-api.ts`.
3. Update `AERIS_CURRENT_VERSION` and `AERIS_ANGULAR_PEER_RANGE` in
   `projects/docs/src/app/data/aeris-version.ts`, then update the compatibility matrix and release
   notes in `projects/docs/src/app/pages/guides/release-data.ts`.
4. Move completed entries from `Unreleased` into a dated version in `CHANGELOG.md`.
5. Add release-specific migration steps and an `ng update` migration when an API, token, markup
   contract, behavior, or dependency requirement changes.
6. Run `npm run check:versions`, `npm run check:package`, `npm run check:mcp-package`, the complete
   library and MCP tests, and both production builds. Use `npm run pack:lib` to create the exact
   library tarball from a fresh production build, and inspect a dry-run package of
   `dist/aeris-mcp`; never publish the output of `npm start` or `watch:lib`.
7. Merge the verified release pull request, create an annotated `v<version>` tag from its merge
   commit, and publish matching GitHub and npm release notes. Never tag an unmerged working branch.

Do not add an Angular version to the compatibility matrix until the complete library and
documentation application have been verified against it.
