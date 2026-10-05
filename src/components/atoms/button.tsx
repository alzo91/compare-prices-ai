import { Pressable, StyleSheet, Text } from 'react-native';

import { fontFamily } from '@/theme/typography';
import { useTheme } from '@/theme/useTheme';

export type ButtonProps = {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
};

// Primary action (terracota, full width). Disabled uses the "inactive button" neutral.
export function Button({ label, onPress, disabled = false }: ButtonProps) {
  const { colors } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
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
      <Text style={[styles.label, { color: disabled ? colors.textMuted : colors.onAccent }]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 64,
    borderRadius: 999,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { fontFamily: fontFamily.display, fontSize: 20 },
});
