# app - the Stride mobile app

Expo React Native, TypeScript. The browser is the supported run target
(react-native-web) and renders inside a fixed phone-sized frame; iOS and
Android via Expo Go are a bonus path, not required.

## Screens

| screen | file | shows |
|---|---|---|
| Activities | `src/screens/ActivityListScreen.tsx` | feed grouped by local day |
| Activity detail | `src/screens/ActivityDetailScreen.tsx` | one record, all fields |
| Summary | `src/screens/WeeklySummaryScreen.tsx` | weekly totals; headline is total distance |
| Settings | `src/screens/SettingsScreen.tsx` | display units toggle, profile switcher |
| About | `src/screens/AboutScreen.tsx` | version and stack description |

Navigation lives in `App.tsx` (bottom tabs; Activities is a stack).
`src/components/PhoneFrame.web.tsx` is the web-only device frame; native
renders children directly.

## Data

- Every request goes through `src/api/client.ts` to the BFF. The app never
  calls the legacy API, computes totals, or converts units; the BFF owns all
  of that.
- App-wide preferences (units, active profile) live in
  `src/state/SettingsContext.tsx`. One source of truth; screens read it and
  refetch when it changes.

## Display rules

- Display formatting happens in one place: `src/format.ts`. Screens call
  those helpers and never assemble value strings inline.
- Visual constants (palette, spacing) live in `src/theme.ts`; components
  reference them instead of literal values.
- BFF values render verbatim. If a number looks wrong on a screen, do not
  patch it in the app; find the layer that owns it first.
