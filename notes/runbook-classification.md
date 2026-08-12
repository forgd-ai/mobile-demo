# Runbook classification: automate today vs keep the human gate

One defensible split of `RUNBOOK.md` into steps safe to automate now and
steps that keep a human sign-off. Not the only defensible split; the
reasoning matters more than the buckets. The working rule used here:
automate when the step is deterministic, reversible before publication, and
machine-checkable; gate when the step publishes to users, spends
reputation, or needs judgment about quality rather than correctness.

## Safe to automate today

| runbook step | why |
|---|---|
| 0 preflight gates | pure checks (`npm run build`, `npm test`); deterministic, no side effects |
| 1 version bump | mechanical lockstep edit; wrong bumps are caught before tag/publish |
| 2 (drafting half) | collecting and grouping commits is mechanical; see gate below for the other half |
| 3 tag creation | deterministic given an approved version; script already refuses re-tags |
| 4 (reporting half) | reading rollout stage and health is a query, not a decision |
| 6 (detection half) | noticing a crash-rate regression is monitoring, not judgment |

`/release-notes` (built in this lab) automates the drafting half of step 2.

## Keep the approval gate

| runbook step | why |
|---|---|
| 2 (sign-off half) | notes ship to users; only a human can vouch nothing user-facing is missing or overstated |
| 4 (promotion half) | each stage widens the blast radius; the hold-period judgment ("was it clean?") weighs signals the ledger does not capture |
| 5 store submission | external, slow to reverse, costs days on rejection; metadata review is a quality call |
| 6 (response half) | choosing rollback vs fast-forward patch is an incident decision with tradeoffs |

## The line, stated once

Automation ends where publication begins. Everything before a release
artifact reaches a user can be scripted and re-run; everything after needs
a name attached to the decision.
