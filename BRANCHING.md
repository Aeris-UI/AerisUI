# Aeris UI branching strategy

Aeris UI uses a lightweight trunk-based workflow. The goal is to keep integration frequent,
release history easy to audit, and documentation synchronized with the library without maintaining
parallel branches that can drift.

## Permanent branches

`main` is the only permanent branch during the Aeris 22 development line. It must remain buildable,
tested, and suitable for a documentation preview. A commit on `main` is not automatically an npm
release; published versions are identified by signed or annotated `v<version>` tags.

Do not create a permanent `develop`, `release`, or `hotfix` branch. Release stabilization and urgent
fixes use short-lived branches and the same review and CI path as other work.

When `main` begins development against a new Angular major while the previous Aeris major is still
supported, create a maintenance branch named `<major>.x` from the final applicable commit. For
example, create `22.x` only when `main` moves to Angular 23 and Aeris 22 still receives patches.
Maintenance branches are the only additional long-lived branches.

## Working branches

Create each working branch from the branch that should receive the change, normally the latest
`main`. Keep it focused and delete it after merge.

| Prefix      | Use                                                            | Example                        |
| ----------- | -------------------------------------------------------------- | ------------------------------ |
| `feature/`  | Backward-compatible components, APIs, or capabilities          | `feature/date-range-picker`    |
| `fix/`      | Defects and regressions                                        | `fix/dialog-focus-restore`     |
| `docs/`     | Documentation-only changes                                     | `docs/branching-strategy`      |
| `refactor/` | Internal restructuring with no intended public behavior change | `refactor/overlay-positioning` |
| `perf/`     | Measurable performance improvements                            | `perf/table-row-rendering`     |
| `test/`     | Test coverage or test infrastructure                           | `test/forced-colors`           |
| `chore/`    | Dependencies, tooling, CI, and repository maintenance          | `chore/update-actions`         |
| `hotfix/`   | Urgent fixes for a supported published release                 | `hotfix/22-dialog-escape`      |

Use lowercase kebab-case after the prefix. Include an issue number when it adds useful traceability,
for example `fix/418-menu-positioning`.

## Standard workflow

1. Update the target branch and create a working branch from it.
2. Make one focused change, including tests, documentation, and changelog entries where required.
3. Push the working branch and open a pull request against its target branch.
4. Keep the branch current when CI or merge protection requires it, without rewriting shared
   history.
5. Require the `CI / verify` check to pass and resolve every review conversation.
6. Squash-merge the pull request using a Conventional Commit pull-request title.
7. Delete the local and remote working branch after merge.

Squash merging gives each pull request one intentional changelog entry on the target branch while
allowing contributors to use small work-in-progress commits on their branches. Do not force-push
`main` or a maintenance branch.

## Releases

Normal releases are prepared on a short-lived `chore/release-<version>` branch targeting the active
release line. After the release pull request passes verification and is merged, create the annotated
`v<version>` tag from the merge commit. Do not tag an unmerged working branch.

Prereleases follow the same process with tags such as `v22.0.0-rc.1`. Avoid a separate release branch
unless stabilization genuinely requires multiple coordinated pull requests; if one is needed, use
`release/<version>` temporarily and delete it after the release is tagged.

## Maintenance and hotfixes

- Branch a fix from the oldest supported line affected by the defect.
- Open the first pull request against that maintenance branch, or against `main` when no maintenance
  branch exists.
- Forward-port the fix to every newer affected line with separate pull requests. Do not rely on an
  unreviewed merge between release lines.
- Tag the patch release from the maintenance branch that produced it.

This keeps fixes reviewable when Angular-major lines have different dependencies or implementation
details.

## GitHub protection

Protect `main` and every maintenance branch with the following repository rules:

- require pull requests instead of direct pushes;
- require `CI / verify` and require the branch to be current before merge;
- require review conversations to be resolved;
- dismiss stale approvals after material changes;
- block force pushes and branch deletion;
- apply the rules to administrators, with emergency bypass limited to repository recovery.

While Aeris has a single maintainer, do not require an approval that the pull-request author cannot
provide. Add at least one required approval when another trusted maintainer can review changes.
