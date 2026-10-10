import type { PriceEntry } from '@/models/PriceEntry';
import type { Unit } from '@/models/Unit';

import { compareEntries, type ComparisonResult } from './compare.service';

export type Savings = {
  /** Id of the single winning entry. */
  winnerId: string;
  /** Id of the runner-up (the cheapest entry that is not the winner). */
  secondBestId: string;
  /**
   * How far the winner's unit price is below the 2nd best's, as a percentage of the 2nd best:
   * (second - winner) / second * 100. Always > 0. Not rounded; rounding is a display concern.
   */
  percentBelowSecondBest: number;
  /**
   * Whole cents saved by buying the winner's own quantity at the winner's price instead of
   * the 2nd best's unit price: winnerQty * (secondUnitPrice - winnerUnitPrice).
   * Rounded to integer cents (money stays in integer cents). Always >= 0.
   */
  differenceCents: number;
  /** The winner's quantity and unit as entered, for "... de diferença em 5 kg". */
  quantity: number;
  unit: Unit;
};

/**
 * Savings of the winner versus the 2nd-best unit price, for the text
 * "18% abaixo do 2º melhor — R$ 6,40 de diferença em 5 kg".
 *
 * Pass the same `entries` given to compareEntries; `comparison` may be passed to avoid
 * recomputing it (it is computed here when omitted, so it can throw like compareEntries).
 *
 * Returns null when there is no single winner (the cheapest price is tied): no one is
 * "below" anyone, so there are no savings to show. With 3+ entries the 2nd best is the next
 * cheapest unit price, not the most expensive one. When several entries share the 2nd-best
 * price, any of them gives the same numbers; the first in input order is reported.
 */
export function computeSavings(
  entries: readonly PriceEntry[],
  comparison: ComparisonResult = compareEntries(entries),
): Savings | null {
  if (comparison.winnerId === null) return null;

  const winner = comparison.rankings.find((r) => r.entryId === comparison.winnerId);
  if (!winner) return null;
  const winnerEntry = entries[winner.index];

  // Winner is unique, so every other ranking has a strictly higher unit price (rank >= 2).
  const second = comparison.rankings
    .filter((r) => r.entryId !== winner.entryId)
    .reduce((best, r) => (r.centsPerBaseUnit < best.centsPerBaseUnit ? r : best));

  const gap = second.centsPerBaseUnit - winner.centsPerBaseUnit;
  // Winner's quantity in base units = its price / its unit price, so no unit conversion repeats here.
  const winnerCostAtSecondPrice =
    (winnerEntry.priceCents / winner.centsPerBaseUnit) * second.centsPerBaseUnit;

  return {
    winnerId: winner.entryId,
    secondBestId: second.entryId,
    percentBelowSecondBest: (gap / second.centsPerBaseUnit) * 100,
    differenceCents: Math.round(winnerCostAtSecondPrice - winnerEntry.priceCents),
    quantity: winnerEntry.quantity,
    unit: winnerEntry.unit,
  };
}
