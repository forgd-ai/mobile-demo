# Stride

Activity tracking across a three-layer mobile stack: a legacy backend API, a
BFF that owns the app contract, and an Expo React Native app.

## Overview

Stride records workouts (runs, rides, swims, hikes, walks) and shows a weekly
training summary. The stack mirrors how enterprise mobile teams ship: the
backend API is legacy-shaped (snake_case, metric units, epoch timestamps,
numeric enums), the BFF translates it into the shape the app renders, and the
app never talks to the backend directly. All data comes from committed
fixtures; there are no accounts, no external services, and no environment
files to configure.

## Setup

```bash
npm install
npm run dev
```

`npm run dev` starts all three layers: the API on `http://localhost:4000`,
the BFF on `http://localhost:4100`, and the app's web target on
`http://localhost:8081` (the terminal prints the URL). Open it in a browser;
the app renders inside a phone-sized viewport.

Requires Node 20 or later. Running on a phone via Expo Go also works
(`npm run start -w app`, then scan the QR code) but the browser is the
supported path.

## Usage

```bash
npm run dev      # boot api + bff + app together
npm run build    # typecheck every workspace
npm test         # run the BFF transform unit tests
```

## Layout

- `services/api/` - synthetic legacy workouts API; serves committed JSON fixtures
- `services/bff/` - the BFF; owns every translation between the API and the app
- `app/` - Expo React Native app; consumes only the BFF
- `notes/` - working notes (specs, investigations, rationale)

## Configuration

None required. Optional overrides: `PORT` on either service, `API_URL` on the
BFF, `EXPO_PUBLIC_BFF_URL` on the app.
