import { Redirect } from 'expo-router';
import { useAuthStore } from '../src/store/useAuthStore';
import { ActivityIndicator, View } from 'react-native';

export default function Index() {
  const user = useAuthStore((state) => state.user);
  const isHydrated = useAuthStore((state) => state.isHydrated);

  // Fallback just in case index loads before layout hydration finishes
  if (!isHydrated) {
    return (
      <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
        <ActivityIndicator />
      </View>
    );
  }

  // 1. Not logged in -> Auth
  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  // 2. Logged in as Admin -> Admin Dashboard
  if (user.role === 'admin') {
    return <Redirect href="/(admin)/dashboard" />;
  }

  // 3. Logged in as Student -> Student Dashboard
  return <Redirect href="/(student)/dashboard" />;
}