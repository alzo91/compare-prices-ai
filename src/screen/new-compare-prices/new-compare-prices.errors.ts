import {
  validateRow,
  type NumberInvalidReason,
  type RowDraft,
  type UnitInvalidReason,
} from '@/business/service/input.service';
import { getMeasurementType } from '@/business/service/unit.service';
import type { Language } from '@/models/Settings';
import type { Unit } from '@/models/Unit';

// Field-level validation display (task 4.7). Pure: the container passes the results to the UI,
// which translates the reason codes (see `validation.*` in the locales).

// Fields the user has interacted with. Errors only show for these, so an untouched form is quiet.
export type Touched = Readonly<Record<string, true>>;

export const NAME_KEY = 'name';
export const fieldKey = (rowId: string, field: 'price' | 'quantity'): string => `${rowId}.${field}`;

export const touch = (touched: Touched, key: string): Touched =>
  touched[key] ? touched : { ...touched, [key]: true };

// "Show everything": for the Save press (task 4.6) when the form is invalid.
export function touchAll(rowIds: readonly string[]): Touched {
  const all: Record<string, true> = { [NAME_KEY]: true };
  for (const id of rowIds) {
    all[fieldKey(id, 'price')] = true;
    all[fieldKey(id, 'quantity')] = true;
  }
  return all;
}

export type ProductNameInvalidReason = 'empty';

export function validateProductName(name: string): ProductNameInvalidReason | undefined {
  return name.trim().length === 0 ? 'empty' : undefined;
}

export function productNameError(
  name: string,
  touched: Touched,
): ProductNameInvalidReason | undefined {
  return touched[NAME_KEY] ? validateProductName(name) : undefined;
}

export type VisibleRowErrors = {
  price?: NumberInvalidReason;
  quantity?: NumberInvalidReason;
  unit?: UnitInvalidReason;
};

// Reason codes to show for one row. The unit has no "touched" state: it is picked from pills,
// so it only shows an error once the row has been touched elsewhere.
export function visibleRowErrors(
  rowId: string,
  row: RowDraft,
  touched: Touched,
  language: Language,
): VisibleRowErrors {
  const result = validateRow(row, language);
  if (result.valid) return {};
  const { price, quantity, unit } = result.errors;
  const priceTouched = touched[fieldKey(rowId, 'price')];
  const quantityTouched = touched[fieldKey(rowId, 'quantity')];
  const errors: VisibleRowErrors = {};
  if (price && priceTouched) errors.price = price;
  if (quantity && quantityTouched) errors.quantity = quantity;
  if (unit && (priceTouched || quantityTouched)) errors.unit = unit;
  return errors;
}

// True when the rows' selected units belong to more than one measurement type (kg vs L...).
// Such rows cannot be compared, so the screen shows a message instead of a result.
export function hasMixedMeasurementTypes(rows: readonly { unit: Unit | null }[]): boolean {
  const types = new Set(rows.flatMap((r) => (r.unit ? [getMeasurementType(r.unit)] : [])));
  return types.size > 1;
}
