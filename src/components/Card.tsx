import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { COLORS, SIZES } from '@/constants/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'premium' | 'glass';
  gradient?: boolean;
}

const Card: React.FC<CardProps> = ({ children, style, variant = 'default', gradient = false }) => {
  if (variant === 'glass') {
    return (
      <View style={[styles.card, styles.glassCard, style]}>
        {children}
      </View>
    );
  }

  if (variant === 'premium') {
    return (
      <View style={[styles.card, styles.premiumCard, style]}>
        {children}
      </View>
    );
  }

  return <View style={[styles.card, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.glass,
    borderRadius: 5,
    padding: SIZES.base * 2,
    marginVertical: SIZES.base / 2,
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    elevation: 8,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
  },
  premiumCard: {
    borderColor: COLORS.goldGradient[0],
    shadowColor: COLORS.goldGlow,
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 24,
    elevation: 10,
  },
  glassCard: {
    backgroundColor: COLORS.glass,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
  },
});

export default Card;
