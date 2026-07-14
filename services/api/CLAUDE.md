# services/api - the legacy workouts API

Synthetic stand-in for the original backend monolith. Express server, entry
point `src/server.ts`, data loaded from `fixtures/*.json` by `src/data.ts`.
Nothing here is modern on purpose; the BFF exists to absorb this shape.

## Legacy conventions (all deliberate)

- Field names are `snake_case`.
- Distances and elevation are metric storage units: meters, always.
- Timestamps are epoch seconds, UTC (`start_ts`, `created_ts`).
- Enums are numeric codes; names live in application code or the code table.
- Success envelope: `{ "result": ..., "count": n }`.
  Error envelope: `{ "error_code": n, "error_msg": "..." }`.

## Data model

`fixtures/workouts.json`, one row per workout:

| field | meaning |
|---|---|
| `workout_id` | unique id, chronological |
| `user_id` | owner; see `fixtures/users.json` |
| `activity_type` | numeric code: 1=RUN 2=RIDE 3=SWIM 4=HIKE 5=WALK; stray codes exist |
| `start_ts` | workout start, epoch seconds UTC |
| `duration_s` | duration in seconds |
| `distance_m` | distance in meters |
| `elevation_gain_m` | elevation gain in meters; can be null on old rows |
| `status` | 0=PENDING_UPLOAD 1=PROCESSING 2=SYNCED 3=FLAGGED |

`fixtures/users.json`: `user_id`, `display_name`, `home_tz` (IANA zone),
`unit_pref` (unused by this API; display units are a client concern),
`created_ts`.

## Endpoints

```
GET /health
GET /v1/workouts?user_id=&from_ts=&to_ts=   filters optional; to_ts exclusive
GET /v1/workouts/:id
GET /v1/users
GET /v1/users/:id
GET /v1/activity_types                      the legacy code table
```

## Rules

- Do not modernize this service. Its legacy shape is the point; the BFF owns
  translation.
- Fixture edits change what every layer downstream shows; treat
  `fixtures/*.json` as production data.
