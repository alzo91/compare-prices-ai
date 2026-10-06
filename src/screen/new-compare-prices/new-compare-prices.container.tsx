import { router } from 'expo-router';
import { useState } from 'react';

import { useFormat } from '@/i18n/format';
import { useI18n } from '@/i18n';
import type { Unit } from '@/models/Unit';

import { isFormValid } from './new-compare-prices.form';
import { NewComparePricesScene } from './new-compare-prices.scene';

type NewComparePricesContainerProps = {
  // Set when editing a saved comparison (compare/[id], Epic 6).
  comparisonId?: string;
};

const CURRENCY_SYMBOL = { 'pt-BR': 'R$', 'en-US': '$' } as const;

// Container: form state. Rows (4.3), result (4.4) and saving (4.6) come later.
export function NewComparePricesContainer({ comparisonId }: NewComparePricesContainerProps) {
  const { t } = useI18n();
  const { language } = useFormat();
  const title = comparisonId ? t('newComparison.editTitle') : t('newComparison.title');

  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState<Unit | null>('kg'); // kg preselected, as in the Designer

  // Will enable the Save button (task 4.6).
  const isValid = isFormValid({ productName, row: { price, quantity, unit } }, language);

  return (
    <NewComparePricesScene
      title={title}
      productName={productName}
      price={price}
      quantity={quantity}
      unit={unit}
      currencySymbol={CURRENCY_SYMBOL[language]}
      isValid={isValid}
      onChangeProductName={setProductName}
      onChangePrice={setPrice}
      onChangeQuantity={setQuantity}
      onChangeUnit={setUnit}
      onClose={() => router.back()}
    />
  );
}
