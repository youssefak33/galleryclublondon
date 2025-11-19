import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import Screen from '@/components/Screen';
import Card from '@/components/Card';
import { MOCK_PARTNERS, Partner } from '@/api/mockData';
import { COLORS, FONTS, SIZES } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useUserStore } from '@/store/userStore';

export default function PerksScreen() {
  const { profile } = useUserStore();

  const getMembershipLevel = (membership: 'Bronze' | 'Silver' | 'Gold') => {
    if (membership === 'Gold') return 3;
    if (membership === 'Silver') return 2;
    return 1;
  };

  const userLevel = getMembershipLevel(profile?.membership || 'Bronze');

  const renderPerk = ({ item }: { item: Partner }) => {
    const requiredLevel = getMembershipLevel(item.requiredMembership);
    const canAccess = userLevel >= requiredLevel;

    return (
      <Card style={[styles.perkCard, !canAccess && styles.disabledCard]}>
        <View style={styles.cardHeader}>
          <Text style={styles.partnerName}>{item.name}</Text>
          {!canAccess && (
            <View style={styles.lockIcon}>
              <Ionicons name="lock-closed" size={20} color={COLORS.textDisabled} />
              <Text style={styles.requiredText}> {item.requiredMembership} required</Text>
            </View>
          )}
        </View>
        <Text style={styles.partnerDescription}>{item.description}</Text>
        <Text style={styles.perkText}>{item.perk}</Text>
      </Card>
    );
  };

  return (
    <Screen>
      <Text style={styles.title}>Perks & Partners</Text>
      <FlatList
        data={MOCK_PARTNERS}
        renderItem={renderPerk}
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
  perkCard: {
    marginBottom: SIZES.padding,
  },
  disabledCard: {
    opacity: 0.6,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  partnerName: {
    ...FONTS.h3,
    color: COLORS.accent,
    fontWeight: 'bold',
  },
  lockIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceHighlight,
    paddingHorizontal: SIZES.base,
    paddingVertical: SIZES.base / 2,
    borderRadius: SIZES.radius,
  },
  requiredText: {
    ...FONTS.body4,
    color: COLORS.textDisabled,
    fontSize: 12,
  },
  partnerDescription: {
    ...FONTS.body4,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    marginBottom: SIZES.base,
  },
  perkText: {
    ...FONTS.body3,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
});
