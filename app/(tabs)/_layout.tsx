import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES, FONTS } from '@/constants/theme';
import { useAuthStore } from '@/store/authStore';

type TabConfig = {
  name: string;
  title: string;
  icon: {
    active: keyof typeof Ionicons.glyphMap;
    inactive: keyof typeof Ionicons.glyphMap;
  };
};

const staffTabs: TabConfig[] = [
  {
    name: 'events',
    title: 'Events',
    icon: { active: 'calendar', inactive: 'calendar-outline' },
  },
  {
    name: 'scan',
    title: 'Scan',
    icon: { active: 'scan', inactive: 'scan-outline' },
  },
  {
    name: 'staff',
    title: 'Staff',
    icon: { active: 'person-circle', inactive: 'person-circle-outline' },
  },
  {
    name: 'members',
    title: 'Members',
    icon: { active: 'people', inactive: 'people-outline' },
  },
];

const memberTabs: TabConfig[] = [
  {
    name: 'feed',
    title: 'Feed',
    icon: { active: 'home', inactive: 'home-outline' },
  },
  {
    name: 'profile',
    title: 'Profile',
    icon: { active: 'person-circle', inactive: 'person-circle-outline' },
  },
  {
    name: 'events',
    title: 'Events',
    icon: { active: 'calendar', inactive: 'calendar-outline' },
  },
  {
    name: 'perks',
    title: 'Perks',
    icon: { active: 'star', inactive: 'star-outline' },
  },
  {
    name: 'checkin',
    title: 'Check-in',
    icon: { active: 'qr-code', inactive: 'qr-code-outline' },
  },
];

export default function TabsLayout() {
  const { user } = useAuthStore();
  const isStaff = user?.role === 'staff';
  const tabs = isStaff ? staffTabs : memberTabs;
  const iconMap = tabs.reduce<Record<string, TabConfig['icon']>>(
    (acc, tab) => ({ ...acc, [tab.name]: tab.icon }),
    {}
  );

  // Créer un map de tous les onglets possibles pour les icônes
  const allTabs = [...staffTabs, ...memberTabs];
  const allIconMap = allTabs.reduce<Record<string, TabConfig['icon']>>(
    (acc, tab) => ({ ...acc, [tab.name]: tab.icon }),
    {}
  );

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.textPrimary,
        tabBarInactiveTintColor: COLORS.textTertiary,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopWidth: 0,
          height: 70,
          paddingBottom: SIZES.base * 2,
          paddingTop: SIZES.base,
          ...SIZES.shadow.lg,
          elevation: 20,
        },
        tabBarLabelStyle: {
          ...FONTS.caption,
          fontWeight: '600',
          letterSpacing: 0.5,
        },
        tabBarIcon: ({ color, size, focused }) => {
          const icon = allIconMap[route.name];
          const iconName = focused ? icon?.active : icon?.inactive;
          if (focused && iconName) {
            return (
              <LinearGradient
                colors={COLORS.goldGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.tabIcon}
              >
                <Ionicons
                  name={iconName}
                  size={size - 6}
                  color="#000000"
                />
              </LinearGradient>
            );
          }
          return (
            <Ionicons
              name={(iconName ?? 'ellipse-outline') as keyof typeof Ionicons.glyphMap}
              size={size}
              color={color}
            />
          );
        },
      })}
    >
      {/* Onglets partagés - Events et Feed visibles pour tous */}
      <Tabs.Screen 
        name="events" 
        options={{ 
          title: 'Events',
          href: '/events', // Visible pour tous
        }} 
      />
      <Tabs.Screen 
        name="feed" 
        options={{ 
          title: 'Feed',
          href: '/feed', // Visible pour tous
        }} 
      />
      
      {/* Onglets Staff uniquement - Scan, Staff, Members */}
      <Tabs.Screen 
        name="scan" 
        options={{ 
          title: 'Scan',
          href: isStaff ? '/scan' : null, // Caché pour les membres
        }} 
      />
      <Tabs.Screen 
        name="staff" 
        options={{ 
          title: 'Staff',
          href: isStaff ? '/staff' : null, // Caché pour les membres
        }} 
      />
      <Tabs.Screen 
        name="members" 
        options={{ 
          title: 'Members',
          href: isStaff ? '/members' : null, // Caché pour les membres
        }} 
      />
      
      {/* Onglets Membres uniquement - Profile, Perks, Check-in */}
      <Tabs.Screen 
        name="profile" 
        options={{ 
          title: 'Profile',
          href: !isStaff ? '/profile' : null, // Caché pour le staff
        }} 
      />
      <Tabs.Screen 
        name="perks" 
        options={{ 
          title: 'Perks',
          href: !isStaff ? '/perks' : null, // Caché pour le staff
        }} 
      />
      <Tabs.Screen 
        name="checkin" 
        options={{ 
          title: 'Check-in',
          href: !isStaff ? '/checkin' : null, // Caché pour le staff
        }} 
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabIcon: {
    padding: SIZES.base / 1.5,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.goldGlow,
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 6,
  },
});
