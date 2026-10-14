import { suggestPrices } from '@/business/repository/price-history.suggestions';
import type { PriceSuggestion } from '@/components/molecules/price-row';
import { formatCents } from '@/i18n/format';
import type { PriceHistoryEntry } from '@/models/PriceHistory';
import type { Language } from '@/models/Settings';
import type { Unit } from '@/models/Unit';

// Cents -> price text as the user would type it: 459 -> "4,59" (pt-BR) / "4.59" (en-US).
export function centsToPriceText(cents: number, language: Language): string {
  const text = (cents / 100).toFixed(2);
  return language === 'pt-BR' ? text.replace('.', ',') : text;
}

// Suggestion chips for one price row (S.2): recent prices for the product in the row's unit.
// Empty when history is off, so nothing is offered then.
export function rowPriceSuggestions(
  history: readonly PriceHistoryEntry[],
  unit: Unit | null,
  language: Language,
  keepPriceHistory: boolean,
): PriceSuggestion[] {
  if (!keepPriceHistory) return [];
  return suggestPrices(history, unit).map((cents) => ({
    label: formatCents(cents, {}, language),
    value: centsToPriceText(cents, language),
  }));
}
