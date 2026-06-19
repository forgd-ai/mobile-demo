# Changelog

All notable changes to Stride are documented here. The format follows
Keep a Changelog; versions follow semver.

## [1.0.0] - 2026-06-19

### Added

- Legacy workouts API (`services/api`) serving the committed fixture dataset
- BFF (`services/bff`) with the app-facing contract: activities list, activity
  detail, and users, translated from the legacy shape
- Unit tests for every BFF transform: casing, units, time, enums
- Expo app (`app/`) with the activity feed and activity detail screens
- Web phone frame so the browser target renders at phone dimensions
