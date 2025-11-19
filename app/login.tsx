import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import Screen from '@/components/Screen';
import AppInput from '@/components/AppInput';
import AppButton from '@/components/AppButton';
import { useAuthStore } from '@/store/authStore';
import { COLORS, FONTS, SIZES } from '@/constants/theme';

export default function LoginScreen() {
  const router = useRouter();
  const { login, socialLogin } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const success = login(email);
      setLoading(false);
      if (!success) {
        Alert.alert('Login Failed', 'Invalid email or password.');
      } else {
        router.replace('/(tabs)/profile');
      }
    }, 1000);
  };

  const handleSocialLogin = (provider: 'google' | 'facebook' | 'apple') => {
    const success = socialLogin(provider);
    if (success) {
      router.replace('/(tabs)/profile');
    }
  };

  return (
    <Screen style={styles.container}>
      <Text style={styles.title}>Gallery Club</Text>
      <Text style={styles.subtitle}>London</Text>
      
      <View style={styles.form}>
        <AppInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <AppInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          secureTextEntry
        />
        <View style={{height: SIZES.padding}}/>
        <AppButton title="Login" onPress={handleLogin} loading={loading} />
      </View>

      <View style={styles.socialContainer}>
        <Text style={styles.socialText}>Or continue with</Text>
        <View style={styles.socialButtons}>
          <AppButton title="Google" onPress={() => handleSocialLogin('google')} variant="secondary" />
          <View style={{width: SIZES.base}}/>
          <AppButton title="Facebook" onPress={() => handleSocialLogin('facebook')} variant="secondary" />
           <View style={{width: SIZES.base}}/>
          <AppButton title="Apple" onPress={() => handleSocialLogin('apple')} variant="secondary" />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...FONTS.h1,
    color: COLORS.accent,
    fontWeight: 'bold',
  },
  subtitle: {
    ...FONTS.h3,
    color: COLORS.textSecondary,
    marginBottom: SIZES.padding * 2,
  },
  form: {
    width: '100%',
    paddingHorizontal: SIZES.padding,
  },
  socialContainer: {
    marginTop: SIZES.padding * 2,
    alignItems: 'center',
  },
  socialText: {
    ...FONTS.body4,
    color: COLORS.textSecondary,
    marginBottom: SIZES.padding,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
