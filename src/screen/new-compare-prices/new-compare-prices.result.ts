import { compareEntries } from '@/business/service/compare.service';
import { roundCentsForDisplay } from '@/business/service/display.service';
import { validateRow } from '@/business/service/input.service';
import { computeSavings } from '@/business/service/savings.service';
import { getBaseUnit } from '@/business/service/unit.service';
import type { PriceEntry } from '@/models/PriceEntry';
import type { Language } from '@/models/Settings';
import type { Unit } from '@/models/Unit';

import type { PriceRowDraft } from './new-compare-prices.form';

// "18% abaixo do 2º melhor — R$ 6,40 de diferença em 5 kg", numbers only (text is i18n).
export type ResultSavings = {
  // Whole percent, as in the Designer ("18%").
  percent: number;
  differenceCents: number;
  quantity: number;
  unit: Unit;
};

export type ResultCardModel = {
  // Lowest price per base unit, in whole cents (R$ 4,98 / kg).
  centsPerBaseUnit: number;
  baseUnit: Unit;
  // 1-based position of every cheapest row; more than one means a tie.
  cheapestRows: number[];
  // The single winner's row as typed; null on a tie.
  winner: { priceCents: number; quantity: number; unit: Unit } | null;
  // Null on a tie (nobody is "below" anybody).
  savings: ResultSavings | null;
};

// Maps the form rows to the result card. Returns null (card hidden) until at least 2 rows are
// valid, and when the valid rows mix measurement types (the message for that is task 4.7).
export function buildResultCard(
  rows: readonly PriceRowDraft[],
  language: Language,
): ResultCardModel | null {
  const entries: PriceEntry[] = [];
  const rowNumbers = new Map<string, number>();
  rows.forEach((row, i) => {
    const validation = validateRow(row, language);
    if (!validation.valid) return; // incomplete or invalid rows are skipped, not fatal
    entries.push({
      id: row.id,
      priceCents: validation.priceCents,
      quantity: validation.quantity,
      unit: validation.unit,
    });
    rowNumbers.set(row.id, i + 1);
  });
  if (entries.length < 2) return null;

  try {
    const comparison = compareEntries(entries);
    const savings = computeSavings(entries, comparison);
    const winner = entries.find((e) => e.id === comparison.winnerId);
    return {
      centsPerBaseUnit: roundCentsForDisplay(comparison.cheapestCentsPerBaseUnit, true),
      baseUnit: getBaseUnit(entries[0].unit),
      cheapestRows: comparison.cheapestIds.map((id) => rowNumbers.get(id) as number),
      winner: winner
        ? { priceCents: winner.priceCents, quantity: winner.quantity, unit: winner.unit }
        : null,
      savings: savings && {
        percent: Math.round(savings.percentBelowSecondBest),
        differenceCents: savings.differenceCents,
        quantity: savings.quantity,
        unit: savings.unit,
      },
    };
  } catch {
    // IncompatibleUnitsError: mixed measurement types have no result.
    return null;
  }
}
