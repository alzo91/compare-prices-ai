import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import type { ColorValue } from 'react-native';

// SF Symbol on iOS, Material Symbol on Android.
export type IconName = Extract<SymbolViewProps['name'], { ios?: unknown }>;

type IconProps = {
  name: IconName;
  color: ColorValue;
  size?: number;
};

export function Icon({ name, color, size = 24 }: IconProps) {
  return <SymbolView name={name} tintColor={color} size={size} />;
}
