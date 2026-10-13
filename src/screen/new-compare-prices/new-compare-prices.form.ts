import { isRowValid, validateRow, type RowDraft } from '@/business/service/input.service';
import { getMeasurementType } from '@/business/service/unit.service';
import type { Comparison, ComparisonInput } from '@/models/Comparison';
import type { PriceEntry } from '@/models/PriceEntry';
import type { Language } from '@/models/Settings';
import type { Unit } from '@/models/Unit';

export type FormState = {
  productName: string;
  row: RowDraft;
};

// The product name is required: blank or whitespace-only does not count.
export const isProductNameValid = (name: string): boolean => name.trim().length > 0;

// Validity flag for the Save button (task 4.6): product name plus a valid price row.
export function isFormValid(form: FormState, language: Language): boolean {
  return isProductNameValid(form.productName) && isRowValid(form.row, language);
}

// ---- Price rows (task 4.3) ----

export const INITIAL_ROW_COUNT = 2;
// The first two rows are the minimum comparison and cannot be removed.
export const MIN_ROW_COUNT = 2;

export type PriceRowDraft = {
  // Stable across add/remove, so React keeps each row's state.
  id: string;
  price: string;
  quantity: string;
  unit: Unit | null;
};

export type RowsState = {
  rows: PriceRowDraft[];
  // Monotonic counter: ids are never reused after a removal.
  nextId: number;
};

const newRow = (n: number): PriceRowDraft => ({
  id: `row-${n}`,
  price: '',
  quantity: '',
  unit: 'kg', // kg preselected, as in the Designer
});

export function createInitialRows(): RowsState {
  return {
    rows: Array.from({ length: INITIAL_ROW_COUNT }, (_, i) => newRow(i + 1)),
    nextId: INITIAL_ROW_COUNT + 1,
  };
}

export function addRow(state: RowsState): RowsState {
  return { rows: [...state.rows, newRow(state.nextId)], nextId: state.nextId + 1 };
}

// Only rows at position 3+ (index >= MIN_ROW_COUNT) can be removed.
export function canRemoveRow(state: RowsState, id: string): boolean {
  return state.rows.findIndex((row) => row.id === id) >= MIN_ROW_COUNT;
}

export function removeRow(state: RowsState, id: string): RowsState {
  return canRemoveRow(state, id)
    ? { ...state, rows: state.rows.filter((row) => row.id !== id) }
    : state;
}

export function updateRow(
  state: RowsState,
  id: string,
  patch: Partial<Pick<PriceRowDraft, 'price' | 'quantity' | 'unit'>>,
): RowsState {
  return { ...state, rows: state.rows.map((row) => (row.id === id ? { ...row, ...patch } : row)) };
}

// ---- Save (task 4.6) ----

// What the repository stores, or null while the form is not saveable: the product name is set,
// every row is valid (price, quantity, unit) and all units share one measurement type.
// Prices are stored as typed (never normalized); the repository owns id and timestamps.
export function buildComparisonInput(
  productName: string,
  rows: readonly PriceRowDraft[],
  language: Language,
): ComparisonInput | null {
  if (!isProductNameValid(productName) || rows.length < MIN_ROW_COUNT) return null;
  const entries: PriceEntry[] = [];
  for (const row of rows) {
    const v = validateRow(row, language);
    if (!v.valid) return null;
    entries.push({ id: row.id, priceCents: v.priceCents, quantity: v.quantity, unit: v.unit });
  }
  if (new Set(entries.map((e) => getMeasurementType(e.unit))).size > 1) return null;
  return { product: { name: productName.trim() }, entries };
}

// ---- Detail / edit (task 6.1) ----

// Text as the user would type it: the language's decimal mark, no thousands groups.
const withDecimalMark = (text: string, language: Language): string =>
  language === 'pt-BR' ? text.replace('.', ',') : text;

// Saved comparison -> form rows. Entry ids are kept, and nextId moves past every "row-N" id
// so rows added while editing never collide with a saved one.
export function rowsFromComparison(comparison: Comparison, language: Language): RowsState {
  const rows: PriceRowDraft[] = comparison.entries.map((entry) => ({
    id: entry.id,
    price: withDecimalMark((entry.priceCents / 100).toFixed(2), language),
    quantity: withDecimalMark(String(entry.quantity), language),
    unit: entry.unit,
  }));
  const used = rows.map((row) => Number(/^row-(\d+)$/.exec(row.id)?.[1] ?? 0));
  return { rows, nextId: Math.max(rows.length, ...used) + 1 };
}
