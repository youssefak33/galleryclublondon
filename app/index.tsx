import { Redirect } from 'expo-router';
import { useAuthStore } from '@/store/authStore';

export default function StartPage() {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Redirect href="/(tabs)/profile" />;
  } else {
    return <Redirect href="/login" />;
  }
}
