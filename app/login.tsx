import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
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
    <Screen gradient scrollable>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header avec logo et titre premium */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <LinearGradient
                colors={COLORS.goldGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFillObject}
              />
              <Ionicons name="diamond" size={32} color="#000000" />
            </View>
          </View>
          <Text style={styles.title}>GALLERY</Text>
          <Text style={styles.titleAccent}>CLUB</Text>
          <Text style={styles.subtitle}>LONDON</Text>
          <View style={styles.divider} />
          <Text style={styles.tagline}>Where Nightlife Meets Luxury</Text>
        </View>

        {/* Formulaire de connexion */}
        <View style={styles.form}>
          <AppInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="your.email@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <AppInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            secureTextEntry
          />
          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
          <View style={{ height: SIZES.padding }} />
          <AppButton 
            title="Enter the Club" 
            onPress={handleLogin} 
            loading={loading}
            variant="primary"
          />
        </View>

        {/* Social Login */}
        <View style={styles.socialContainer}>
          <View style={styles.socialDivider}>
            <View style={styles.dividerLine} />
            <Text style={styles.socialText}>Or continue with</Text>
            <View style={styles.dividerLine} />
          </View>
          <View style={styles.socialButtons}>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => handleSocialLogin('google')}
            >
              <Ionicons name="logo-google" size={24} color={COLORS.textPrimary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => handleSocialLogin('facebook')}
            >
              <Ionicons name="logo-facebook" size={24} color={COLORS.textPrimary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => handleSocialLogin('apple')}
            >
              <Ionicons name="logo-apple" size={24} color={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>New to Gallery Club?</Text>
          <TouchableOpacity>
            <Text style={styles.footerLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: SIZES.padding * 2,
  },
  header: {
    alignItems: 'center',
    marginBottom: SIZES.padding * 1.5,
  },
  logoContainer: {
    marginBottom: SIZES.padding,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    backgroundColor: COLORS.glass,
    shadowColor: COLORS.goldGlow,
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 24,
    elevation: 10,
  },
  title: {
    ...FONTS.h1,
    fontSize: 32,
    color: COLORS.textPrimary,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  titleAccent: {
    ...FONTS.h1,
    fontSize: 32,
    color: COLORS.textPrimary,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginTop: -SIZES.base,
  },
  subtitle: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
    letterSpacing: 3,
    marginTop: SIZES.base / 2,
    fontWeight: '300',
  },
  divider: {
    width: 60,
    height: 2,
    backgroundColor: COLORS.textSecondary,
    marginTop: SIZES.base * 2,
    marginBottom: SIZES.base,
    borderRadius: 5,
  },
  tagline: {
    ...FONTS.body4,
    color: COLORS.textPrimary,
    fontStyle: 'italic',
    letterSpacing: 0.5,
  },
  form: {
    width: '100%',
    marginBottom: SIZES.padding,
    backgroundColor: COLORS.glass,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    padding: SIZES.padding,
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 24,
    elevation: 8,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: SIZES.base,
  },
  forgotPasswordText: {
    ...FONTS.body4,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  socialContainer: {
    marginTop: SIZES.padding,
    width: '100%',
  },
  socialDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.padding,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.glassBorder,
  },
  socialText: {
    ...FONTS.body4,
    color: COLORS.textTertiary,
    marginHorizontal: SIZES.base * 2,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SIZES.base * 2,
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 5,
    backgroundColor: COLORS.glass,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    justifyContent: 'center',
    alignItems: 'center',
    ...SIZES.shadow.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SIZES.padding,
    gap: SIZES.base,
  },
  footerText: {
    ...FONTS.body4,
    color: COLORS.textTertiary,
  },
  footerLink: {
    ...FONTS.body4,
    color: COLORS.textSecondary,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});
