# Changelog

All notable changes to Stride are documented here. The format follows
Keep a Changelog; versions follow semver.

## [1.3.0] - 2026-08-07

### Added

- Status filter on the BFF activities endpoint (`?status=`)
- Cross-layer accuracy repro script (`scripts/repro-accuracy-bug.sh`): checks
  the weekly summary against totals recomputed from the raw API data
- Workshop setup checklist

### Changed

- Summary card extracted into its own component

### Fixed

- Weekly summary now refetches after settings changes
- Weekly elevation totals cover legacy rows with missing elevation (test coverage)

## [1.2.0] - 2026-07-24

### Added

- Profile switcher in settings: the app can show any fixture user's activities
- About screen with the stack description and app version
- Release runbook (`RUNBOOK.md`), release scripts, and a dry-run rehearsal
  workflow
- Per-layer project context files documenting each workspace's conventions

### Changed

- Fixture window refreshed to current weeks

## [1.1.0] - 2026-07-03

### Added

- Weekly summary endpoint on the BFF: Monday-start weeks bucketed in the
  viewer's timezone, totals for distance, time, and elevation
- Weekly summary screen behind bottom tab navigation
- Settings screen with a metric/imperial display units preference

### Fixed

- Durations over an hour now render as hours and minutes instead of raw minutes

## [1.0.0] - 2026-06-19

### Added

- Legacy workouts API (`services/api`) serving the committed fixture dataset
- BFF (`services/bff`) with the app-facing contract: activities list, activity
  detail, and users, translated from the legacy shape
- Unit tests for every BFF transform: casing, units, time, enums
- Expo app (`app/`) with the activity feed and activity detail screens
- Web phone frame so the browser target renders at phone dimensions
