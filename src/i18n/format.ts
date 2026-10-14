import { useTranslation } from 'react-i18next';

import { type Currency, DEFAULT_SETTINGS, type Language } from '@/models/Settings';
import { useCurrency } from '@/store/useCurrency';

import { currencySymbol, formatMoney, numberFormatter } from './currency';
import { getLanguage } from './index';

// The language picks the number format (separators, symbol position); the "Moeda" setting (7.3)
// picks the currency: R$ 1.234,56 (pt-BR, BRL) · R$1,234.56 (en-US, BRL) · US$ 1.234,56 (pt-BR, USD).

// 1234.5 → "1.234,5" (pt-BR) · "1,234.5" (en-US).
export function formatNumber(
  value: number,
  options: Intl.NumberFormatOptions = {},
  language: Language = getLanguage(),
): string {
  return numberFormatter(language, { maximumFractionDigits: 3, ...options }).format(value);
}

// 24.9 → "R$ 24,90" (pt-BR, BRL) · "$24.90" (en-US, USD).
export function formatCurrency(
  value: number,
  options: Intl.NumberFormatOptions = {},
  language: Language = getLanguage(),
  currency: Currency = DEFAULT_SETTINGS.currency,
): string {
  return formatMoney(value, currency, language, options);
}

// Prices are stored in cents (PriceEntry.priceCents): 2490 → "R$ 24,90".
export function formatCents(
  cents: number,
  options: Intl.NumberFormatOptions = {},
  language: Language = getLanguage(),
  currency: Currency = DEFAULT_SETTINGS.currency,
): string {
  return formatCurrency(cents / 100, options, language, currency);
}

// Hook variant: re-renders the component when the language or the currency changes.
export function useFormat() {
  useTranslation(); // subscribes to languageChanged
  const currency = useCurrency();
  const language = getLanguage();
  return {
    language,
    currency,
    currencySymbol: currencySymbol(currency, language),
    formatNumber: (value: number, options?: Intl.NumberFormatOptions) =>
      formatNumber(value, options, language),
    formatCurrency: (value: number, options?: Intl.NumberFormatOptions) =>
      formatCurrency(value, options, language, currency),
    formatCents: (cents: number, options?: Intl.NumberFormatOptions) =>
      formatCents(cents, options, language, currency),
  };
}
