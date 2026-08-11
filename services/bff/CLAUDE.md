# services/bff - the backend-for-frontend

Owns the app-facing contract. Express server, entry point `src/server.ts`.
Every difference between the legacy API's shape and what the app renders is
translated here, and nowhere else.

## The translation table

| translation | from (legacy) | to (app contract) | lives in |
|---|---|---|---|
| envelope + casing | `{ result }`, `snake_case` | bare JSON, `camelCase` | `src/apiClient.ts`, `src/transforms/casing.ts` |
| units | meters | km/mi and m/ft display values, 1 decimal | `src/transforms/units.ts` |
| time | epoch seconds UTC | ISO 8601 strings; local day/week bucketing | `src/transforms/time.ts` |
| enums | numeric codes | named values (`run`, `synced`, ...) | `src/transforms/enums.ts` |
| aggregation | raw rows | weekly totals per Monday-start week | `src/summary.ts` |

Conversion constants: 1 mile = 1609.344 m, 1 m = 3.28084 ft. Weekly totals
accumulate in raw storage units and convert to display units exactly once.

## Endpoints

```
GET /health
GET /api/activities?userId=&units=          newest first
GET /api/activities/:id?units=
GET /api/users
GET /api/summary/weekly?userId=&units=&tz=  weeks newest first, bucketed in tz
```

`units` is `metric` (default) or `imperial`. `tz` is an IANA zone; invalid
zones fall back to UTC.

## Per-endpoint transform pipelines

What each endpoint does to a legacy row, in order:

- `/api/activities`: fetch rows -> unwrap envelope (`apiClient`) ->
  `toActivity` (casing + enums + time + per-row display units) -> sort
  newest first. Optional `?status=` filters on the named status.
- `/api/activities/:id`: fetch one row -> unwrap -> `toActivity`.
- `/api/users`: fetch rows -> unwrap -> `toUser` (casing only).
- `/api/summary/weekly`: fetch rows -> unwrap -> `weekStartKey` buckets each
  row into a Monday-start week in the request's `tz` -> per-week totals sum
  raw meters/seconds and convert to display units once (`summary.ts`) ->
  weeks sorted newest first.

Per-row display values round to 1 decimal at the last step. Weekly totals
never sum already-rounded values; rounding error would accumulate with row
count.

## Rules

- Every transform has a unit test (`npm test` runs vitest here). A transform
  without a test does not merge.
- The app renders BFF values verbatim; if the app shows a wrong number, the
  first question is whether the BFF produced it or the API stored it. Compare
  `/v1/` and `/api/` responses for the same rows before editing code.
- Unknown enum codes degrade to explicit fallbacks (`other`, `unknown`),
  never crash.
- Only `src/apiClient.ts` talks to the legacy API; everything downstream
  works with unwrapped rows.
