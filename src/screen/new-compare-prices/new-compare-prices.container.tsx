import { router } from 'expo-router';
import { useState } from 'react';

import { useFormat } from '@/i18n/format';
import { useI18n } from '@/i18n';

import {
  addRow,
  canRemoveRow,
  createInitialRows,
  isFormValid,
  removeRow,
  updateRow,
} from './new-compare-prices.form';
import { buildResultCard } from './new-compare-prices.result';
import { NewComparePricesScene } from './new-compare-prices.scene';

type NewComparePricesContainerProps = {
  // Set when editing a saved comparison (compare/[id], Epic 6).
  comparisonId?: string;
};

const CURRENCY_SYMBOL = { 'pt-BR': 'R$', 'en-US': '$' } as const;

// Container: form state. Saving (4.6) comes later.
export function NewComparePricesContainer({ comparisonId }: NewComparePricesContainerProps) {
  const { t } = useI18n();
  const { language } = useFormat();
  const title = comparisonId ? t('newComparison.editTitle') : t('newComparison.title');

  const [productName, setProductName] = useState('');
  const [rowsState, setRowsState] = useState(createInitialRows);
  const rows = rowsState.rows.map((row) => ({
    ...row,
    removable: canRemoveRow(rowsState, row.id),
  }));

  // Recomputed on every render, i.e. on every keystroke or unit change.
  const result = buildResultCard(rowsState.rows, language);

  // Will enable the Save button (task 4.6).
  const isValid = isFormValid({ productName, row: rows[0] }, language);

  return (
    <NewComparePricesScene
      title={title}
      productName={productName}
      rows={rows}
      currencySymbol={CURRENCY_SYMBOL[language]}
      result={result}
      isValid={isValid}
      onChangeProductName={setProductName}
      onChangePrice={(id, price) => setRowsState((s) => updateRow(s, id, { price }))}
      onChangeQuantity={(id, quantity) => setRowsState((s) => updateRow(s, id, { quantity }))}
      onChangeUnit={(id, unit) => setRowsState((s) => updateRow(s, id, { unit }))}
      onAddRow={() => setRowsState(addRow)}
      onRemoveRow={(id) => setRowsState((s) => removeRow(s, id))}
      onClose={() => router.back()}
    />
  );
}
