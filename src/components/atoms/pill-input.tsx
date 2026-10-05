import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

import { fontFamily } from '@/theme/typography';
import { useTheme } from '@/theme/useTheme';

export type PillInputProps = Omit<TextInputProps, 'style' | 'placeholderTextColor'> & {
  // Fixed prefix inside the pill, e.g. "R$".
  prefix?: string;
  // "surface" = on the screen background (product, search); "background" = inside a card.
  on?: 'surface' | 'background';
};

// Pill-shaped text input: product name, search, price (with "R$" prefix) and quantity.
export function PillInput({ prefix, on = 'surface', ...inputProps }: PillInputProps) {
  const { colors, palette } = useTheme();
  const fill = on === 'surface' ? colors.surface : colors.background;

  return (
    <View style={[styles.pill, { backgroundColor: fill, borderColor: colors.divider }]}>
      {prefix ? <Text style={[styles.prefix, { color: colors.textMuted }]}>{prefix}</Text> : null}
      <TextInput
        {...inputProps}
        placeholderTextColor={palette.neutral[500]}
        selectionColor={colors.accent}
        style={[styles.input, { color: colors.text }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    height: 56,
    paddingHorizontal: 24,
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  prefix: { fontFamily: fontFamily.body, fontSize: 17 },
  input: { flex: 1, fontFamily: fontFamily.body, fontSize: 18, padding: 0 },
});
