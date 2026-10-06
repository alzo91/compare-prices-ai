import { router } from 'expo-router';
import type { BottomTabBarProps } from 'expo-router/tabs';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, type IconName } from '@/components/atoms/icon';
import { MIN_TOUCH_TARGET } from '@/components/touch-target';
import { useI18n } from '@/i18n';
import { fontFamily } from '@/theme/typography';
import { useTheme } from '@/theme/useTheme';

const TAB_ICONS: Record<string, IconName> = {
  index: { ios: 'list.bullet', android: 'format_list_bulleted' },
  settings: { ios: 'slider.vertical.3', android: 'tune' },
};

// Tab bar from the Home / Ajustes designs: Comparações · "+" FAB · Ajustes.
export function BottomBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { colors, palette } = useTheme();
  const { t } = useI18n();
  const insets = useSafeAreaInsets();

  const tabs = state.routes.map((route, index) => {
    const isFocused = state.index === index;
    const label = descriptors[route.key].options.title ?? route.name;
    const color = isFocused ? palette.terracota[800] : colors.textMuted; // active: "nav label"

    const onPress = () => {
      const event = navigation.emit({
        type: 'tabPress',
        target: route.key,
        canPreventDefault: true,
      });
      if (!isFocused && !event.defaultPrevented) {
        navigation.navigate(route.name, route.params);
      }
    };

    return (
      <Pressable
        key={route.key}
        accessibilityRole="tab"
        accessibilityState={{ selected: isFocused }}
        accessibilityLabel={descriptors[route.key].options.tabBarAccessibilityLabel ?? label}
        onPress={onPress}
        style={[styles.tab, isFocused && { backgroundColor: colors.accentSoft }]}
      >
        <Icon name={TAB_ICONS[route.name]} color={color} />
        <Text style={[styles.label, { color }]}>{label}</Text>
      </Pressable>
    );
  });

  const fab = (
    <Pressable
      key="fab"
      accessibilityRole="button"
      accessibilityLabel={t('tabs.newComparison')}
      onPress={() => router.push('/new-compare-prices')}
      style={[styles.fab, { backgroundColor: colors.accent }]}
    >
      <Icon name={{ ios: 'plus', android: 'add' }} color={colors.onAccent} size={32} />
    </Pressable>
  );

  // FAB sits between the first tab and the rest.
  return (
    <View
      style={[
        styles.bar,
        { backgroundColor: colors.background, paddingBottom: Math.max(insets.bottom, 12) },
      ]}
    >
      {[tabs[0], fab, ...tabs.slice(1)]}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  tab: {
    flex: 1,
    maxWidth: 140,
    minHeight: Math.max(56, MIN_TOUCH_TARGET),
    minWidth: MIN_TOUCH_TARGET,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 10,
    borderRadius: 24,
  },
  label: {
    fontFamily: fontFamily.body,
    fontSize: 13,
    lineHeight: 18,
  },
  fab: {
    width: Math.max(64, MIN_TOUCH_TARGET),
    height: Math.max(64, MIN_TOUCH_TARGET),
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
