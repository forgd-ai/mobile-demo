// Description: Maps the API's numeric enum codes to the named values the app renders.
// Description: Unknown codes degrade to explicit fallbacks; they must never crash a screen.

const ACTIVITY_TYPE_NAMES: Record<number, string> = {
  1: 'run',
  2: 'ride',
  3: 'swim',
  4: 'hike',
  5: 'walk',
};

// The legacy database contains stray codes from a retired import job, so the
// fallback is a real code path, not dead code.
export function activityTypeName(code: number): string {
  return ACTIVITY_TYPE_NAMES[code] ?? 'other';
}

const STATUS_NAMES: Record<number, string> = {
  0: 'pending',
  1: 'processing',
  2: 'synced',
  3: 'flagged',
};

export function statusName(code: number): string {
  return STATUS_NAMES[code] ?? 'unknown';
}
