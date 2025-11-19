import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import Screen from '@/components/Screen';
import Card from '@/components/Card';
import AppButton from '@/components/AppButton';
import { MOCK_USERS, User } from '@/api/mockData';
import { COLORS, FONTS, SIZES } from '@/constants/theme';
import { useAuthStore } from '@/store/authStore';
import { Redirect } from 'expo-router';

export default function StaffScreen() {
  const { user } = useAuthStore();

  // This is a security measure. Even if the tab is visible,
  // this will prevent non-staff from seeing the content.
  if (user?.role !== 'staff') {
    return <Redirect href="/(tabs)/profile" />;
  }

  const members = MOCK_USERS.filter(u => u.role === 'user');

  const renderMember = ({ item }: { item: User }) => (
    <Card style={styles.memberCard}>
      <Text style={styles.memberName}>{item.name}</Text>
      <Text style={styles.memberInfo}>Email: {item.email}</Text>
      <Text style={styles.memberInfo}>Membership: {item.membership}</Text>
      <Text style={styles.memberInfo}>Points: {item.points}</Text>
    </Card>
  );

  return (
    <Screen>
      <Text style={styles.title}>Staff Dashboard</Text>
      
      <View style={styles.actions}>
        <AppButton title="Scan QR Code" onPress={() => alert("Scanner not implemented")} />
      </View>

      <Text style={styles.subtitle}>Club Members</Text>
      <FlatList
        data={members}
        renderItem={renderMember}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />
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
  subtitle: {
    ...FONTS.h2,
    color: COLORS.textSecondary,
    fontWeight: 'bold',
    marginTop: SIZES.padding,
    marginBottom: SIZES.base,
  },
  actions: {
    marginBottom: SIZES.padding,
  },
  memberCard: {
    padding: SIZES.base * 1.5,
  },
  memberName: {
    ...FONTS.h4,
    color: COLORS.accent,
    fontWeight: 'bold',
  },
  memberInfo: {
    ...FONTS.body4,
    color: COLORS.textPrimary,
  },
});
