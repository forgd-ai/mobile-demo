// Description: The app's only data entry point; every request goes to the BFF.
// Description: The app never calls the legacy API directly; the BFF owns that contract.

const BFF_URL = process.env.EXPO_PUBLIC_BFF_URL ?? 'http://localhost:4100';

export const DEFAULT_USER_ID = 1;

export type Units = 'metric' | 'imperial';

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

async function get<T>(path: string): Promise<T> {
  const response = await fetch(`${BFF_URL}${path}`);
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`bff request failed (${response.status}): ${body}`);
  }
  return (await response.json()) as T;
}

export function deviceTimeZone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone ?? 'UTC';
}

export const api = {
  async activities(userId: number, units: Units): Promise<Activity[]> {
    const data = await get<{ activities: Activity[] }>(
      `/api/activities?userId=${userId}&units=${units}`
    );
    return data.activities;
  },

  async activity(id: number, units: Units): Promise<Activity> {
    const data = await get<{ activity: Activity }>(`/api/activities/${id}?units=${units}`);
    return data.activity;
  },
};
