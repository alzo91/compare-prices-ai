import { compareEntries } from '@/business/service/compare.service';
import { roundCentsForDisplay } from '@/business/service/display.service';
import { pricePerBaseUnitOfEntry } from '@/business/service/price.service';
import { computeSavings } from '@/business/service/savings.service';
import type { ComparisonCardModel } from '@/components/organism/comparison-card';
import type { Comparison } from '@/models/Comparison';
import type { PriceEntry } from '@/models/PriceEntry';

// Distinct package sizes as typed, in input order ("250 g", "500 g").
function distinctSizes(entries: readonly PriceEntry[]) {
  const seen = new Set<string>();
  const sizes: { quantity: number; unit: PriceEntry['unit'] }[] = [];
  for (const { quantity, unit } of entries) {
    const key = `${quantity}|${unit}`;
    if (seen.has(key)) continue;
    seen.add(key);
    sizes.push({ quantity, unit });
  }
  return sizes;
}

// Maps a saved comparison to its Home card. Returns null when the entries cannot be compared
// (no entries, mixed measurement types, invalid numbers): such a card has no price to show.
export function buildComparisonCard(comparison: Comparison): ComparisonCardModel | null {
  const { entries } = comparison;
  if (entries.length === 0) return null;

  try {
    // A lone price has nothing to beat: it is its own best, with no savings line.
    const result = entries.length >= 2 ? compareEntries(entries) : null;
    const savings = result && computeSavings(entries, result);
    const bestId = result ? result.cheapestIds[0] : entries[0].id;
    const bestIndex = entries.findIndex((e) => e.id === bestId);
    const best = entries[bestIndex];
    const unitPrice = pricePerBaseUnitOfEntry(best);

    return {
      id: comparison.id,
      name: comparison.product.name,
      unitPriceCents: roundCentsForDisplay(unitPrice.centsPerBaseUnit, true),
      baseUnit: unitPrice.baseUnit,
      best: { quantity: best.quantity, unit: best.unit, priceCents: best.priceCents },
      pricesCount: entries.length,
      summary: savings
        ? { kind: 'savings', winnerRow: bestIndex + 1, savingsCents: savings.differenceCents }
        : { kind: 'packages', sizes: distinctSizes(entries) },
    };
  } catch {
    return null;
  }
}

export function buildComparisonCards(comparisons: readonly Comparison[]): ComparisonCardModel[] {
  return comparisons.flatMap((c) => buildComparisonCard(c) ?? []);
}
