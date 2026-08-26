# Release dry run: full runbook rehearsal, recorded

A complete local walk of the mechanical runbook steps, exactly what
`.github/workflows/release-dry-run.yml` runs on `workflow_dispatch`. Every
step is a repo-local script; nothing left the machine. Rehearsed for a
hypothetical 1.4.0 minor release on top of v1.3.0.

## Transcript

```
$ npm run build && npm test   # runbook step 0 (output elided; both green)

$ ./scripts/release/bump-version.sh minor
version bump: 1.3.0 -> 1.4.0 (dry-run)
  would update package.json
  would update services/api/package.json
  would update services/bff/package.json
  would update app/package.json
  would update app/app.json (expo.version)

$ ./scripts/release/tag-release.sh
note: v1.3.0 already exists; a real release would bump the version first (step 1)

$ ./scripts/release/rollout-status.sh
release v1.3.0 rollout status
  current stage: 0% of users
  [ ] 5%
  [ ] 25%
  [ ] 50%
  [ ] 100%
  next promotion: 5% (run with --promote after the hold period and sign-off)

$ ./scripts/release/submit-store.sh
store submission dry run for v1.3.0
  [1/4] verify store metadata matches CHANGELOG.md entry for 1.3.0
  [2/4] would build the release binary (eas build --profile production)
  [3/4] would upload to the store track (eas submit)
  [4/4] would attach release notes and submit for review
dry run only: this repo has no store account on purpose
```

## Observations

- The tag script's refusal path fired because HEAD's version is already
  tagged; in a real release the bump (step 1, `--apply`) runs first, so the
  rehearsal order matches the runbook order.
- Release notes drafting (step 2) is deliberately absent from the scripts:
  `/draft-release-notes` produces the draft and a human signs it off before it
  touches `CHANGELOG.md`. The automation boundary from
  `notes/runbook-classification.md` holds in practice.
- Nothing in the rehearsal needed credentials, network access, or cleanup;
  the whole loop is safe to re-run any number of times.
