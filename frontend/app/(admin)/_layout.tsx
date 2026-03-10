import { Tabs, Redirect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';
import { colors } from '../../src/constants/colors';
import { useAuthStore } from '../../src/store/useAuthStore';

export default function AdminLayout() {
  const theme = useTheme();
  const user = useAuthStore((state) => state.user);

  // GUARD: If not logged in, or if you are a student, get out of the admin folder!
  if (!user) return <Redirect href="/(auth)/login" />;
  if (user.role !== 'admin') return <Redirect href="/(student)/dashboard" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: '#999',
        tabBarStyle: { height: 60, paddingBottom: 5, paddingTop: 5, backgroundColor: 'white', borderTopWidth: 1, borderTopColor: '#F0F0F0', elevation: 5 },
        tabBarLabelStyle: { fontSize: 12, fontWeight: '500', paddingBottom: 5 },
      }}
    >
      <Tabs.Screen name="dashboard" options={{ title: 'Overview', tabBarIcon: ({ color, size }) => <Ionicons name="grid-outline" size={size} color={color} /> }} />
      <Tabs.Screen name="mess" options={{ title: 'Mess Menu', tabBarIcon: ({ color, size }) => <Ionicons name="restaurant-outline" size={size} color={color} /> }} />
      <Tabs.Screen name="rooms" options={{ title: 'Rooms', tabBarIcon: ({ color, size }) => <Ionicons name="bed-outline" size={size} color={color} /> }} />
      <Tabs.Screen name="complaints" options={{ title: 'Issues', tabBarLabel: 'Issues', tabBarIcon: ({ color, size }) => <Ionicons name="alert-circle-outline" size={size} color={color} /> }} />
    </Tabs>
  );
}