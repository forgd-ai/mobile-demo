// Description: Weekly training summary: one card per week, totals computed by the BFF.
// Description: The headline number is total distance; this screen renders it verbatim.

import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { WeeklySummary, api, deviceTimeZone } from '../api/client';
import SummaryCard from '../components/SummaryCard';
import { useSettings } from '../state/SettingsContext';
import { colors, spacing } from '../theme';

export default function WeeklySummaryScreen() {
  const { units, userId } = useSettings();
  const [weeks, setWeeks] = useState<WeeklySummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setWeeks(null);
    setError(null);
    try {
      setWeeks(await api.weeklySummary(userId, units, deviceTimeZone()));
    } catch (err) {
      setError(String(err));
    }
  }, [units, userId]);

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
      renderItem={({ item }) => <SummaryCard week={item} />}
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
