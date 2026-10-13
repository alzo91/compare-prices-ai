import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

import { FieldError } from '@/components/atoms/field-error';
import { MIN_TOUCH_TARGET } from '@/components/touch-target';
import { fontFamily } from '@/theme/typography';
import { useTheme } from '@/theme/useTheme';

export type PillInputProps = Omit<TextInputProps, 'style' | 'placeholderTextColor'> & {
  // Fixed prefix inside the pill, e.g. "R$".
  prefix?: string;
  // "surface" = on the screen background (product, search); "background" = inside a card.
  on?: 'surface' | 'background';
  // Pass a translated label; falls back to the placeholder when omitted.
  accessibilityLabel?: string;
  // Translated inline error (task 4.7): error border + message under the pill.
  error?: string;
};

// Pill-shaped text input: product name, search, price (with "R$" prefix) and quantity.
export function PillInput({
  prefix,
  on = 'surface',
  accessibilityLabel,
  error,
  ...inputProps
}: PillInputProps) {
  const { colors, palette } = useTheme();
  // Label announced by screen readers: caller's label, else the placeholder, plus the prefix.
  const base = accessibilityLabel ?? inputProps.placeholder;
  const label = prefix && base ? `${base} (${prefix})` : base;
  const fill = on === 'surface' ? colors.surface : colors.background;

  return (
    <>
      <View
        style={[
          styles.pill,
          { backgroundColor: fill, borderColor: error ? colors.accentText : colors.border },
          error ? styles.pillError : null,
        ]}
      >
        {prefix ? (
          // Read as part of the input's label instead of as a separate element.
          <Text
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
            style={[styles.prefix, { color: colors.textMuted }]}
          >
            {prefix}
          </Text>
        ) : null}
        <TextInput
          {...inputProps}
          accessibilityLabel={label}
          accessibilityHint={error ?? inputProps.accessibilityHint}
          placeholderTextColor={palette.neutral[700]}
          selectionColor={colors.accent}
          style={[styles.input, { color: colors.text }]}
        />
      </View>
      {error ? <FieldError message={error} /> : null}
    </>
  );
}

const styles = StyleSheet.create({
  pill: {
    minHeight: 56,
    paddingHorizontal: 24,
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pillError: { borderWidth: 2 },
  prefix: { fontFamily: fontFamily.body, fontSize: 17 },
  input: {
    flex: 1,
    minHeight: MIN_TOUCH_TARGET,
    fontFamily: fontFamily.body,
    fontSize: 18,
    padding: 0,
  },
});
