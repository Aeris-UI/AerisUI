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
   library tarball and `npm run pack:mcp` to create the exact MCP tarball from fresh production
   builds; never publish the output of `npm start` or `watch:lib`.
7. Merge the verified release pull request, then create a GitHub Release whose tag is exactly
   `v<version>` and points to the merge commit. Mark alpha, beta, and release-candidate versions as
   prereleases. Never tag an unmerged working branch.
8. Review the release title and notes, then publish the GitHub Release. The `Release` workflow
   rebuilds and retests that tag before publishing both packages through npm trusted publishing.
   Prereleases receive the npm tag `next`; stable releases receive `latest`.

The workflow is safe to rerun after an interruption. It skips a package only when the exact version
already exists and already has the expected npm dist-tag. It fails instead of silently changing an
unexpected dist-tag.

## One-time trusted publishing setup

Configure the following trusted publisher on both
[`@aeris-ui/core`](https://www.npmjs.com/package/@aeris-ui/core) and
[`@aeris-ui/mcp`](https://www.npmjs.com/package/@aeris-ui/mcp):

| npm trusted publisher field | Value          |
| --------------------------- | -------------- |
| Provider                    | GitHub Actions |
| Organization or user        | `Aeris-UI`     |
| Repository                  | `AerisUI`      |
| Workflow filename           | `release.yml`  |
| Environment name            | `npm`          |
| Allowed action              | `npm publish`  |

The workflow uses a GitHub-hosted runner and the `npm` GitHub environment. It requests only
`contents: read` and `id-token: write`; no `NPM_TOKEN` repository secret is required. npm exchanges
the workflow identity for a short-lived publish credential and automatically records provenance for
both public packages.

Create the `npm` environment under the repository's **Settings → Environments** page. Restrict
deployment branches and tags to protected release refs as repository policy allows. A required
reviewer is useful when another trusted maintainer can approve releases; do not configure a review
rule that the only maintainer cannot satisfy.

After one trusted release succeeds, update each npm package under **Settings → Publishing access**
to require two-factor authentication and disallow traditional write tokens. Revoke any obsolete npm
automation token only after the OIDC workflow has been proven.

Trusted publishing is deliberately release-triggered. Normal pushes and pull requests can verify
packages but cannot publish them.

Do not add an Angular version to the compatibility matrix until the complete library and
documentation application have been verified against it.
