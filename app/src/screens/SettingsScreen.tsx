// Description: User preferences: display units.
// Description: Writes to SettingsContext; every data screen refetches from the BFF with the new value.

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Units } from '../api/client';
import { useSettings } from '../state/SettingsContext';
import { colors, spacing } from '../theme';

const UNIT_OPTIONS: { value: Units; label: string; detail: string }[] = [
  { value: 'metric', label: 'Metric', detail: 'kilometers, meters' },
  { value: 'imperial', label: 'Imperial', detail: 'miles, feet' },
];

export default function SettingsScreen() {
  const { units, setUnits } = useSettings();

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
      <Text style={styles.note}>
        Distances and elevation everywhere in the app follow this preference.
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
