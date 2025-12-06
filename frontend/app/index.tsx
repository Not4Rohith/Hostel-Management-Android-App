import { Redirect } from 'expo-router';
import { useAuthStore } from '../src/store/useAuthStore';

export default function Index() {
  const user = useAuthStore((state) => state.user);

  // If not logged in, go to Login
  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  // If logged in, go to specific dashboard
  if (user.role === 'admin') {
    return <Redirect href="/(admin)/dashboard" />;
  }

  return <Redirect href="/(student)/dashboard" />;
}