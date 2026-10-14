import type { PriceHistoryEntry } from '@/models/PriceHistory';
import type { Unit } from '@/models/Unit';

import type { PriceHistoryRecord, PriceHistoryRepository } from './price-history.repository';

// How many suggestion chips a price row shows.
export const DEFAULT_SUGGESTION_LIMIT = 3;

// Distinct prices for one unit, most recent first. Entries must already be newest first.
export function suggestPrices(
  entries: readonly PriceHistoryEntry[],
  unit: Unit | null,
  limit: number = DEFAULT_SUGGESTION_LIMIT,
): number[] {
  if (!unit) return [];
  const prices: number[] = [];
  for (const entry of entries) {
    if (prices.length >= limit) break;
    if (entry.unit === unit && !prices.includes(entry.priceCents)) prices.push(entry.priceCents);
  }
  return prices;
}

// The on/off rule (S.2): with "Manter histórico de preços" off nothing new is stored, and the
// existing history is left as it is (only "Apagar todos os dados" removes it).
export async function recordPriceHistory(
  repository: PriceHistoryRepository,
  keepPriceHistory: boolean,
  productName: string,
  prices: readonly PriceHistoryRecord[],
): Promise<boolean> {
  if (!keepPriceHistory) return false;
  await repository.record(productName, prices);
  return true;
}
