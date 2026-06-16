// Description: Time translation between the API's epoch-second UTC timestamps and the app contract.
// Description: Also owns local-calendar bucketing: which day and week an instant belongs to in a timezone.

export function epochToIso(epochSeconds: number): string {
  return new Date(epochSeconds * 1000).toISOString();
}

// The local calendar date (YYYY-MM-DD) of an instant in a timezone. en-CA
// gives ISO-ordered date parts.
export function localDateKey(epochSeconds: number, timeZone: string): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(epochSeconds * 1000));
}

// The Monday (YYYY-MM-DD) starting the week that contains this instant, in
// the given timezone. Weeks run Monday through Sunday.
export function weekStartKey(epochSeconds: number, timeZone: string): string {
  const dateKey = localDateKey(epochSeconds, timeZone);
  const date = new Date(dateKey + 'T00:00:00Z');
  const daysSinceMonday = (date.getUTCDay() + 6) % 7;
  date.setUTCDate(date.getUTCDate() - daysSinceMonday);
  return date.toISOString().slice(0, 10);
}

export function addDays(dateKey: string, days: number): string {
  const date = new Date(dateKey + 'T00:00:00Z');
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

// Human label for a week: "Jul 27 - Aug 2". Pure calendar math on date keys,
// so it is identical in every viewer timezone.
export function weekLabel(weekStart: string): string {
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone: 'UTC',
    month: 'short',
    day: 'numeric',
  });
  const start = new Date(weekStart + 'T00:00:00Z');
  const end = new Date(addDays(weekStart, 6) + 'T00:00:00Z');
  return `${fmt.format(start)} - ${fmt.format(end)}`;
}

export function parseTimeZone(raw: unknown): string {
  if (typeof raw === 'string' && raw.length > 0) {
    try {
      new Intl.DateTimeFormat('en-US', { timeZone: raw });
      return raw;
    } catch {
      // fall through to UTC on an invalid zone rather than failing the request
    }
  }
  return 'UTC';
}
