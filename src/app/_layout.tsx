import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { useDeviceLanguage } from '@/i18n';
import { light } from '@/theme/light';
import { ThemeProvider } from '@/theme/useTheme';

export default function RootLayout() {
  useDeviceLanguage();
  return (
    <ThemeProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: light.colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="new-compare-prices" options={{ presentation: 'modal' }} />
        <Stack.Screen name="compare/[id]" />
        <Stack.Screen name="about" />
      </Stack>
    </ThemeProvider>
  );
}
