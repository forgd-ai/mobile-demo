// Description: The single place display strings are assembled from BFF values.
// Description: Screens never format values themselves; they call these helpers.

export function formatDistance(value: number, unit: string): string {
  return `${value.toFixed(1)} ${unit}`;
}

export function formatElevation(value: number, unit: string): string {
  return `${value} ${unit}`;
}

export function formatDuration(totalSeconds: number): string {
  const minutes = Math.round(totalSeconds / 60);
  return `${minutes}m`;
}

// "7:15 AM" in the device timezone.
export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
}

// "Tue, Jul 28" in the device timezone.
export function formatDay(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

// Stable YYYY-MM-DD key for grouping rows by local calendar day.
export function localDayKey(iso: string): string {
  return new Date(iso).toLocaleDateString('en-CA');
}

export function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1);
}
