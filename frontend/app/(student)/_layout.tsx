import { Tabs, Redirect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/constants/colors';
import { useAuthStore } from '../../src/store/useAuthStore';

export default function StudentLayout() {
  const user = useAuthStore((state) => state.user);

  // GUARD: If not logged in, or if you are an admin, get out of the student folder!
  if (!user) return <Redirect href="/(auth)/login" />;
  if (user.role === 'admin') return <Redirect href="/(admin)/dashboard" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.secondary,
        tabBarStyle: { paddingBottom: 5, height: 60 },
        tabBarLabelStyle: { paddingBottom: 5 },
      }}
    >
      <Tabs.Screen name="dashboard" options={{ title: 'Home', tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} /> }} />
      <Tabs.Screen name="mess" options={{ title: 'Mess', tabBarIcon: ({ color, size }) => <Ionicons name="restaurant" size={size} color={color} /> }} />
      <Tabs.Screen name="complaints" options={{ title: 'Help', tabBarLabel: 'Help', tabBarIcon: ({ color, size }) => <Ionicons name="help-buoy" size={size} color={color} /> }} />
      <Tabs.Screen name="community" options={{ title: 'Community', tabBarIcon: ({ color, size }) => <Ionicons name="people" size={size} color={color} /> }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} /> }} />
    </Tabs>
  );
}