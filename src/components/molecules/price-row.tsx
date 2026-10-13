import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { Card } from '@/components/atoms/card';
import { FieldError } from '@/components/atoms/field-error';
import { Icon } from '@/components/atoms/icon';
import { Pill } from '@/components/atoms/pill';
import { Text } from '@/components/atoms/text';
import { MIN_TOUCH_TARGET } from '@/components/touch-target';
import { useI18n } from '@/i18n';
import type { Unit } from '@/models/Unit';
import { fontFamily } from '@/theme/typography';
import { useTheme } from '@/theme/useTheme';

import { UNIT_OPTIONS } from './price-row.units';

export type PriceRowProps = {
  // 1-based position, shown as "Preço {{index}}".
  index: number;
  // Raw text typed by the user; parsing lives in input.service.
  price: string;
  quantity: string;
  unit: Unit | null;
  // Currency prefix inside the price field ("R$" / "$").
  currencySymbol: string;
  // Sálvia card + sálvia selected pill (cheapest price, task 4.4).
  highlight?: boolean;
  onChangePrice: (text: string) => void;
  onChangeQuantity: (text: string) => void;
  onChangeUnit: (unit: Unit) => void;
  // Translated inline error messages (task 4.7). A field with a message gets an error border.
  errors?: { price?: string; quantity?: string; unit?: string };
  // Called when a field loses focus, so the screen can start showing its errors.
  onBlurPrice?: () => void;
  onBlurQuantity?: () => void;
  // When set, a remove control is shown in the card header (rows 3+, task 4.3).
  onRemove?: () => void;
};

// One price entry: price + quantity fields and a single-select unit pill row.
// The screen repeats this component once per price (task 4.3).
export function PriceRow({
  index,
  price,
  quantity,
  unit,
  currencySymbol,
  highlight = false,
  onChangePrice,
  onChangeQuantity,
  onChangeUnit,
  errors,
  onBlurPrice,
  onBlurQuantity,
  onRemove,
}: PriceRowProps) {
  const { colors, palette } = useTheme();
  const { t } = useI18n();

  const field = (message?: string) => [
    styles.field,
    {
      backgroundColor: colors.background,
      borderColor: message ? colors.accentText : colors.divider,
    },
    message ? styles.fieldError : null,
  ];
  const input = [styles.input, { color: colors.text }];

  return (
    <Card tone={highlight ? 'highlight' : 'default'} style={styles.card}>
      <View style={styles.header}>
        <Text variant="caption" color="textMuted">
          {t('newComparison.priceN', { index })}
        </Text>
        {onRemove ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('newComparison.removePriceN', { index })}
            onPress={onRemove}
            hitSlop={8}
            style={styles.remove}
          >
            <Icon name={{ ios: 'trash', android: 'delete' }} color={colors.textMuted} size={20} />
          </Pressable>
        ) : null}
      </View>
      <View style={styles.fields}>
        <View style={[field(errors?.price), styles.priceField]}>
          <Text variant="body" color="textMuted" style={styles.prefix}>
            {currencySymbol}
          </Text>
          <TextInput
            value={price}
            onChangeText={onChangePrice}
            onBlur={onBlurPrice}
            accessibilityHint={errors?.price}
            placeholder={t('newComparison.pricePlaceholder')}
            placeholderTextColor={palette.neutral[500]}
            selectionColor={colors.accent}
            keyboardType="decimal-pad"
            accessibilityLabel={t('newComparison.priceN', { index })}
            style={input}
          />
        </View>
        <View style={[field(errors?.quantity), styles.quantityField]}>
          <TextInput
            value={quantity}
            onChangeText={onChangeQuantity}
            onBlur={onBlurQuantity}
            accessibilityHint={errors?.quantity}
            placeholder={t('newComparison.quantityShort')}
            placeholderTextColor={palette.neutral[500]}
            selectionColor={colors.accent}
            keyboardType="decimal-pad"
            accessibilityLabel={t('newComparison.quantityShort')}
            style={input}
          />
        </View>
      </View>
      {errors?.price ? <FieldError message={errors.price} /> : null}
      {errors?.quantity ? <FieldError message={errors.quantity} /> : null}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.pills}>
          {UNIT_OPTIONS.map((option) => (
            <Pill
              key={option.unit}
              label={option.label}
              selected={unit === option.unit}
              tone={highlight ? 'accent2' : 'accent'}
              onPress={() => onChangeUnit(option.unit)}
            />
          ))}
        </View>
      </ScrollView>
      {errors?.unit ? <FieldError message={errors.unit} /> : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: 12 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  // Fixed-size target (negative margin keeps the header height unchanged).
  remove: {
    width: MIN_TOUCH_TARGET,
    height: MIN_TOUCH_TARGET,
    marginVertical: -12,
    marginRight: -8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fields: { flexDirection: 'row', gap: 12 },
  field: {
    height: 56,
    paddingHorizontal: 24,
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  fieldError: { borderWidth: 2 },
  priceField: { flex: 6 },
  quantityField: { flex: 5 },
  prefix: { fontSize: 17 },
  input: { flex: 1, fontFamily: fontFamily.display, fontSize: 20, padding: 0 },
  pills: { flexDirection: 'row', gap: 8 },
});
