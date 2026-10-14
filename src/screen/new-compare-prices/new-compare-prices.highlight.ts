import type { ResultCardModel } from './new-compare-prices.result';

export type RowHighlight = {
  // Tinted (sálvia) styling: every cheapest row, ties included.
  highlight: boolean;
  // The "Mais barato" badge: only when a single row wins (a tie has no single winner).
  cheapest: boolean;
};

// Highlight state of the row at `index` (1-based, as in ResultCardModel.cheapestRows).
export function rowHighlight(result: ResultCardModel | null, index: number): RowHighlight {
  const isCheapest = !!result && result.cheapestRows.includes(index);
  return { highlight: isCheapest, cheapest: isCheapest && result.cheapestRows.length === 1 };
}
