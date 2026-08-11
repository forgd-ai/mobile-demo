// Description: Weekly aggregation: buckets legacy rows into Monday-start weeks and totals them.
// Description: This is the only place weekly totals are computed; the app renders them as-is.

import { LegacyWorkoutRow } from './transforms/casing.js';
import { activityTypeName } from './transforms/enums.js';
import { addDays, weekLabel, weekStartKey } from './transforms/time.js';
import {
  Units,
  distanceUnit,
  elevationUnit,
  round1,
  toDisplayDistance,
  toDisplayElevation,
} from './transforms/units.js';

export interface WeeklySummary {
  weekStart: string;
  weekEnd: string;
  label: string;
  workouts: number;
  totalDistance: number;
  distanceUnit: string;
  totalDurationSeconds: number;
  totalElevationGain: number;
  elevationUnit: string;
  byType: Record<string, number>;
}

export function buildWeeklySummary(
  rows: LegacyWorkoutRow[],
  units: Units,
  timeZone: string
): WeeklySummary[] {
  const buckets = new Map<string, LegacyWorkoutRow[]>();
  for (const row of rows) {
    const key = weekStartKey(row.start_ts, timeZone);
    const bucket = buckets.get(key);
    if (bucket) {
      bucket.push(row);
    } else {
      buckets.set(key, [row]);
    }
  }

  return [...buckets.entries()]
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([weekStart, group]) => {
      // Derive the weekly total from the same per-row display conversion the
      // activity list uses, so the two screens always agree on what each
      // workout contributed.
      const totalDistance = round1(
        group.reduce((sum, row) => sum + toDisplayDistance(row.distance_m, units), 0)
      );
      const totalSeconds = group.reduce((sum, row) => sum + row.duration_s, 0);
      const totalElevationMeters = group.reduce(
        (sum, row) => sum + (row.elevation_gain_m ?? 0),
        0
      );
      const byType: Record<string, number> = {};
      for (const row of group) {
        const name = activityTypeName(row.activity_type);
        byType[name] = (byType[name] ?? 0) + 1;
      }
      return {
        weekStart,
        weekEnd: addDays(weekStart, 6),
        label: weekLabel(weekStart),
        workouts: group.length,
        totalDistance,
        distanceUnit: distanceUnit(units),
        totalDurationSeconds: totalSeconds,
        totalElevationGain: toDisplayElevation(totalElevationMeters, units),
        elevationUnit: elevationUnit(units),
        byType,
      };
    });
}
