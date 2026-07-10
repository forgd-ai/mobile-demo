// Description: About the app: version, stack shape, and where the data comes from.
// Description: Static content only; the version comes from the Expo config.

import Constants from 'expo-constants';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '../theme';

export default function AboutScreen() {
  const version = Constants.expoConfig?.version ?? 'unknown';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <Text style={styles.appName}>Stride</Text>
        <Text style={styles.version}>Version {version}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.heading}>How this app is built</Text>
        <Text style={styles.body}>
          Stride is a three-layer stack. A legacy backend API owns the raw
          workout records. A BFF translates them into the shape this app
          renders: display units, local-friendly timestamps, named activity
          types, and weekly totals. The app talks only to the BFF.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.heading}>Where the data comes from</Text>
        <Text style={styles.body}>
          All workouts are fixture data committed to the repository. There are
          no accounts and no external services; the same data loads on every
          machine.
        </Text>
      </View>
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
    gap: spacing.md,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  appName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  version: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 2,
  },
  heading: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  body: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textMuted,
  },
});
