// Description: Unit conversion between the API's metric storage and the app's display units.
// Description: The API stores meters; the app renders km/mi and m/ft depending on the user preference.

export type Units = 'metric' | 'imperial';

export const METERS_PER_MILE = 1609.344;
export const FEET_PER_METER = 3.28084;

export function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

// Per-row display value: km or miles, rounded to one decimal for rendering.
export function toDisplayDistance(meters: number, units: Units): number {
  return round1(units === 'imperial' ? meters / METERS_PER_MILE : meters / 1000);
}

export function distanceUnit(units: Units): string {
  return units === 'imperial' ? 'mi' : 'km';
}

// Elevation renders as whole meters or feet.
export function toDisplayElevation(meters: number, units: Units): number {
  return Math.round(units === 'imperial' ? meters * FEET_PER_METER : meters);
}

export function elevationUnit(units: Units): string {
  return units === 'imperial' ? 'ft' : 'm';
}

export function parseUnits(raw: unknown): Units {
  return raw === 'imperial' ? 'imperial' : 'metric';
}
