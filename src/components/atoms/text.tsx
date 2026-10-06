import { Text as RNText, type TextProps as RNTextProps } from 'react-native';

import type { TypographyVariant } from '@/theme/typography';
import { useTheme } from '@/theme/useTheme';

type TextColor = 'text' | 'textMuted' | 'accent' | 'onAccent' | 'accent2Strong';

export type TextProps = RNTextProps & {
  variant?: TypographyVariant;
  color?: TextColor;
};

// Themed text: font and size come from the typography scale, color from the theme tokens.
export function Text({ variant = 'body', color = 'text', style, ...rest }: TextProps) {
  const { colors, typography } = useTheme();
  return <RNText {...rest} style={[typography[variant], { color: colors[color] }, style]} />;
}
