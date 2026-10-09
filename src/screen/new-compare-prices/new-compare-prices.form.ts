import { isRowValid, type RowDraft } from '@/business/service/input.service';
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
