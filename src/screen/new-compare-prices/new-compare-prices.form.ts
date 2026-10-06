import { isRowValid, type RowDraft } from '@/business/service/input.service';
import type { Language } from '@/models/Settings';

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
