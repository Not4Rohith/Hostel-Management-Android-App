import { Stack } from 'expo-router';
import { PaperProvider, MD3LightTheme } from 'react-native-paper';
import { colors } from '../src/constants/colors';
import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useAuthStore } from '../src/store/useAuthStore';

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.primary,
    secondary: colors.secondary,
    background: colors.background,
  },
};

export default function RootLayout() {
  const loadUser = useAuthStore((state) => state.loadUser);
  const isHydrated = useAuthStore((state) => state.isHydrated);

  useEffect(() => {
    loadUser();
  }, []);

  if (!isHydrated) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <PaperProvider theme={theme}>
      <Stack screenOptions={{ headerShown: false }}>
        {/* DO NOT ADD REDIRECTS HERE */}
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(student)" />
        <Stack.Screen name="(admin)" />
      </Stack>
    </PaperProvider>
  );
}