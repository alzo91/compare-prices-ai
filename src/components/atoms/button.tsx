import { Pressable, StyleSheet, Text } from 'react-native';

import { MIN_TOUCH_TARGET } from '@/components/touch-target';
import { fontFamily } from '@/theme/typography';
import { useTheme } from '@/theme/useTheme';

export type ButtonProps = {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  // Override what screen readers announce (default: label). Pass translated strings.
  accessibilityLabel?: string;
  accessibilityHint?: string;
};

// Primary action (terracota, full width). Disabled uses the "inactive button" neutral.
export function Button({
  label,
  onPress,
  disabled = false,
  accessibilityLabel,
  accessibilityHint,
}: ButtonProps) {
  const { colors, palette } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: disabled
            ? colors.divider
            : pressed
              ? colors.accentPressed
              : colors.accent,
        },
      ]}
    >
      <Text style={[styles.label, { color: disabled ? palette.neutral[800] : colors.onAccent }]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: Math.max(64, MIN_TOUCH_TARGET),
    borderRadius: 999,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { fontFamily: fontFamily.display, fontSize: 20 },
});
