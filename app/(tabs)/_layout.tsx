import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';
import { useAuthStore } from '@/store/authStore';

export default function TabsLayout() {
  const { user } = useAuthStore();
  const isStaff = user?.role === 'staff';

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.accent,
        tabBarInactiveTintColor: COLORS.textDisabled,
        tabBarStyle: {
          backgroundColor: COLORS.neutral,
          borderTopColor: COLORS.surface,
        },
        tabBarIcon: ({ color, size, focused }) => {
          let iconName;
          if (route.name === 'profile') {
            iconName = focused ? 'person-circle' : 'person-circle-outline';
          } else if (route.name === 'events') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'perks') {
            iconName = focused ? 'star' : 'star-outline';
          } else if (route.name === 'checkin') {
            iconName = focused ? 'qr-code' : 'qr-code-outline';
          } else if (route.name === 'staff') {
            iconName = focused ? 'shield-checkmark' : 'shield-checkmark-outline';
          }
          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
      <Tabs.Screen name="events" options={{ title: 'Events' }} />
      <Tabs.Screen name="perks" options={{ title: 'Perks' }} />
      <Tabs.Screen name="checkin" options={{ title: 'Check-in' }} />
      {isStaff && (
        <Tabs.Screen name="staff" options={{ title: 'Staff' }} />
      )}
    </Tabs>
  );
}
