import type { Unit } from './Unit';

// One remembered price (S.2): what was paid for a product in a given unit.
export type PriceHistoryEntry = {
  productKey: string; // normalized product name, see priceHistoryKey()
  unit: Unit;
  priceCents: number;
  recordedAt: string; // ISO 8601
};

// Product names match case- and space-insensitively: "Leite " and "leite" share history.
export const priceHistoryKey = (productName: string): string =>
  productName.trim().replace(/\s+/g, ' ').toLocaleLowerCase();
