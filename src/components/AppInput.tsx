import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps } from 'react-native';
import { COLORS, FONTS, SIZES } from '@/constants/theme';

interface AppInputProps extends TextInputProps {
  label: string;
  error?: string;
}

const AppInput: React.FC<AppInputProps> = ({ label, error, ...props }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputContainer, isFocused && styles.inputFocused, error && styles.inputError]}>
        <TextInput
          style={styles.input}
          placeholderTextColor={COLORS.textTertiary}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: SIZES.base,
  },
  label: {
    ...FONTS.body3,
    color: COLORS.textSecondary,
    marginBottom: SIZES.base,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  inputContainer: {
    backgroundColor: COLORS.glass,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 18,
    elevation: 6,
  },
  inputFocused: {
    borderColor: COLORS.accent,
    shadowColor: COLORS.goldGlow,
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 24,
    elevation: 8,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  input: {
    paddingHorizontal: SIZES.base * 2.5,
    paddingVertical: SIZES.base * 2,
    ...FONTS.body2,
    color: COLORS.textPrimary,
  },
  errorText: {
    ...FONTS.body4,
    color: COLORS.error,
    marginTop: SIZES.base / 2,
    fontWeight: '500',
  },
});

export default AppInput;
