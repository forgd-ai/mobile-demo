# Incident: weekly summary distance is wrong for some users

Report: "the weekly summary is wrong for some users." No repro steps, no
screenshots, one angry forum post quoting a training plan discrepancy.

## Reproduction

Profile Sam Okafor (user 1), week Jul 27 - Aug 2, metric:

- Sum of the 12 individual activity distances shown in the list: 147.8 km
  (also verifiable by hand from the raw data, see below)
- Weekly summary card headline: 147.4 km

Imperial shows the same drift: 91.8 mi expected, 91.4 mi displayed.
Profile Priya Shah (user 2, 2-3 workouts a week) shows no visible
discrepancy in any week. "Some users" = high-volume users.

## Deterministic signal

`./scripts/repro-accuracy-bug.sh` (boots both services on test ports,
recomputes expected totals from raw API data):

```
totalDistance (km)         147.8         147.4         MISMATCH
totalDistance (mi)         91.8          91.4          MISMATCH
ACCURACY BUG (2 mismatches)
```

Workout count, duration, and elevation all match. Distance only.

## Layer isolation

Walking the data-flow map bottom-up:

1. API: `GET /v1/workouts?user_id=1` rows for the week sum to 147795 m.
   Raw data is correct.
2. BFF per-row: `GET /api/activities?userId=1&units=metric` distances match
   each raw row converted individually. Correct.
3. BFF aggregate: `GET /api/summary/weekly?...` returns
   `totalDistance: 147.4` for the week. **Wrong. The error is born here.**
4. App: renders the BFF value verbatim (`formatDistance`). Not the app.

The bug lives in the BFF aggregation path: `services/bff/src/summary.ts`.

## Why the tests are green

`npm test` passes on this branch. `summary.test.ts` totals two workouts of
5000 m and 10000 m: values where rounding each row first and rounding the
sum once agree exactly (5.0 + 10.0 = 15.0). The test suite never exercises
a week where per-row rounding errors accumulate. Coverage gap, not luck.

## Git archaeology

`git log --oneline services/bff/src/summary.ts` shows the file last changed
in commit `b20e709` "refactor(bff): normalize distance display across list
and summary" (2026-08-11). The diff:

- replaces "sum raw meters, convert once" with "convert each row to its
  display value, sum, round again"
- deletes the comment warning that display rounding must never feed back
  into arithmetic

A follow-up docs commit (`946b882`) rewrote the project-context rule to
assert the new (wrong) convention, so the branch's `services/bff/CLAUDE.md`
now contradicts itself against the pipeline notes merged from the mapping
work. An adjacent logging commit (`4ee0594`) touches the same route but is
behaviorally inert; ruled out.

## Root cause

`toDisplayDistance` rounds to one decimal for rendering. Summing 12 rounded
values accumulates up to 0.05 per row of error; this fixture week loses
0.4 km. The drift grows with workout count, which is exactly why only
high-volume users noticed. The refactor's stated goal (list and summary
agree per workout) hid a semantics change: display formatting became input
to arithmetic.

## Resolution

- Fix: `summary.ts` accumulates raw meters again and converts once
  ("fix(bff): sum raw distances before display conversion in weekly
  totals"). The context-file rule is restored to the correct convention.
- Regression test: `summary.test.ts` now totals twelve messy-decimal
  distances in both unit systems; the buggy implementation fails it by
  0.4 in each.
- Guard: `npm run check:accuracy` wraps the repro script, and CI
  (`.github/workflows/ci.yml`) runs typecheck, unit tests, and the accuracy
  check on every push and pull request. The class of defect cannot land
  silently again: green unit tests alone no longer vouch for cross-layer
  accuracy.

## Postmortem shape

What happened: a refactor made display rounding an input to arithmetic.
Why it was invisible: correct under the developer's default conditions (few
workouts, clean test values, per-row screens unaffected); wrong under real
conditions (high-volume weeks). How it was found: layer-by-layer bisection
along the data-flow map, then git archaeology on the owning file. What now
prevents it: the regression test pins the semantics, and the accuracy check
compares layers end to end in CI.
