// Description: Full record for a single activity, fetched by id from the BFF.
// Description: Everything shown here is the BFF contract verbatim; formatting only.

import { RouteProp, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Activity, api } from '../api/client';
import ActivityTypeIcon from '../components/ActivityTypeIcon';
import {
  capitalize,
  formatDay,
  formatDistance,
  formatDuration,
  formatElevation,
  formatTime,
} from '../format';
import { useSettings } from '../state/SettingsContext';
import { colors, spacing } from '../theme';
import { ActivitiesStackParamList } from '../navigation';

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

export default function ActivityDetailScreen() {
  const route = useRoute<RouteProp<ActivitiesStackParamList, 'ActivityDetail'>>();
  const { units } = useSettings();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    api
      .activity(route.params.id, units)
      .then((result) => {
        if (!cancelled) setActivity(result);
      })
      .catch((err) => {
        if (!cancelled) setError(String(err));
      });
    return () => {
      cancelled = true;
    };
  }, [route.params.id, units]);

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Could not load this activity.</Text>
        <Text style={styles.errorDetail}>{error}</Text>
      </View>
    );
  }

  if (!activity) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <ActivityTypeIcon type={activity.type} size={28} />
        <View>
          <Text style={styles.title}>{capitalize(activity.type)}</Text>
          <Text style={styles.subtitle}>
            {formatDay(activity.startTime)} at {formatTime(activity.startTime)}
          </Text>
        </View>
      </View>

      <View style={styles.card}>
        <DetailRow
          label="Distance"
          value={formatDistance(activity.distance, activity.distanceUnit)}
        />
        <DetailRow label="Duration" value={formatDuration(activity.durationSeconds)} />
        <DetailRow
          label="Elevation gain"
          value={formatElevation(activity.elevationGain, activity.elevationUnit)}
        />
        <DetailRow label="Status" value={capitalize(activity.status)} />
      </View>

      <Text style={styles.recordId}>Record #{activity.id}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.md,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 2,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  detailLabel: {
    fontSize: 15,
    color: colors.textMuted,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  recordId: {
    marginTop: spacing.md,
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
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
});
