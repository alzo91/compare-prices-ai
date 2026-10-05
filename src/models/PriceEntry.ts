import type { Unit } from './Unit';

// One price row as the user typed it — never stored normalized.
export type PriceEntry = {
  id: string;
  priceCents: number; // R$ 24,90 → 2490
  quantity: number; // 5, 500, 0.75…
  unit: Unit;
};
