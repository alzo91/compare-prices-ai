// "Mostrar preço por": kg·L (base unit), 100 g / 100 mL, or per unit.
export type DisplayBasis = 'base' | 'per100' | 'unit';
// "Moeda" (7.3): a small list; prices are formatted with Intl in the chosen currency.
export const CURRENCIES = ['BRL', 'USD', 'EUR'] as const;
export type Currency = (typeof CURRENCIES)[number];
export type Language = 'pt-BR' | 'en-US';

export type Settings = {
  displayBasis: DisplayBasis;
  roundCents: boolean;
  keepPriceHistory: boolean;
  currency: Currency;
  language: Language;
};

// Defaults match the Ajustes Designer screen.
export const DEFAULT_SETTINGS: Settings = {
  displayBasis: 'base',
  roundCents: false,
  keepPriceHistory: true,
  currency: 'BRL',
  language: 'pt-BR',
};
