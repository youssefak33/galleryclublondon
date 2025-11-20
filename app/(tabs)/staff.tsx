import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Screen from '@/components/Screen';
import Card from '@/components/Card';
import AppButton from '@/components/AppButton';
import { COLORS, FONTS, SIZES } from '@/constants/theme';
import { useAuthStore } from '@/store/authStore';

export default function StaffProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  if (!user || user.role !== 'staff') {
    return (
      <Screen style={styles.centered}>
        <Text style={styles.restrictedText}>Staff access only.</Text>
      </Screen>
    );
  }

  return (
    <Screen>
      <Text style={styles.title}>Staff Profile</Text>
      <Card style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Name</Text>
          <Text style={styles.value}>{user.name}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{user.email}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Role</Text>
          <Text style={styles.value}>Staff</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Membership</Text>
          <Text style={styles.value}>{user.membership}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Points</Text>
          <Text style={styles.value}>{user.points}</Text>
        </View>
      </Card>
      <AppButton title="Log out" onPress={handleLogout} variant="secondary" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    ...FONTS.h1,
    color: COLORS.textPrimary,
    fontWeight: 'bold',
    marginBottom: SIZES.padding,
  },
  card: {
    padding: SIZES.padding,
    marginBottom: SIZES.padding,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.base,
  },
  label: {
    ...FONTS.body4,
    color: COLORS.textSecondary,
  },
  value: {
    ...FONTS.body4,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  restrictedText: {
    ...FONTS.body3,
    color: COLORS.textSecondary,
  },
});

