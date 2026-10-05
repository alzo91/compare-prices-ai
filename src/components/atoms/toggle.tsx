import { Switch } from 'react-native';

import { useTheme } from '@/theme/useTheme';

export type ToggleProps = {
  value: boolean;
  onValueChange: (value: boolean) => void;
  accessibilityLabel: string;
  disabled?: boolean;
};

// On/off switch: terracota track when on, "toggle off" neutral when off.
export function Toggle({ value, onValueChange, accessibilityLabel, disabled }: ToggleProps) {
  const { colors, palette } = useTheme();
  return (
    <Switch
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      accessibilityLabel={accessibilityLabel}
      trackColor={{ false: palette.neutral[400], true: colors.accent }}
      thumbColor={colors.background}
      ios_backgroundColor={palette.neutral[400]}
    />
  );
}
