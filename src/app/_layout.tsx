import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { useAppLanguage } from '@/i18n';
import { useLanguagePreference } from '@/store/useLanguagePreference';
import { fontAssets } from '@/theme/fonts';
import { light } from '@/theme/light';
import { ThemeProvider } from '@/theme/useTheme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useAppLanguage(useLanguagePreference());
  const [fontsLoaded, fontError] = useFonts(fontAssets);
  useEffect(() => {
    if (fontsLoaded || fontError) SplashScreen.hideAsync();
  }, [fontsLoaded, fontError]);
  if (!fontsLoaded && !fontError) return null;

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
