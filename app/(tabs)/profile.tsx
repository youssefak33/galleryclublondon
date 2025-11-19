import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import Screen from '@/components/Screen';
import Card from '@/components/Card';
import AppButton from '@/components/AppButton';
import { useUserStore } from '@/store/userStore';
import { useAuthStore } from '@/store/authStore';
import { COLORS, FONTS, SIZES } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const router = useRouter();
  const { profile } = useUserStore();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  if (!profile) {
    return (
      <Screen style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: COLORS.textPrimary }}>Loading profile...</Text>
      </Screen>
    );
  }

  const getMembershipColor = (membership: string) => {
    if (membership === 'Gold') return COLORS.accent;
    if (membership === 'Silver') return '#C0C0C0';
    return '#CD7F32'; // Bronze
  };

  return (
    <Screen scrollable>
      <View style={styles.header}>
        <Image source={{ uri: profile.avatar }} style={styles.avatar} />
        <Text style={styles.name}>{profile.name}</Text>
        <Text style={styles.email}>{profile.email}</Text>
        <AppButton title="Logout" onPress={handleLogout} variant="secondary" />
      </View>

      <Card style={styles.membershipCard}>
        <View style={styles.membershipHeader}>
          <Text style={styles.membershipTitle}>Membership Status</Text>
          <Ionicons name="shield-checkmark" size={24} color={getMembershipColor(profile.membership)} />
        </View>
        <Text style={[styles.membership, { color: getMembershipColor(profile.membership) }]}>
          {profile.membership}
        </Text>
      </Card>

      <Card>
        <Text style={styles.cardTitle}>My Stats</Text>
        <View style={styles.statsRow}>
          <Text style={styles.statsLabel}>Points</Text>
          <Text style={styles.statsValue}>{profile.points}</Text>
        </View>
        <View style={styles.statsRow}>
          <Text style={styles.statsLabel}>Music Tastes</Text>
          <Text style={styles.statsValue}>{profile.musicTastes.join(', ')}</Text>
        </View>
      </Card>
      
      <Card>
        <Text style={styles.cardTitle}>Gamification</Text>
        <Text style={styles.comingSoon}>Challenges and rewards coming soon!</Text>
      </Card>

    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginBottom: SIZES.padding,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: SIZES.base * 2,
  },
  name: {
    ...FONTS.h2,
    color: COLORS.textPrimary,
    fontWeight: 'bold',
  },
  email: {
    ...FONTS.body4,
    color: COLORS.textSecondary,
    marginBottom: SIZES.base * 2,
  },
  membershipCard: {
    backgroundColor: COLORS.surfaceHighlight,
  },
  membershipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  membershipTitle: {
    ...FONTS.h4,
    color: COLORS.textPrimary,
    fontWeight: 'bold',
  },
  membership: {
    ...FONTS.h1,
    fontWeight: 'bold',
    marginTop: SIZES.base,
  },
  cardTitle: {
    ...FONTS.h4,
    color: COLORS.textPrimary,
    fontWeight: 'bold',
    marginBottom: SIZES.base,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SIZES.base,
  },
  statsLabel: {
    ...FONTS.body3,
    color: COLORS.textSecondary,
  },
  statsValue: {
    ...FONTS.body3,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  comingSoon: {
    ...FONTS.body4,
    color: COLORS.textDisabled,
    textAlign: 'center',
    padding: SIZES.padding,
  }
});
