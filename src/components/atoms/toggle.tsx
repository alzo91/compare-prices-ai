import { StyleSheet, Switch, View } from 'react-native';

import { MIN_TOUCH_TARGET } from '@/components/touch-target';
import { useTheme } from '@/theme/useTheme';

export type ToggleProps = {
  value: boolean;
  onValueChange: (value: boolean) => void;
  // Required: pass a translated string describing what the switch controls.
  accessibilityLabel: string;
  accessibilityHint?: string;
  disabled?: boolean;
};

const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };

// On/off switch: terracota track when on, border-contrast neutral when off (3:1 on background).
export function Toggle({
  value,
  onValueChange,
  accessibilityLabel,
  accessibilityHint,
  disabled,
}: ToggleProps) {
  const { colors } = useTheme();
  return (
    <View style={styles.target}>
      <Switch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        hitSlop={HIT_SLOP}
        accessibilityRole="switch"
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        accessibilityState={{ checked: value, disabled: !!disabled }}
        trackColor={{ false: colors.border, true: colors.accent }}
        thumbColor={colors.background}
        ios_backgroundColor={colors.border}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  // Native switches are ~51x31 pt; the wrapper plus hitSlop guarantees a 44x44 pt target.
  target: {
    minWidth: MIN_TOUCH_TARGET,
    minHeight: MIN_TOUCH_TARGET,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
