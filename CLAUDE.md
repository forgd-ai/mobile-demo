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

## Where to look

- Per-layer conventions: `services/api/CLAUDE.md`, `services/bff/CLAUDE.md`,
  `app/CLAUDE.md`.
- Working notes (specs, investigations, rationale): `notes/`.
- Release process: `RUNBOOK.md`.
