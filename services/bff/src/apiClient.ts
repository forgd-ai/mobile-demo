// Description: The BFF's only client for the legacy API; unwraps the legacy response envelope.
// Description: Everything downstream of this module works with bare rows, never the envelope.

import { LegacyUserRow, LegacyWorkoutRow } from './transforms/casing.js';

const API_URL = process.env.API_URL ?? 'http://localhost:4000';

export class UpstreamError extends Error {
  constructor(message: string, public readonly status?: number) {
    super(message);
    this.name = 'UpstreamError';
  }
}

interface LegacyEnvelope<T> {
  result: T;
  count?: number;
}

async function get<T>(path: string): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`);
  } catch (err) {
    throw new UpstreamError(`legacy api unreachable at ${API_URL}: ${String(err)}`);
  }
  if (!response.ok) {
    const body = await response.text();
    throw new UpstreamError(`legacy api returned ${response.status}: ${body}`, response.status);
  }
  const envelope = (await response.json()) as LegacyEnvelope<T>;
  return envelope.result;
}

export interface WorkoutQuery {
  userId?: number;
  fromTs?: number;
  toTs?: number;
}

export async function fetchWorkouts(query: WorkoutQuery = {}): Promise<LegacyWorkoutRow[]> {
  const params = new URLSearchParams();
  if (query.userId !== undefined) params.set('user_id', String(query.userId));
  if (query.fromTs !== undefined) params.set('from_ts', String(query.fromTs));
  if (query.toTs !== undefined) params.set('to_ts', String(query.toTs));
  const qs = params.toString();
  return get<LegacyWorkoutRow[]>(`/v1/workouts${qs ? `?${qs}` : ''}`);
}

export async function fetchWorkout(id: number): Promise<LegacyWorkoutRow | null> {
  try {
    return await get<LegacyWorkoutRow>(`/v1/workouts/${id}`);
  } catch (err) {
    if (err instanceof UpstreamError && err.status === 404) return null;
    throw err;
  }
}

export async function fetchUsers(): Promise<LegacyUserRow[]> {
  return get<LegacyUserRow[]>('/v1/users');
}
