import { Tabs } from 'expo-router/tabs';

import { BottomBar } from '@/components/organism/bottom-bar';
import { useI18n } from '@/i18n';

export default function TabsLayout() {
  const { t } = useI18n();
  return (
    <Tabs tabBar={(props) => <BottomBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: t('tabs.comparisons') }} />
      <Tabs.Screen name="settings" options={{ title: t('tabs.settings') }} />
    </Tabs>
  );
}
