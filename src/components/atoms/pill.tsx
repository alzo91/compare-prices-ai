import { Pressable, StyleSheet, Text } from 'react-native';

import { MIN_TOUCH_TARGET } from '@/components/touch-target';
import { fontFamily } from '@/theme/typography';
import { useTheme } from '@/theme/useTheme';

export type PillProps = {
  label: string;
  selected?: boolean;
  // "accent" = terracota (default); "accent2" = sálvia, used inside the cheapest card.
  tone?: 'accent' | 'accent2';
  // "small" = compact option pills (Ajustes selectors); touch target stays at least 44 pt.
  size?: 'regular' | 'small';
  onPress?: () => void;
  disabled?: boolean;
  // Override what screen readers announce (default: label). Pass translated strings.
  accessibilityLabel?: string;
  accessibilityHint?: string;
};

// Chip / pill selector option: unit chips (kg, g, L...) and the "kg · L / 100 g / unidade" setting.
export function Pill({
  label,
  selected = false,
  tone = 'accent',
  size = 'regular',
  onPress,
  disabled = false,
  accessibilityLabel,
  accessibilityHint,
}: PillProps) {
  const { colors } = useTheme();
  const fill = tone === 'accent' ? colors.accent : colors.accent2;
  const onFill = tone === 'accent' ? colors.onAccent : colors.onAccent2;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ selected, disabled }}
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.pill,
        size === 'small' && styles.pillSmall,
        selected
          ? { backgroundColor: fill, borderColor: fill }
          : { backgroundColor: colors.background, borderColor: colors.border },
      ]}
    >
      <Text
        style={[
          styles.label,
          size === 'small' && styles.labelSmall,
          { color: selected ? onFill : colors.text },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    minWidth: Math.max(56, MIN_TOUCH_TARGET),
    minHeight: Math.max(48, MIN_TOUCH_TARGET),
    paddingHorizontal: 20,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillSmall: {
    minWidth: MIN_TOUCH_TARGET,
    minHeight: MIN_TOUCH_TARGET,
    paddingHorizontal: 14,
  },
  label: { fontFamily: fontFamily.display, fontSize: 19 },
  labelSmall: { fontSize: 15 },
});
