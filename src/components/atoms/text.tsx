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
  // "accent" text uses the darker accentText step: the brand terracota fails AA as text.
  const resolved = color === 'accent' ? colors.accentText : colors[color];
  return <RNText {...rest} style={[typography[variant], { color: resolved }, style]} />;
}
