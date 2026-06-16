// Description: Unit tests for the legacy-row to Activity/User field mapping.
// Description: Asserts the app contract shape: camelCase, ISO time, named enums, display units.

import { describe, expect, it } from 'vitest';
import { LegacyUserRow, LegacyWorkoutRow, toActivity, toUser } from './casing.js';

const row: LegacyWorkoutRow = {
  workout_id: 1042,
  user_id: 1,
  activity_type: 1,
  start_ts: Date.parse('2026-07-14T11:30:00Z') / 1000,
  duration_s: 1712,
  distance_m: 5240,
  elevation_gain_m: 42,
  status: 2,
};

describe('toActivity', () => {
  it('maps every legacy field to the app contract', () => {
    expect(toActivity(row, 'metric')).toEqual({
      id: 1042,
      userId: 1,
      type: 'run',
      status: 'synced',
      startTime: '2026-07-14T11:30:00.000Z',
      durationSeconds: 1712,
      distance: 5.2,
      distanceUnit: 'km',
      elevationGain: 42,
      elevationUnit: 'm',
    });
  });

  it('applies imperial display units when asked', () => {
    const activity = toActivity(row, 'imperial');
    expect(activity.distance).toBe(3.3);
    expect(activity.distanceUnit).toBe('mi');
    expect(activity.elevationGain).toBe(138);
    expect(activity.elevationUnit).toBe('ft');
  });

  it('treats null elevation as zero', () => {
    const activity = toActivity({ ...row, elevation_gain_m: null }, 'metric');
    expect(activity.elevationGain).toBe(0);
  });

  it('never leaks snake_case keys into the contract', () => {
    for (const key of Object.keys(toActivity(row, 'metric'))) {
      expect(key).not.toContain('_');
    }
  });
});

describe('toUser', () => {
  it('maps the legacy user row', () => {
    const userRow: LegacyUserRow = {
      user_id: 2,
      display_name: 'Priya Shah',
      home_tz: 'Europe/London',
      unit_pref: 1,
      created_ts: 1738368000,
    };
    expect(toUser(userRow)).toEqual({
      id: 2,
      name: 'Priya Shah',
      homeTimezone: 'Europe/London',
    });
  });
});
