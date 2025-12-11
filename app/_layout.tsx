import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider } from '@/contexts/AuthContext';
import { LocationProvider } from '@/contexts/LocationContext';
import { LanguageProvider } from '@/contexts/LanguageContext';

export const unstable_settings = {
  anchor: 'login',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <LanguageProvider>
      <AuthProvider>
        <LocationProvider>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="login" options={{ headerShown: false }} />
              <Stack.Screen name="signup" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="create-incident" options={{ headerShown: false }} />
              <Stack.Screen name="location-picker" options={{ headerShown: false }} />
              <Stack.Screen name="incidents-map" options={{ headerShown: false }} />
              <Stack.Screen name="pet-detail/[id]" options={{ headerShown: false }} />
              <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
            </Stack>
            <StatusBar style="light" />
          </ThemeProvider>
        </LocationProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
