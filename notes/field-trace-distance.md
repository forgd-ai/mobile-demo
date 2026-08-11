# Field trace: one workout's distance, end to end

Traced record: `workout_id 1048` (user 1, ride, week of Jul 27). One field,
every representation it passes through, verified against the running stack.

## 1. Storage (api fixture)

```json
{ "workout_id": 1048, "distance_m": 36436, ... }
```

`services/api/fixtures/workouts.json`. Meters, integer, snake_case. This is
the source of truth; nothing downstream stores distance.

## 2. Legacy API response

`GET http://localhost:4000/v1/workouts/1048` returns the same row wrapped in
the legacy envelope: `{ "result": { ... "distance_m": 36436 ... } }`.
No transformation happens in the API layer.

## 3. BFF unwrap and transform

`GET http://localhost:4100/api/activities/1048?units=metric`:

- `apiClient.ts` strips the envelope.
- `toActivity` (`transforms/casing.ts`) renames and converts:
  `distance_m: 36436` becomes `distance: 36.4, distanceUnit: "km"` via
  `toDisplayDistance` (`transforms/units.ts`): 36436 / 1000 = 36.436,
  rounded to one decimal = 36.4.
- With `units=imperial`: 36436 / 1609.344 = 22.640 -> `22.6 mi`.

The display value is born here, and only here.

## 4. Aggregation (the other consumer)

`GET /api/summary/weekly?userId=1&units=metric&tz=UTC`: `summary.ts` buckets
the row into week `2026-07-27`, sums raw meters for the week (147795 m),
converts once: `totalDistance: 147.8`. The per-row 36.4 above is never used
in this sum; rounded display values do not feed arithmetic.

## 5. App render

`app/src/api/client.ts` fetches the typed `Activity`; the list row and the
detail screen render `formatDistance(36.4, "km")` = `"36.4 km"`
(`src/format.ts`). The app performs no math on the value.

## What this trace buys us

Any wrong distance on screen now has a four-step bisection: fixture value,
`/v1/` response, `/api/` response, rendered string. The first step where the
number is already wrong names the owning layer.
