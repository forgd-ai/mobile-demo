// Description: Unit tests for the distance and elevation display conversions.
// Description: Covers both unit systems, rounding behavior, and the query parser.

import { describe, expect, it } from 'vitest';
import {
  FEET_PER_METER,
  METERS_PER_MILE,
  distanceUnit,
  elevationUnit,
  parseUnits,
  round1,
  toDisplayDistance,
  toDisplayElevation,
} from './units.js';

describe('round1', () => {
  it('rounds to one decimal', () => {
    expect(round1(5.24)).toBe(5.2);
    expect(round1(5.25)).toBe(5.3);
    expect(round1(5.0)).toBe(5.0);
  });
});

describe('toDisplayDistance', () => {
  it('converts meters to km rounded to one decimal', () => {
    expect(toDisplayDistance(5240, 'metric')).toBe(5.2);
    expect(toDisplayDistance(10000, 'metric')).toBe(10.0);
  });

  it('converts meters to miles rounded to one decimal', () => {
    expect(toDisplayDistance(5240, 'imperial')).toBe(3.3);
    expect(toDisplayDistance(METERS_PER_MILE * 4, 'imperial')).toBe(4.0);
  });
});

describe('toDisplayElevation', () => {
  it('keeps whole meters in metric', () => {
    expect(toDisplayElevation(42, 'metric')).toBe(42);
  });

  it('converts to whole feet in imperial', () => {
    expect(toDisplayElevation(42, 'imperial')).toBe(Math.round(42 * FEET_PER_METER));
    expect(toDisplayElevation(42, 'imperial')).toBe(138);
  });
});

describe('unit labels and parsing', () => {
  it('labels follow the unit system', () => {
    expect(distanceUnit('metric')).toBe('km');
    expect(distanceUnit('imperial')).toBe('mi');
    expect(elevationUnit('metric')).toBe('m');
    expect(elevationUnit('imperial')).toBe('ft');
  });

  it('parseUnits defaults to metric for anything but imperial', () => {
    expect(parseUnits('imperial')).toBe('imperial');
    expect(parseUnits('metric')).toBe('metric');
    expect(parseUnits(undefined)).toBe('metric');
    expect(parseUnits('nautical')).toBe('metric');
  });
});
