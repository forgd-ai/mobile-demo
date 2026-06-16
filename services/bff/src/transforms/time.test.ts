// Description: Unit tests for time translation: ISO conversion and local day/week bucketing.
// Description: The timezone cases pin behavior at UTC day boundaries, where bucketing bugs live.

import { describe, expect, it } from 'vitest';
import {
  addDays,
  epochToIso,
  localDateKey,
  parseTimeZone,
  weekLabel,
  weekStartKey,
} from './time.js';

function epoch(iso: string): number {
  return Date.parse(iso) / 1000;
}

describe('epochToIso', () => {
  it('converts epoch seconds to an ISO UTC string', () => {
    expect(epochToIso(epoch('2026-07-27T11:30:00Z'))).toBe('2026-07-27T11:30:00.000Z');
  });
});

describe('localDateKey', () => {
  it('uses the calendar date of the target timezone, not the server', () => {
    const lateEvening = epoch('2026-07-22T02:15:00Z');
    expect(localDateKey(lateEvening, 'UTC')).toBe('2026-07-22');
    expect(localDateKey(lateEvening, 'America/New_York')).toBe('2026-07-21');
    expect(localDateKey(lateEvening, 'Asia/Tokyo')).toBe('2026-07-22');
  });
});

describe('weekStartKey', () => {
  it('returns the Monday of the containing week', () => {
    expect(weekStartKey(epoch('2026-07-22T12:00:00Z'), 'UTC')).toBe('2026-07-20');
    expect(weekStartKey(epoch('2026-07-20T00:00:00Z'), 'UTC')).toBe('2026-07-20');
    expect(weekStartKey(epoch('2026-07-26T23:59:00Z'), 'UTC')).toBe('2026-07-20');
  });

});

describe('calendar helpers', () => {
  it('addDays does pure date-key arithmetic', () => {
    expect(addDays('2026-07-27', 6)).toBe('2026-08-02');
    expect(addDays('2026-07-31', 1)).toBe('2026-08-01');
  });

  it('weekLabel renders a Monday-Sunday range', () => {
    expect(weekLabel('2026-07-27')).toBe('Jul 27 - Aug 2');
    expect(weekLabel('2026-07-20')).toBe('Jul 20 - Jul 26');
  });
});

describe('parseTimeZone', () => {
  it('accepts valid IANA zones and falls back to UTC otherwise', () => {
    expect(parseTimeZone('America/New_York')).toBe('America/New_York');
    expect(parseTimeZone('Not/AZone')).toBe('UTC');
    expect(parseTimeZone(undefined)).toBe('UTC');
  });
});
