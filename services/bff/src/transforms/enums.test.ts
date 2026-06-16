// Description: Unit tests for the numeric-code to named-value enum mappings.
// Description: The fallback paths are load-bearing; the legacy data contains stray codes.

import { describe, expect, it } from 'vitest';
import { activityTypeName, statusName } from './enums.js';

describe('activityTypeName', () => {
  it('maps the known legacy codes', () => {
    expect(activityTypeName(1)).toBe('run');
    expect(activityTypeName(2)).toBe('ride');
    expect(activityTypeName(3)).toBe('swim');
    expect(activityTypeName(4)).toBe('hike');
    expect(activityTypeName(5)).toBe('walk');
  });

  it('degrades stray codes to other instead of crashing', () => {
    expect(activityTypeName(9)).toBe('other');
    expect(activityTypeName(0)).toBe('other');
  });
});

describe('statusName', () => {
  it('maps the known status codes', () => {
    expect(statusName(0)).toBe('pending');
    expect(statusName(1)).toBe('processing');
    expect(statusName(2)).toBe('synced');
    expect(statusName(3)).toBe('flagged');
  });

  it('degrades unknown codes to unknown', () => {
    expect(statusName(7)).toBe('unknown');
  });
});
