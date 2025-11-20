import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Screen from '@/components/Screen';
import AppButton from '@/components/AppButton';
import { COLORS, FONTS, SIZES } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';

export default function ScanScreen() {
  return (
    <Screen style={styles.container}>
      <Text style={styles.title}>Scan Member QR Code</Text>
      <View style={styles.scannerArea}>
        <Ionicons name="scan-outline" size={150} color={COLORS.textDisabled} />
        <Text style={styles.placeholderText}>Camera view will appear here</Text>
      </View>
      <AppButton
        title="Activate Scanner"
        onPress={() => alert('Scanner not implemented yet.')}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  title: {
    ...FONTS.h1,
    color: COLORS.textPrimary,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  scannerArea: {
    width: '80%',
    aspectRatio: 1,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.surfaceHighlight,
    borderStyle: 'dashed',
  },
  placeholderText: {
    ...FONTS.body3,
    color: COLORS.textDisabled,
    marginTop: SIZES.base,
  },
});
