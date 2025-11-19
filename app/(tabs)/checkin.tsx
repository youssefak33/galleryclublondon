import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Screen from '@/components/Screen';
import Card from '@/components/Card';
import QRCode from 'react-native-qrcode-svg';
import { useUserStore } from '@/store/userStore';
import { COLORS, FONTS, SIZES } from '@/constants/theme';

export default function CheckinScreen() {
  const { profile } = useUserStore();

  // QR code data could be a stringified JSON with user ID, membership, etc.
  const qrCodeData = JSON.stringify({
    userId: profile?.id,
    name: profile?.name,
    membership: profile?.membership,
    timestamp: new Date().toISOString(),
  });

  return (
    <Screen style={styles.container}>
      <Text style={styles.title}>Your Pass</Text>
      <Text style={styles.subtitle}>Show this QR code for entry or to redeem perks.</Text>
      
      {profile ? (
        <Card style={styles.qrCard}>
          <View style={styles.qrCodeContainer}>
            <QRCode
              value={qrCodeData}
              size={250}
              backgroundColor={COLORS.surface}
              color={COLORS.textPrimary}
            />
          </View>
          <Text style={styles.profileName}>{profile.name}</Text>
          <Text style={styles.profileMembership}>{profile.membership} Member</Text>
        </Card>
      ) : (
        <Text style={{ color: COLORS.textPrimary }}>Loading...</Text>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  title: {
    ...FONTS.h1,
    color: COLORS.textPrimary,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    ...FONTS.body4,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SIZES.padding * 2,
  },
  qrCard: {
    alignItems: 'center',
    padding: SIZES.padding,
  },
  qrCodeContainer: {
    padding: SIZES.base * 2,
    backgroundColor: COLORS.surface, // Same as QR background for seamless look
    borderRadius: SIZES.radius,
    marginBottom: SIZES.padding,
  },
  profileName: {
    ...FONTS.h3,
    color: COLORS.textPrimary,
    fontWeight: 'bold',
  },
  profileMembership: {
    ...FONTS.body3,
    color: COLORS.accent,
  },
});
