// Description: The main feed: every activity for the current user, grouped by local day.
// Description: Values arrive display-ready from the BFF; this screen only assembles strings.

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  SectionList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Activity, DEFAULT_USER_ID, api } from '../api/client';
import ActivityTypeIcon from '../components/ActivityTypeIcon';
import { capitalize, formatDay, formatDistance, formatDuration, formatTime, localDayKey } from '../format';
import { useSettings } from '../state/SettingsContext';
import { colors, spacing } from '../theme';
import { ActivitiesStackParamList } from '../navigation';

interface DaySection {
  title: string;
  data: Activity[];
}

function groupByDay(activities: Activity[]): DaySection[] {
  const sections: DaySection[] = [];
  let currentKey = '';
  for (const activity of activities) {
    const key = localDayKey(activity.startTime);
    if (key !== currentKey) {
      sections.push({ title: formatDay(activity.startTime), data: [] });
      currentKey = key;
    }
    sections[sections.length - 1].data.push(activity);
  }
  return sections;
}

export default function ActivityListScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<ActivitiesStackParamList, 'ActivityList'>>();
  const { units } = useSettings();
  const [sections, setSections] = useState<DaySection[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setSections(null);
    setError(null);
    try {
      const activities = await api.activities(DEFAULT_USER_ID, units);
      setSections(groupByDay(activities));
    } catch (err) {
      setError(String(err));
    }
  }, [units]);

  useEffect(() => {
    load();
  }, [load]);

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Could not load activities.</Text>
        <Text style={styles.errorDetail}>{error}</Text>
        <Pressable style={styles.retry} onPress={load}>
          <Text style={styles.retryText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  if (!sections) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  return (
    <SectionList
      style={styles.list}
      sections={sections}
      keyExtractor={(item) => String(item.id)}
      renderSectionHeader={({ section }) => (
        <Text style={styles.dayHeader}>{section.title}</Text>
      )}
      renderItem={({ item }) => (
        <Pressable
          style={styles.row}
          onPress={() => navigation.navigate('ActivityDetail', { id: item.id })}
        >
          <ActivityTypeIcon type={item.type} />
          <View style={styles.rowBody}>
            <Text style={styles.rowTitle}>{capitalize(item.type)}</Text>
            <Text style={styles.rowSub}>{formatTime(item.startTime)}</Text>
          </View>
          <View style={styles.rowStats}>
            <Text style={styles.rowDistance}>
              {formatDistance(item.distance, item.distanceUnit)}
            </Text>
            <Text style={styles.rowSub}>{formatDuration(item.durationSeconds)}</Text>
          </View>
          {item.status !== 'synced' && (
            <View style={styles.statusPill}>
              <Text style={styles.statusText}>{item.status}</Text>
            </View>
          )}
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    backgroundColor: colors.background,
  },
  dayHeader: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.xs,
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMuted,
    backgroundColor: colors.background,
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    marginHorizontal: spacing.md,
    marginVertical: spacing.xs,
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md,
  },
  rowBody: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  rowSub: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
  rowStats: {
    alignItems: 'flex-end',
  },
  rowDistance: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  statusPill: {
    backgroundColor: colors.warnSoft,
    borderRadius: 8,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  statusText: {
    color: colors.warn,
    fontSize: 12,
    fontWeight: '600',
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
