import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View, ViewStyle, StyleProp } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, SIZES } from '@/constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'brand';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

const AppButton: React.FC<ButtonProps> = ({ title, onPress, variant = 'primary', loading, disabled, icon, style }) => {
  const isDisabled = loading || disabled;

  if (variant === 'primary') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={isDisabled}
        activeOpacity={0.8}
        style={[styles.buttonContainer, styles.goldGlow, isDisabled && styles.disabled, style]}
      >
        <LinearGradient
          colors={COLORS.goldGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.button, styles.primaryButton]}
        >
          {loading ? (
            <ActivityIndicator color="#000000" />
          ) : (
            <View style={[styles.buttonContent, { justifyContent: 'center' }]}>
              {icon && <View style={styles.iconContainer}>{icon}</View>}
              <Text style={[styles.text, styles.primaryText]}>{title}</Text>
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  if (variant === 'brand') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={isDisabled}
        activeOpacity={0.8}
        style={[styles.buttonContainer, isDisabled && styles.disabled]}
      >
        <LinearGradient
          colors={COLORS.burgundyGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.button, styles.brandButton]}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.textPrimary} />
          ) : (
            <View style={styles.buttonContent}>
              {icon && <View style={styles.iconContainer}>{icon}</View>}
              <Text style={[styles.text, styles.brandText]}>{title}</Text>
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  const getButtonStyles = () => {
    switch (variant) {
      case 'secondary':
        return {
          backgroundColor: 'transparent',
          borderColor: COLORS.textSecondary,
          borderWidth: 2,
        };
      case 'danger':
        return {
          backgroundColor: COLORS.error,
        };
      case 'primary':
      default:
        return {
          backgroundColor: COLORS.textSecondary,
        };
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'secondary':
        return styles.secondaryText;
      case 'danger':
        return styles.dangerText;
      default:
        return styles.secondaryText;
    }
  };

  const buttonStyle = getButtonStyles();
  const textStyle = getTextStyle();

  return (
    <TouchableOpacity
      style={[styles.button, buttonStyle, isDisabled && styles.disabled, style]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? COLORS.primaryBackground : COLORS.textSecondary} />
      ) : (
        <View style={styles.buttonContent}>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <Text style={[styles.text, textStyle]}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: 5,
    overflow: 'hidden',
  },
  button: {
    paddingVertical: SIZES.base * 1.5,
    paddingHorizontal: SIZES.base * 2,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 4,
  },
  primaryButton: {
    borderRadius: 5,
  },
  goldGlow: {
    shadowColor: COLORS.goldGlow,
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 20,
    elevation: 8,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SIZES.base,
  },
  iconContainer: {
    marginRight: SIZES.base / 2,
  },
  text: {
    ...FONTS.body3,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  secondaryText: {
    color: COLORS.textSecondary,
  },
  dangerText: {
    color: COLORS.textPrimary,
  },
  primaryText: {
    color: '#000000',
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  brandButton: {
    ...SIZES.shadow.md,
  },
  brandText: {
    color: COLORS.textPrimary,
    fontWeight: '700',
  },
  disabled: {
    opacity: 0.5,
  },
});

export default AppButton;
