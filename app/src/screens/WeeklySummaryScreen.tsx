// Description: Weekly training summary: one card per week, totals computed by the BFF.
// Description: The headline number is total distance; this screen renders it verbatim.

import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { DEFAULT_USER_ID, WeeklySummary, api, deviceTimeZone } from '../api/client';
import { capitalize, formatDistance, formatDuration, formatElevation } from '../format';
import { useSettings } from '../state/SettingsContext';
import { colors, spacing } from '../theme';

export default function WeeklySummaryScreen() {
  const { units } = useSettings();
  const [weeks, setWeeks] = useState<WeeklySummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setWeeks(null);
    setError(null);
    try {
      setWeeks(await api.weeklySummary(DEFAULT_USER_ID, units, deviceTimeZone()));
    } catch (err) {
      setError(String(err));
    }
  }, [units]);

  useEffect(() => {
    load();
  }, []);

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Could not load the summary.</Text>
        <Text style={styles.errorDetail}>{error}</Text>
        <Pressable style={styles.retry} onPress={load}>
          <Text style={styles.retryText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  if (!weeks) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  return (
    <FlatList
      style={styles.list}
      contentContainerStyle={styles.listContent}
      data={weeks}
      keyExtractor={(week) => week.weekStart}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{item.label}</Text>
            <Text style={styles.cardWorkouts}>
              {item.workouts} workout{item.workouts === 1 ? '' : 's'}
            </Text>
          </View>
          <Text style={styles.headline}>
            {formatDistance(item.totalDistance, item.distanceUnit)}
          </Text>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>Time</Text>
              <Text style={styles.statValue}>{formatDuration(item.totalDurationSeconds)}</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>Elevation</Text>
              <Text style={styles.statValue}>
                {formatElevation(item.totalElevationGain, item.elevationUnit)}
              </Text>
            </View>
          </View>
          <View style={styles.typeRow}>
            {Object.entries(item.byType).map(([type, count]) => (
              <View key={type} style={styles.typeChip}>
                <Text style={styles.typeChipText}>
                  {capitalize(type)} x {count}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    padding: spacing.md,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    backgroundColor: colors.background,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textMuted,
  },
  cardWorkouts: {
    fontSize: 13,
    color: colors.textMuted,
  },
  headline: {
    fontSize: 34,
    fontWeight: '700',
    color: colors.text,
    marginVertical: spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  stat: {},
  statLabel: {
    fontSize: 12,
    color: colors.textMuted,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginTop: 2,
  },
  typeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  typeChip: {
    backgroundColor: colors.accentSoft,
    borderRadius: 8,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  typeChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.accent,
  },
  errorText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  errorDetail: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  retry: {
    marginTop: spacing.md,
    backgroundColor: colors.accent,
    borderRadius: 8,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  retryText: {
    color: colors.card,
    fontWeight: '600',
  },
});
