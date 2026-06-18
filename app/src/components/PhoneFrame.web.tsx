// Description: Web-only phone frame: renders the app inside a fixed 390x844 device viewport.
// Description: This is the workshop's phone simulation; the browser tab reads as a phone, not a desktop page.

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';

const SCREEN_WIDTH = 390;
const SCREEN_HEIGHT = 844;

export default function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.desk}>
      <View style={styles.bezel}>
        <View style={styles.screen}>{children}</View>
      </View>
      <Text style={styles.caption}>
        Stride web preview - phone viewport {SCREEN_WIDTH} x {SCREEN_HEIGHT}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  desk: {
    flex: 1,
    minHeight: '100vh' as unknown as number,
    backgroundColor: '#20242b',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  bezel: {
    padding: 12,
    borderRadius: 48,
    backgroundColor: '#0b0d10',
    shadowColor: '#000000',
    shadowOpacity: 0.5,
    shadowRadius: 40,
    shadowOffset: { width: 0, height: 20 },
  },
  screen: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    borderRadius: 36,
    overflow: 'hidden',
    backgroundColor: colors.background,
  },
  caption: {
    marginTop: 16,
    color: '#8b929e',
    fontSize: 12,
  },
});
