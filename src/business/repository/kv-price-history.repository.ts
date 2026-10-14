import { priceHistoryKey, type PriceHistoryEntry } from '@/models/PriceHistory';
import type { Unit } from '@/models/Unit';

import { suggestPrices } from './price-history.suggestions';
import type { PriceHistoryRecord, PriceHistoryRepository } from './price-history.repository';
import type { KeyValueStorage } from './storage/key-value-storage';

// One JSON document, like comparisons. clearAllData (S.1) wipes it with the rest of the storage.
export const PRICE_HISTORY_KEY = 'priceHistory.v1';

// Keeps the document small: only the most recent prices per product + unit are kept.
export const MAX_PRICES_PER_PRODUCT_UNIT = 10;

type Options = { now?: () => Date };

const isSame = (a: PriceHistoryEntry, b: PriceHistoryEntry) =>
  a.productKey === b.productKey && a.unit === b.unit && a.priceCents === b.priceCents;

export class KeyValuePriceHistoryRepository implements PriceHistoryRepository {
  private readonly now: () => Date;

  constructor(
    private readonly storage: KeyValueStorage,
    options: Options = {},
  ) {
    this.now = options.now ?? (() => new Date());
  }

  async record(productName: string, prices: readonly PriceHistoryRecord[]) {
    const productKey = priceHistoryKey(productName);
    if (!productKey || prices.length === 0) return;
    const recordedAt = this.now().toISOString();
    const fresh: PriceHistoryEntry[] = [];
    for (const { priceCents, unit } of prices) {
      const entry = { productKey, unit, priceCents, recordedAt };
      if (!fresh.some((f) => isSame(f, entry))) fresh.push(entry);
    }
    // Newest first; older copies of the same product + unit + price are dropped.
    const kept = this.read().filter((old) => !fresh.some((f) => isSame(f, old)));
    this.write(capPerProductUnit([...fresh, ...kept]));
  }

  async suggestions(productName: string, unit: Unit, limit?: number) {
    return suggestPrices(await this.listForProduct(productName), unit, limit);
  }

  async listForProduct(productName: string) {
    const productKey = priceHistoryKey(productName);
    if (!productKey) return [];
    // Stable sort on a newest-first list: same-timestamp entries keep their order.
    return this.read()
      .filter((e) => e.productKey === productKey)
      .sort((a, b) => b.recordedAt.localeCompare(a.recordedAt));
  }

  async clear() {
    this.storage.remove(PRICE_HISTORY_KEY);
  }

  // History is a convenience: unreadable data counts as empty and is replaced on the next record.
  private read(): PriceHistoryEntry[] {
    const raw = this.storage.getString(PRICE_HISTORY_KEY);
    if (!raw) return [];
    try {
      const parsed: unknown = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as PriceHistoryEntry[]) : [];
    } catch {
      return [];
    }
  }

  private write(entries: PriceHistoryEntry[]) {
    this.storage.set(PRICE_HISTORY_KEY, JSON.stringify(entries));
  }
}

// Expects newest first; keeps the first MAX_PRICES_PER_PRODUCT_UNIT of each product + unit.
function capPerProductUnit(entries: PriceHistoryEntry[]): PriceHistoryEntry[] {
  const counts = new Map<string, number>();
  return entries.filter((e) => {
    const key = `${e.productKey}|${e.unit}`;
    const n = (counts.get(key) ?? 0) + 1;
    counts.set(key, n);
    return n <= MAX_PRICES_PER_PRODUCT_UNIT;
  });
}
