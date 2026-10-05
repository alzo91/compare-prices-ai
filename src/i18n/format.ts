import { useTranslation } from 'react-i18next';

import type { Currency, Language } from '@/models/Settings';

import { getLanguage } from './index';

// Each language formats money in its own currency: R$ 1.234,56 (pt-BR) · $1,234.56 (en-US).
export const CURRENCY_BY_LANGUAGE: Record<Language, Currency | 'USD'> = {
  'pt-BR': 'BRL',
  'en-US': 'USD',
};

// Intl.NumberFormat is costly to build; reuse one per locale + options.
const cache = new Map<string, Intl.NumberFormat>();

function formatter(language: Language, options: Intl.NumberFormatOptions): Intl.NumberFormat {
  const key = `${language}|${JSON.stringify(options)}`;
  let instance = cache.get(key);
  if (!instance) {
    instance = new Intl.NumberFormat(language, options);
    cache.set(key, instance);
  }
  return instance;
}

// 1234.5 → "1.234,5" (pt-BR) · "1,234.5" (en-US).
export function formatNumber(
  value: number,
  options: Intl.NumberFormatOptions = {},
  language: Language = getLanguage(),
): string {
  return formatter(language, { maximumFractionDigits: 3, ...options }).format(value);
}

// 24.9 → "R$ 24,90" (pt-BR) · "$24.90" (en-US).
export function formatCurrency(
  value: number,
  options: Intl.NumberFormatOptions = {},
  language: Language = getLanguage(),
): string {
  return formatter(language, {
    style: 'currency',
    currency: CURRENCY_BY_LANGUAGE[language],
    ...options,
  }).format(value);
}

// Prices are stored in cents (PriceEntry.priceCents): 2490 → "R$ 24,90".
export function formatCents(
  cents: number,
  options: Intl.NumberFormatOptions = {},
  language: Language = getLanguage(),
): string {
  return formatCurrency(cents / 100, options, language);
}

// Hook variant: re-renders the component when the language changes.
export function useFormat() {
  useTranslation(); // subscribes to languageChanged
  const language = getLanguage();
  return {
    language,
    formatNumber: (value: number, options?: Intl.NumberFormatOptions) =>
      formatNumber(value, options, language),
    formatCurrency: (value: number, options?: Intl.NumberFormatOptions) =>
      formatCurrency(value, options, language),
    formatCents: (cents: number, options?: Intl.NumberFormatOptions) =>
      formatCents(cents, options, language),
  };
}
