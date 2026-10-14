import type { PriceHistoryEntry } from '@/models/PriceHistory';
import type { Unit } from '@/models/Unit';

export type PriceHistoryRecord = { priceCents: number; unit: Unit };

// Prices the user already entered, offered back as input suggestions (S.2).
// Whether to record is the caller's decision (Settings.keepPriceHistory): see recordPriceHistory.
export interface PriceHistoryRepository {
  // Remembers each price for productName + unit. Re-recording a known price only refreshes it.
  record(productName: string, prices: readonly PriceHistoryRecord[]): Promise<void>;
  // Distinct prices for productName + unit, most recent first.
  suggestions(productName: string, unit: Unit, limit?: number): Promise<number[]>;
  // Every entry for productName (any unit), most recent first.
  listForProduct(productName: string): Promise<PriceHistoryEntry[]>;
  clear(): Promise<void>;
}
