import { ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { Card } from '@/components/atoms/card';
import { Pill } from '@/components/atoms/pill';
import { Text } from '@/components/atoms/text';
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
}: PriceRowProps) {
  const { colors, palette } = useTheme();
  const { t } = useI18n();

  const field = [styles.field, { backgroundColor: colors.background, borderColor: colors.divider }];
  const input = [styles.input, { color: colors.text }];

  return (
    <Card tone={highlight ? 'highlight' : 'default'} style={styles.card}>
      <Text variant="caption" color="textMuted">
        {t('newComparison.priceN', { index })}
      </Text>
      <View style={styles.fields}>
        <View style={[field, styles.priceField]}>
          <Text variant="body" color="textMuted" style={styles.prefix}>
            {currencySymbol}
          </Text>
          <TextInput
            value={price}
            onChangeText={onChangePrice}
            placeholder={t('newComparison.pricePlaceholder')}
            placeholderTextColor={palette.neutral[500]}
            selectionColor={colors.accent}
            keyboardType="decimal-pad"
            accessibilityLabel={t('newComparison.priceN', { index })}
            style={input}
          />
        </View>
        <View style={[field, styles.quantityField]}>
          <TextInput
            value={quantity}
            onChangeText={onChangeQuantity}
            placeholder={t('newComparison.quantityShort')}
            placeholderTextColor={palette.neutral[500]}
            selectionColor={colors.accent}
            keyboardType="decimal-pad"
            accessibilityLabel={t('newComparison.quantityShort')}
            style={input}
          />
        </View>
      </View>
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
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: 12 },
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
  priceField: { flex: 6 },
  quantityField: { flex: 5 },
  prefix: { fontSize: 17 },
  input: { flex: 1, fontFamily: fontFamily.display, fontSize: 20, padding: 0 },
  pills: { flexDirection: 'row', gap: 8 },
});
