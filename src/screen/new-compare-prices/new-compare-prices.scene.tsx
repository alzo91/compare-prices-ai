import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/atoms/icon';
import { Button } from '@/components/atoms/button';
import { PillInput } from '@/components/atoms/pill-input';
import { PriceRow } from '@/components/molecules/price-row';
import { useI18n } from '@/i18n';
import type { Unit } from '@/models/Unit';
import { useTheme } from '@/theme/useTheme';

import type { PriceRowDraft } from './new-compare-prices.form';
import { styles } from './new-compare-prices.layout';

// A form row plus whether it shows the remove control (rows 3+).
export type SceneRow = PriceRowDraft & { removable: boolean };

type NewComparePricesSceneProps = {
  title: string;
  productName: string;
  rows: SceneRow[];
  currencySymbol: string;
  // Product name and price row are valid; will enable Save (task 4.6).
  isValid: boolean;
  onChangeProductName: (text: string) => void;
  onChangePrice: (id: string, text: string) => void;
  onChangeQuantity: (id: string, text: string) => void;
  onChangeUnit: (id: string, unit: Unit) => void;
  onAddRow: () => void;
  onRemoveRow: (id: string) => void;
  onClose: () => void;
};

export function NewComparePricesScene({
  title,
  productName,
  rows,
  currencySymbol,
  onChangeProductName,
  onChangePrice,
  onChangeQuantity,
  onChangeUnit,
  onAddRow,
  onRemoveRow,
  onClose,
}: NewComparePricesSceneProps) {
  const { colors } = useTheme();
  const { t } = useI18n();
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('common.close')}
          onPress={onClose}
          style={[styles.close, { backgroundColor: colors.surface }]}
        >
          <Icon name={{ ios: 'xmark', android: 'close' }} color={colors.text} />
        </Pressable>
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      </View>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        <Text style={[styles.subtitle, { color: colors.text }]}>{t('newComparison.subtitle')}</Text>
        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.textMuted }]}>
            {t('newComparison.productLabel')}
          </Text>
          <PillInput
            value={productName}
            onChangeText={onChangeProductName}
            placeholder={t('newComparison.productPlaceholder')}
            accessibilityLabel={t('newComparison.productLabel')}
            autoCapitalize="sentences"
            returnKeyType="next"
          />
        </View>
        <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>
          {t('newComparison.pricesLabel')}
        </Text>
        {rows.map((row, i) => (
          <PriceRow
            key={row.id}
            index={i + 1}
            price={row.price}
            quantity={row.quantity}
            unit={row.unit}
            currencySymbol={currencySymbol}
            onChangePrice={(text) => onChangePrice(row.id, text)}
            onChangeQuantity={(text) => onChangeQuantity(row.id, text)}
            onChangeUnit={(unit) => onChangeUnit(row.id, unit)}
            onRemove={row.removable ? () => onRemoveRow(row.id) : undefined}
          />
        ))}
        <Button label={t('newComparison.addPrice')} onPress={onAddRow} />
      </ScrollView>
    </SafeAreaView>
  );
}
