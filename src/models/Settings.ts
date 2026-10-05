// "Mostrar preço por": kg·L (base unit), 100 g / 100 mL, or per unit.
export type DisplayBasis = 'base' | 'per100' | 'unit';
export type Currency = 'BRL';
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
