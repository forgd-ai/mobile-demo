// Description: One week of training totals, rendered as a card.
// Description: Values come from the BFF weekly summary verbatim; formatting only.

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { WeeklySummary } from '../api/client';
import { capitalize, formatDistance, formatDuration, formatElevation } from '../format';
import { colors, spacing } from '../theme';

export default function SummaryCard({ week }: { week: WeeklySummary }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{week.label}</Text>
        <Text style={styles.cardWorkouts}>
          {week.workouts} workout{week.workouts === 1 ? '' : 's'}
        </Text>
      </View>
      <Text style={styles.headline}>
        {formatDistance(week.totalDistance, week.distanceUnit)}
      </Text>
      <View style={styles.statsRow}>
        <View>
          <Text style={styles.statLabel}>Time</Text>
          <Text style={styles.statValue}>{formatDuration(week.totalDurationSeconds)}</Text>
        </View>
        <View>
          <Text style={styles.statLabel}>Elevation</Text>
          <Text style={styles.statValue}>
            {formatElevation(week.totalElevationGain, week.elevationUnit)}
          </Text>
        </View>
      </View>
      <View style={styles.typeRow}>
        {Object.entries(week.byType).map(([type, count]) => (
          <View key={type} style={styles.typeChip}>
            <Text style={styles.typeChipText}>
              {capitalize(type)} x {count}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
});
