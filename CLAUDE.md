# Stride monorepo

Three-layer activity tracking stack. One npm-workspaces monorepo, TypeScript
throughout, one `npm install` at the root.

## Topology

```
services/api/   Legacy backend API. Express on :4000. Serves committed JSON
                fixtures in the original monolith's shape: snake_case fields,
                metric units, epoch-second timestamps, numeric enums, and a
                { result, count } response envelope.
services/bff/   Backend-for-frontend. Express on :4100. Owns the app-facing
                contract and every translation from the legacy shape.
app/            Expo React Native app. Talks only to the BFF. The browser
                (react-native-web) is the supported run target; it renders
                inside a phone-sized frame.
```

## Commands

```
npm run dev      boot all three layers (api :4000, bff :4100, app web :8081)
npm run build    typecheck every workspace (tsc --noEmit)
npm test         run the BFF transform unit tests (vitest)
```

All data is committed fixtures. There is no database, no auth, and no `.env`;
the repo runs from a clean clone.

## Contract ownership

The BFF owns the app-facing contract. These rules are load-bearing:

- The app never calls the legacy API directly. Every request goes to the BFF.
- Changes to legacy API shapes are absorbed in the BFF's transform layer;
  the app contract stays stable.
- The app renders BFF values verbatim and only assembles display strings.
  If a number is wrong on a screen, decide which layer owns the error before
  editing anything.

## The journey of a value (data-flow map)

Every number on a screen crosses three layers. The full trace for distance,
field by field:

| layer | representation | where |
|---|---|---|
| api storage | `distance_m: 27277` (meters, snake_case) | `services/api/fixtures/workouts.json` |
| api response | same row inside `{ result, count }` envelope | `GET /v1/workouts` |
| bff unwrap | bare legacy row | `services/bff/src/apiClient.ts` |
| bff transform | `distance: 27.3, distanceUnit: "km"` (display value, 1 decimal) | `src/transforms/casing.ts` -> `units.ts` |
| bff aggregation | weekly `totalDistance` from raw meter sums, converted once | `services/bff/src/summary.ts` |
| app fetch | typed `Activity` / `WeeklySummary` | `app/src/api/client.ts` |
| app render | `"27.3 km"` string assembly | `app/src/format.ts` -> screens |

The same shape holds for time (epoch -> ISO -> local strings) and enums
(numeric code -> name -> icon/label). When a value is wrong on screen,
walk this table from the bottom up and find the first layer where it is
already wrong; that layer owns the bug.

## Where to look

- Per-layer conventions: `services/api/CLAUDE.md`, `services/bff/CLAUDE.md`,
  `app/CLAUDE.md`.
- Working notes (specs, investigations, rationale): `notes/`.
- Release process: `RUNBOOK.md`.
