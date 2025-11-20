import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import Screen from '@/components/Screen';
import Card from '@/components/Card';
import { MOCK_USERS, User } from '@/api/mockData';
import { COLORS, FONTS, SIZES } from '@/constants/theme';

export default function MembersScreen() {
  const members = MOCK_USERS.filter(u => u.role === 'user');

  const renderMember = ({ item }: { item: User }) => (
    <Card style={styles.memberCard}>
      <Text style={styles.memberName}>{item.name}</Text>
      <Text style={styles.memberInfo}>Email: {item.email}</Text>
      <Text style={styles.memberInfo}>Gender: {item.gender}</Text>
      <Text style={styles.memberInfo}>Membership: {item.membership}</Text>
      <Text style={styles.memberInfo}>Points: {item.points}</Text>
    </Card>
  );

  return (
    <Screen>
      <Text style={styles.title}>Club Members</Text>
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
  memberCard: {
    padding: SIZES.base * 1.5,
    marginBottom: SIZES.base,
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
