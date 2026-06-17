// Description: Icon badge for an activity type name from the BFF contract.
// Description: Unknown types get a neutral glyph; the app never crashes on new types.

import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '../theme';

const ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  run: 'fitness',
  ride: 'bicycle',
  swim: 'water',
  hike: 'trail-sign',
  walk: 'footsteps',
};

export default function ActivityTypeIcon({ type, size = 20 }: { type: string; size?: number }) {
  return (
    <View style={[styles.badge, { width: size * 2, height: size * 2, borderRadius: size }]}>
      <Ionicons name={ICONS[type] ?? 'ellipse-outline'} size={size} color={colors.accent} />
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
