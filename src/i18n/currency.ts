import { CURRENCIES, type Currency, DEFAULT_SETTINGS, type Language } from '@/models/Settings';

// Pure currency helpers (no i18n / storage imports), so they can be unit-tested directly.

export function isCurrency(value: unknown): value is Currency {
  return typeof value === 'string' && (CURRENCIES as readonly string[]).includes(value);
}

// Unknown or corrupt stored values fall back to Real (R$).
export function toCurrency(value: unknown): Currency {
  return isCurrency(value) ? value : DEFAULT_SETTINGS.currency;
}

// Intl.NumberFormat is costly to build; reuse one per locale + options.
const cache = new Map<string, Intl.NumberFormat>();

export function numberFormatter(
  language: Language,
  options: Intl.NumberFormatOptions,
): Intl.NumberFormat {
  const key = `${language}|${JSON.stringify(options)}`;
  let instance = cache.get(key);
  if (!instance) {
    instance = new Intl.NumberFormat(language, options);
    cache.set(key, instance);
  }
  return instance;
}

// 24.9 → "R$ 24,90" (pt-BR, BRL) · "US$ 24,90" (pt-BR, USD) · "€24.90" (en-US, EUR).
export function formatMoney(
  value: number,
  currency: Currency,
  language: Language,
  options: Intl.NumberFormatOptions = {},
): string {
  return numberFormatter(language, { style: 'currency', currency, ...options }).format(value);
}

// Symbol shown in the price field: "R$", "US$" (pt-BR) / "$" (en-US), "€".
// Hermes on iOS has no NumberFormat.formatToParts, so strip the number out of format(0) instead.
export function currencySymbol(currency: Currency, language: Language): string {
  const formatted = numberFormatter(language, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(0);
  return formatted.replace(/[\d\s.,]/g, '') || currency;
}
