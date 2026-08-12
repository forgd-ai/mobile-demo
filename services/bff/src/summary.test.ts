// Description: Unit tests for the weekly aggregation.
// Description: Covers bucketing, ordering, and totals over a small fixture set.

import { describe, expect, it } from 'vitest';
import { LegacyWorkoutRow } from './transforms/casing.js';
import { buildWeeklySummary } from './summary.js';

function workout(overrides: Partial<LegacyWorkoutRow>): LegacyWorkoutRow {
  return {
    workout_id: 1,
    user_id: 1,
    activity_type: 1,
    start_ts: Date.parse('2026-07-14T12:00:00Z') / 1000,
    duration_s: 1800,
    distance_m: 5000,
    elevation_gain_m: 20,
    status: 2,
    ...overrides,
  };
}

describe('buildWeeklySummary', () => {
  it('totals a week of workouts', () => {
    const rows = [
      workout({ workout_id: 1, distance_m: 5000, duration_s: 1650, elevation_gain_m: 30 }),
      workout({
        workout_id: 2,
        distance_m: 10000,
        duration_s: 3300,
        elevation_gain_m: 70,
        start_ts: Date.parse('2026-07-16T12:00:00Z') / 1000,
        activity_type: 2,
      }),
    ];
    const weeks = buildWeeklySummary(rows, 'metric', 'UTC');
    expect(weeks).toHaveLength(1);
    expect(weeks[0]).toMatchObject({
      weekStart: '2026-07-13',
      weekEnd: '2026-07-19',
      label: 'Jul 13 - Jul 19',
      workouts: 2,
      totalDistance: 15.0,
      distanceUnit: 'km',
      totalDurationSeconds: 4950,
      totalElevationGain: 100,
      elevationUnit: 'm',
      byType: { run: 1, ride: 1 },
    });
  });

  it('buckets workouts into separate weeks, newest first', () => {
    const rows = [
      workout({ workout_id: 1 }),
      workout({ workout_id: 2, start_ts: Date.parse('2026-07-21T12:00:00Z') / 1000 }),
    ];
    const weeks = buildWeeklySummary(rows, 'metric', 'UTC');
    expect(weeks.map((w) => w.weekStart)).toEqual(['2026-07-20', '2026-07-13']);
    expect(weeks[0].workouts).toBe(1);
    expect(weeks[1].workouts).toBe(1);
  });

  it('returns an empty list for no workouts', () => {
    expect(buildWeeklySummary([], 'metric', 'UTC')).toEqual([]);
  });

  it('treats null elevation rows as zero without dropping the row', () => {
    const rows = [
      workout({ workout_id: 1, elevation_gain_m: 40 }),
      workout({ workout_id: 2, elevation_gain_m: null }),
    ];
    const weeks = buildWeeklySummary(rows, 'metric', 'UTC');
    expect(weeks[0].workouts).toBe(2);
    expect(weeks[0].totalElevationGain).toBe(40);
  });

  // Regression test for the weekly distance drift incident: totals must come
  // from raw meters converted once. Summing per-row display values (rounded
  // to one decimal) accumulates error; with the distances below the wrong
  // implementation loses 0.4 km and 0.4 mi. Clean multiples of 100 m cannot
  // distinguish the two implementations; messy distances can.
  it('weekly totals are immune to per-row display rounding accumulation', () => {
    const distances = [13425, 11325, 5543, 36436, 7944, 10025, 3444, 9225, 10533, 8725, 17745, 13425];
    const rows = distances.map((distance_m, i) =>
      workout({
        workout_id: i + 1,
        distance_m,
        start_ts: Date.parse('2026-07-14T09:00:00Z') / 1000 + i * 3600,
      })
    );
    const weeks = buildWeeklySummary(rows, 'metric', 'UTC');
    // 147795 m exactly; per-row rounding would report 147.4
    expect(weeks[0].totalDistance).toBe(147.8);

    const imperial = buildWeeklySummary(rows, 'imperial', 'UTC');
    // 91.835 mi exactly; per-row rounding would report 91.4
    expect(imperial[0].totalDistance).toBe(91.8);
  });
});
