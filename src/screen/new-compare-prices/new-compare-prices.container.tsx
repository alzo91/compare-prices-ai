import { router } from 'expo-router';
import { useEffect, useState } from 'react';

import { comparisonRepository } from '@/business/repository';

import { useFormat } from '@/i18n/format';
import { useI18n } from '@/i18n';
import { useDisplayBasis } from '@/store/useDisplayBasis';
import { useRoundCents } from '@/store/useRoundCents';

import {
  fieldKey,
  hasMixedMeasurementTypes,
  NAME_KEY,
  productNameError,
  touch,
  visibleRowErrors,
  type Touched,
} from './new-compare-prices.errors';
import {
  addRow,
  buildComparisonInput,
  canRemoveRow,
  createInitialRows,
  removeRow,
  rowsFromComparison,
  updateRow,
} from './new-compare-prices.form';
import { ComparisonLoadStatus } from './comparison-load-status';
import { buildResultCard } from './new-compare-prices.result';
import { numberErrorKey, productNameErrorKey, unitErrorKey } from './new-compare-prices.messages';
import { NewComparePricesScene } from './new-compare-prices.scene';

type NewComparePricesContainerProps = {
  // Set when editing a saved comparison (compare/[id], Epic 6).
  comparisonId?: string;
};

const CURRENCY_SYMBOL = { 'pt-BR': 'R$', 'en-US': '$' } as const;

// Container: form state and saving through the repository.
export function NewComparePricesContainer({ comparisonId }: NewComparePricesContainerProps) {
  const { t } = useI18n();
  const { language } = useFormat();
  const basis = useDisplayBasis();
  const roundCents = useRoundCents();
  const title = comparisonId ? t('newComparison.editTitle') : t('newComparison.title');

  const [productName, setProductName] = useState('');
  const [rowsState, setRowsState] = useState(createInitialRows);
  // Edit mode (task 6.1): load the saved comparison once and pre-fill the form.
  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'notFound' | 'failed'>(
    comparisonId ? 'loading' : 'ready',
  );
  useEffect(() => {
    if (!comparisonId) return;
    let active = true;
    comparisonRepository
      .get(comparisonId)
      .then((saved) => {
        if (!active) return;
        if (!saved) {
          setLoadState('notFound');
          return;
        }
        setProductName(saved.product.name);
        setRowsState(rowsFromComparison(saved, language));
        setLoadState('ready');
      })
      .catch(() => {
        if (active) setLoadState('failed');
      });
    return () => {
      active = false;
    };
    // Once per id: a later language change must not overwrite the user's edits.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [comparisonId]);
  const [touched, setTouched] = useState<Touched>({});
  const rows = rowsState.rows.map((row) => {
    const e = visibleRowErrors(row.id, row, touched, language);
    return {
      ...row,
      removable: canRemoveRow(rowsState, row.id),
      errors: {
        price: e.price && t(numberErrorKey('price', e.price)),
        quantity: e.quantity && t(numberErrorKey('quantity', e.quantity)),
        unit: e.unit && t(unitErrorKey(e.unit)),
      },
    };
  });
  const nameReason = productNameError(productName, touched);

  // Recomputed on every render, i.e. on every keystroke or unit change.
  const result = buildResultCard(rowsState.rows, language, basis, roundCents);

  // Enables the Save button: null until the whole form is valid.
  const input = buildComparisonInput(productName, rowsState.rows, language);
  const isValid = input !== null;
  const [saving, setSaving] = useState(false);
  const [saveFailed, setSaveFailed] = useState(false);

  const onSave = async () => {
    if (!input || saving) return;
    setSaving(true);
    setSaveFailed(false);
    try {
      if (comparisonId) await comparisonRepository.update(comparisonId, input);
      else await comparisonRepository.create(input);
      router.back(); // back to Home
    } catch {
      setSaveFailed(true);
      setSaving(false);
    }
  };

  if (loadState !== 'ready') {
    return <ComparisonLoadStatus title={title} state={loadState} onClose={() => router.back()} />;
  }

  return (
    <NewComparePricesScene
      title={title}
      productName={productName}
      rows={rows}
      currencySymbol={CURRENCY_SYMBOL[language]}
      result={result}
      isValid={isValid && !saving}
      saveError={saveFailed ? t('newComparison.saveError') : undefined}
      onSave={onSave}
      productNameError={nameReason && t(productNameErrorKey(nameReason))}
      mixedUnits={hasMixedMeasurementTypes(rows)}
      onBlurProductName={() => setTouched((s) => touch(s, NAME_KEY))}
      onBlurPrice={(id) => setTouched((s) => touch(s, fieldKey(id, 'price')))}
      onBlurQuantity={(id) => setTouched((s) => touch(s, fieldKey(id, 'quantity')))}
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
