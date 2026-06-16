// Description: Field-level mapping from the legacy row shape to the app-facing Activity contract.
// Description: This is the single place where snake_case becomes camelCase; it composes the other transforms.

import { activityTypeName, statusName } from './enums.js';
import { epochToIso } from './time.js';
import {
  Units,
  distanceUnit,
  elevationUnit,
  toDisplayDistance,
  toDisplayElevation,
} from './units.js';

// The legacy row exactly as the API returns it. If the API shape changes,
// this interface and the mapping below absorb the change; the app never sees it.
export interface LegacyWorkoutRow {
  workout_id: number;
  user_id: number;
  activity_type: number;
  start_ts: number;
  duration_s: number;
  distance_m: number;
  elevation_gain_m: number | null;
  status: number;
}

export interface LegacyUserRow {
  user_id: number;
  display_name: string;
  home_tz: string;
  unit_pref: number;
  created_ts: number;
}

export interface Activity {
  id: number;
  userId: number;
  type: string;
  status: string;
  startTime: string;
  durationSeconds: number;
  distance: number;
  distanceUnit: string;
  elevationGain: number;
  elevationUnit: string;
}

export interface User {
  id: number;
  name: string;
  homeTimezone: string;
}

export function toActivity(row: LegacyWorkoutRow, units: Units): Activity {
  return {
    id: row.workout_id,
    userId: row.user_id,
    type: activityTypeName(row.activity_type),
    status: statusName(row.status),
    startTime: epochToIso(row.start_ts),
    durationSeconds: row.duration_s,
    distance: toDisplayDistance(row.distance_m, units),
    distanceUnit: distanceUnit(units),
    elevationGain: toDisplayElevation(row.elevation_gain_m ?? 0, units),
    elevationUnit: elevationUnit(units),
  };
}

export function toUser(row: LegacyUserRow): User {
  return {
    id: row.user_id,
    name: row.display_name,
    homeTimezone: row.home_tz,
  };
}
