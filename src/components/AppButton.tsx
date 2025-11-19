import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS, FONTS, SIZES } from '@/constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  loading?: boolean;
  disabled?: boolean;
}

const AppButton: React.FC<ButtonProps> = ({ title, onPress, variant = 'primary', loading, disabled }) => {
  const getButtonStyles = () => {
    switch (variant) {
      case 'secondary':
        return {
          backgroundColor: 'transparent',
          borderColor: COLORS.accent,
          borderWidth: 1,
        };
      case 'danger':
        return {
          backgroundColor: COLORS.error,
        };
      case 'primary':
      default:
        return {
          backgroundColor: COLORS.accent,
        };
    }
  };

  const getTextStyle = () => {
     switch (variant) {
      case 'primary':
        return {
          color: COLORS.primaryBackground
        }
      default:
        return {
          color: COLORS.accent
        }
     }
  }

  const buttonStyle = getButtonStyles();
  const textStyle = getTextStyle();
  const isDisabled = loading || disabled;

  return (
    <TouchableOpacity
      style={[styles.button, buttonStyle, isDisabled && styles.disabled]}
      onPress={onPress}
      disabled={isDisabled}
    >
      {loading ? (
        <ActivityIndicator color={COLORS.primaryBackground} />
      ) : (
        <Text style={[styles.text, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: SIZES.base * 1.5,
    paddingHorizontal: SIZES.padding,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  text: {
    ...FONTS.h4,
    fontWeight: 'bold',
  },
  disabled: {
    opacity: 0.5,
  },
});

export default AppButton;
