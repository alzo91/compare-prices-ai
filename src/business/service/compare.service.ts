import type { PriceEntry } from '@/models/PriceEntry';
import type { Unit } from '@/models/Unit';

import { IncompatibleUnitsError, areUnitsCompatible } from './unit.service';
import { pricePerBaseUnitOfEntry } from './price.service';

/**
 * Two unit prices tie when they differ by at most this fraction of the larger one.
 * Unit prices are floats (e.g. 30 / 0.3 vs 10 / 0.1), so exact equality would produce false
 * winners from rounding noise (~1e-16 relative). Genuinely different prices differ by at
 * least one cent over any plausible quantity, many orders of magnitude above 1e-9.
 */
export const TIE_RELATIVE_TOLERANCE = 1e-9;

/** Thrown when fewer than two entries are given: there is nothing to compare. */
export class NotEnoughEntriesError extends Error {
  readonly count: number;

  constructor(count: number) {
    super(`Need at least 2 entries to compare, got ${count}`);
    this.name = 'NotEnoughEntriesError';
    this.count = count;
  }
}

export type EntryRanking = {
  entryId: string;
  /** Position in the input array. */
  index: number;
  /** Cents per base unit (kg, L or m). Not rounded. */
  centsPerBaseUnit: number;
  /** 1 = cheapest. Entries that tie share the same rank. */
  rank: number;
  isCheapest: boolean;
};

export type ComparisonResult = {
  baseUnit: Unit;
  /** Same order as the input entries. */
  rankings: EntryRanking[];
  /** Ids of every entry sharing the lowest unit price (length > 1 means a tie). */
  cheapestIds: string[];
  /** True when two or more entries share the lowest unit price. */
  isTie: boolean;
  /** The single winner, or null when the cheapest price is tied. */
  winnerId: string | null;
  cheapestCentsPerBaseUnit: number;
};

/** True when two unit prices are equal within TIE_RELATIVE_TOLERANCE. */
export function isSameUnitPrice(a: number, b: number): boolean {
  return Math.abs(a - b) <= TIE_RELATIVE_TOLERANCE * Math.max(Math.abs(a), Math.abs(b));
}

/**
 * Finds the cheapest entry among 2 or more, comparing price per base unit (no rounding).
 * Throws NotEnoughEntriesError for fewer than 2 entries, IncompatibleUnitsError when
 * measurement types are mixed (e.g. kg with L), and InvalidPriceInputError for a bad row.
 */
export function compareEntries(entries: readonly PriceEntry[]): ComparisonResult {
  if (entries.length < 2) throw new NotEnoughEntriesError(entries.length);

  const first = entries[0];
  for (const entry of entries) {
    if (!areUnitsCompatible(first.unit, entry.unit)) {
      throw new IncompatibleUnitsError(first.unit, entry.unit);
    }
  }

  const unitPrices = entries.map(pricePerBaseUnitOfEntry);
  const prices = unitPrices.map((p) => p.centsPerBaseUnit);
  const lowest = Math.min(...prices);

  // Rank over sorted prices; a price within tolerance of the previous distinct one shares its rank.
  const sorted = [...prices].sort((a, b) => a - b);
  const groups: { price: number; rank: number }[] = [];
  for (const price of sorted) {
    const last = groups[groups.length - 1];
    if (!last || !isSameUnitPrice(last.price, price)) {
      groups.push({ price, rank: groups.length + 1 });
    }
  }
  const rankOf = (price: number): number =>
    (groups.find((g) => isSameUnitPrice(g.price, price)) ?? groups[groups.length - 1]).rank;

  const rankings: EntryRanking[] = entries.map((entry, index) => ({
    entryId: entry.id,
    index,
    centsPerBaseUnit: prices[index],
    rank: rankOf(prices[index]),
    isCheapest: isSameUnitPrice(prices[index], lowest),
  }));
  const cheapestIds = rankings.filter((r) => r.isCheapest).map((r) => r.entryId);

  return {
    baseUnit: unitPrices[0].baseUnit,
    rankings,
    cheapestIds,
    isTie: cheapestIds.length > 1,
    winnerId: cheapestIds.length === 1 ? cheapestIds[0] : null,
    cheapestCentsPerBaseUnit: lowest,
  };
}
