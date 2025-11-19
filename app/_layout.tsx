import { Redirect, Stack } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { useEffect } from 'react';
import { useUserStore } from '@/store/userStore';
import { StatusBar } from 'expo-status-bar';
import { COLORS } from '@/constants/theme';

export default function RootLayout() {
  const { isAuthenticated, user } = useAuthStore();
  const { setProfile } = useUserStore();

  useEffect(() => {
    // Sync auth user to user profile store
    if (isAuthenticated && user) {
      setProfile(user);
    } else {
      setProfile(null);
    }
  }, [isAuthenticated, user, setProfile]);

  return (
    <>
      <StatusBar style="light" backgroundColor={COLORS.primaryBackground} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" options={{ presentation: 'modal' }} />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </>
  );
}