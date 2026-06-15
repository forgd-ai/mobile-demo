// Description: Loads the committed JSON fixtures that stand in for the legacy database.
// Description: All rows keep the legacy conventions: snake_case, meters, epoch seconds, numeric enums.

import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export interface WorkoutRow {
  workout_id: number;
  user_id: number;
  activity_type: number;
  start_ts: number;
  duration_s: number;
  distance_m: number;
  elevation_gain_m: number | null;
  status: number;
}

export interface UserRow {
  user_id: number;
  display_name: string;
  home_tz: string;
  unit_pref: number;
  created_ts: number;
}

const fixturesDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'fixtures');

export const workouts: WorkoutRow[] = JSON.parse(
  readFileSync(join(fixturesDir, 'workouts.json'), 'utf-8')
);

export const users: UserRow[] = JSON.parse(
  readFileSync(join(fixturesDir, 'users.json'), 'utf-8')
);

// The legacy code table. UPPERCASE names are what the old mobile client rendered.
export const activityTypes = [
  { type_code: 1, type_name: 'RUN' },
  { type_code: 2, type_name: 'RIDE' },
  { type_code: 3, type_name: 'SWIM' },
  { type_code: 4, type_name: 'HIKE' },
  { type_code: 5, type_name: 'WALK' },
];

// Status enum lives in application code, not the code table, because the
// original team never migrated it. 0=PENDING_UPLOAD 1=PROCESSING 2=SYNCED 3=FLAGGED
