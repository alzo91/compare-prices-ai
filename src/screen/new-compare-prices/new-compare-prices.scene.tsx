import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/atoms/icon';
import { PillInput } from '@/components/atoms/pill-input';
import { PriceRow } from '@/components/molecules/price-row';
import { useI18n } from '@/i18n';
import type { Unit } from '@/models/Unit';
import { useTheme } from '@/theme/useTheme';

import { styles } from './new-compare-prices.layout';

type NewComparePricesSceneProps = {
  title: string;
  productName: string;
  price: string;
  quantity: string;
  unit: Unit | null;
  currencySymbol: string;
  // Product name and price row are valid; will enable Save (task 4.6).
  isValid: boolean;
  onChangeProductName: (text: string) => void;
  onChangePrice: (text: string) => void;
  onChangeQuantity: (text: string) => void;
  onChangeUnit: (unit: Unit) => void;
  onClose: () => void;
};

export function NewComparePricesScene({
  title,
  productName,
  price,
  quantity,
  unit,
  currencySymbol,
  onChangeProductName,
  onChangePrice,
  onChangeQuantity,
  onChangeUnit,
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
        <PriceRow
          index={1}
          price={price}
          quantity={quantity}
          unit={unit}
          currencySymbol={currencySymbol}
          onChangePrice={onChangePrice}
          onChangeQuantity={onChangeQuantity}
          onChangeUnit={onChangeUnit}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
