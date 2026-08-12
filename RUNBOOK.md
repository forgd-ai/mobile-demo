# Release runbook

The staged release process for Stride. One release engineer runs it top to
bottom; steps marked **[APPROVAL GATE]** need a named human sign-off recorded
in the release thread before the step runs. Everything else is mechanical and
a candidate for automation.

Scripts referenced below live in `scripts/release/` and run locally. Every
script is dry-run by default and only acts when passed `--apply`, so the
whole runbook can be rehearsed without side effects.
`.github/workflows/release-dry-run.yml` walks the mechanical steps the same
way.

## 0. Preflight

- Working tree clean, `main` up to date.
- Gates green: `npm run build`, `npm test`.
- No open incident against the previous release.

## 1. Version bump

Run `scripts/release/bump-version.sh <major|minor|patch>`. It updates the
root and workspace `package.json` versions and `app/app.json` in lockstep.
Versions never drift between workspaces.

## 2. Release notes and changelog **[APPROVAL GATE]**

Draft release notes from the commits between the previous tag and HEAD,
grouped by conventional-commit type (feat, fix, everything else). Fold them
into `CHANGELOG.md` under the new version heading.

Gate: the release engineer reads the draft against the actual diff and
signs off that nothing user-facing is missing or overstated. Notes ship to
users; wrong notes are an incident of their own.

## 3. Tag

Run `scripts/release/tag-release.sh`. It creates the annotated tag
`v<version>` on the release commit. Tags are immutable once pushed; a bad
tag means a new patch release, never a re-tag.

## 4. Staged rollout **[APPROVAL GATE at each promotion]**

Roll out to production in stages, watching crash rate and the support queue
at each hold:

| stage | audience | hold |
|---|---|---|
| 1 | 5% | 24 hours |
| 2 | 25% | 24 hours |
| 3 | 50% | 24 hours |
| 4 | 100% | done |

`scripts/release/rollout-status.sh` reports the current stage and what the
next promotion would be. Gate: each promotion needs sign-off that the hold
period passed clean. A crash-rate regression at any stage stops the rollout
and jumps to step 6.

## 5. Store submission **[APPROVAL GATE]**

Run `scripts/release/submit-store.sh`. It packages the build and walks the
store submission steps. Gate: store metadata (version, notes, screenshots)
reviewed before submission; store rejections cost days.

## 6. Rollback

If a stage regresses: halt the rollout at the current percentage, then
either (a) roll users back to the previous version if the platform supports
it, or (b) fast-track a patch release through this same runbook starting at
step 0. Record what happened in `notes/` while it is fresh; the postmortem
draws from it.
