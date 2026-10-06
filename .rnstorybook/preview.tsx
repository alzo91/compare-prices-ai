import type { Preview } from '@storybook/react-native';
import { useFonts } from 'expo-font';
import type { ReactNode } from 'react';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import '@/i18n'; // initializes i18next (BottomBar uses useI18n)
import { fontAssets } from '@/theme/fonts';
import { light } from '@/theme/light';
import { ThemeProvider } from '@/theme/useTheme';

// Same providers and font loading as src/app/_layout.tsx, so stories show the real tokens and fonts.
function AppProviders({ children }: { children: ReactNode }) {
  const [fontsLoaded, fontError] = useFonts(fontAssets);
  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <View style={{ flex: 1, padding: 16, backgroundColor: light.colors.background }}>
          {children}
        </View>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const preview: Preview = {
  decorators: [
    (Story) => (
      <AppProviders>
        <Story />
      </AppProviders>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;
