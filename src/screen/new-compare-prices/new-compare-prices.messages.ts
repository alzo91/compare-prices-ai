import type { NumberInvalidReason, UnitInvalidReason } from '@/business/service/input.service';

import type { ProductNameInvalidReason } from './new-compare-prices.errors';

// Reason code (input.service, task 3.5) -> i18n key under `validation.*`.
export type ValidationKey =
  | 'validation.productEmpty'
  | 'validation.priceEmpty'
  | 'validation.quantityEmpty'
  | 'validation.notANumber'
  | 'validation.zero'
  | 'validation.negative'
  | 'validation.unitEmpty';

const NUMBER_KEYS: Record<Exclude<NumberInvalidReason, 'empty'>, ValidationKey> = {
  not_a_number: 'validation.notANumber',
  zero: 'validation.zero',
  negative: 'validation.negative',
};

export function numberErrorKey(
  field: 'price' | 'quantity',
  reason: NumberInvalidReason,
): ValidationKey {
  if (reason === 'empty') {
    return field === 'price' ? 'validation.priceEmpty' : 'validation.quantityEmpty';
  }
  return NUMBER_KEYS[reason];
}

export const productNameErrorKey = (_reason: ProductNameInvalidReason): ValidationKey =>
  'validation.productEmpty';

export const unitErrorKey = (_reason: UnitInvalidReason): ValidationKey => 'validation.unitEmpty';
