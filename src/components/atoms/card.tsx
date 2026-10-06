import type { PropsWithChildren } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme } from '@/theme/useTheme';

export type CardProps = PropsWithChildren<{
  // "default" = superfície; "highlight" = sálvia (cheapest price / result).
  tone?: 'default' | 'highlight';
  // Dims the card (e.g. archived item on Home).
  muted?: boolean;
  // Optional: groups the card into a single screen-reader element (e.g. "Milk, cheapest, R$ 4.59").
  // The highlight colour alone never conveys "cheapest"; put a Badge or text in the card too.
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
}>;

// Rounded surface container used by home items, price rows, result and settings groups.
export function Card({
  tone = 'default',
  muted = false,
  accessibilityLabel,
  style,
  children,
}: CardProps) {
  const { colors } = useTheme();
  return (
    <View
      accessible={accessibilityLabel ? true : undefined}
      accessibilityLabel={accessibilityLabel}
      style={[
        styles.card,
        { backgroundColor: tone === 'highlight' ? colors.accent2Soft : colors.surface },
        muted && styles.muted,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 28, padding: 18 },
  muted: { opacity: 0.6 },
});
