// Description: User preferences: display units and the active profile.
// Description: Writes to SettingsContext; every data screen refetches from the BFF with the new values.

import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Units, User, api } from '../api/client';
import { useSettings } from '../state/SettingsContext';
import { colors, spacing } from '../theme';

const UNIT_OPTIONS: { value: Units; label: string; detail: string }[] = [
  { value: 'metric', label: 'Metric', detail: 'kilometers, meters' },
  { value: 'imperial', label: 'Imperial', detail: 'miles, feet' },
];

export default function SettingsScreen() {
  const { units, setUnits, userId, setUserId } = useSettings();
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    api
      .users()
      .then(setUsers)
      .catch((err) => {
        console.error('failed to load profiles:', err);
        setUsers([]);
      });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Display units</Text>
      <View style={styles.card}>
        {UNIT_OPTIONS.map((option, index) => (
          <Pressable
            key={option.value}
            style={[styles.option, index > 0 && styles.optionBorder]}
            onPress={() => setUnits(option.value)}
          >
            <View>
              <Text style={styles.optionLabel}>{option.label}</Text>
              <Text style={styles.optionDetail}>{option.detail}</Text>
            </View>
            <View style={[styles.radio, units === option.value && styles.radioActive]}>
              {units === option.value && <View style={styles.radioDot} />}
            </View>
          </Pressable>
        ))}
      </View>

      <Text style={[styles.sectionTitle, styles.sectionSpacing]}>Profile</Text>
      <View style={styles.card}>
        {users.map((user, index) => (
          <Pressable
            key={user.id}
            style={[styles.option, index > 0 && styles.optionBorder]}
            onPress={() => setUserId(user.id)}
          >
            <View>
              <Text style={styles.optionLabel}>{user.name}</Text>
              <Text style={styles.optionDetail}>{user.homeTimezone}</Text>
            </View>
            <View style={[styles.radio, userId === user.id && styles.radioActive]}>
              {userId === user.id && <View style={styles.radioDot} />}
            </View>
          </Pressable>
        ))}
      </View>

      <Text style={styles.note}>
        Distances and elevation everywhere in the app follow the units
        preference. The profile selects whose activities the app shows.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMuted,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
  },
  sectionSpacing: {
    marginTop: spacing.lg,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  optionBorder: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  optionDetail: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: {
    borderColor: colors.accent,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.accent,
  },
  note: {
    marginTop: spacing.md,
    fontSize: 13,
    color: colors.textMuted,
  },
});
