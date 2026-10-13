import type { PriceEntry } from '@/models/PriceEntry';
import type { Language } from '@/models/Settings';

import { compareEntries, NotEnoughEntriesError } from '../compare.service';
import { priceForDisplay, roundCentsForDisplay } from '../display.service';
import { validateRow, type RowDraft } from '../input.service';
import { InvalidPriceInputError, pricePerBaseUnit } from '../price.service';
import { computeSavings } from '../savings.service';
import { IncompatibleUnitsError } from '../unit.service';

// Typed rows -> validation -> comparison -> savings, the way the screen uses the engine.
function run(rows: RowDraft[], language: Language = 'pt-BR') {
  const entries: PriceEntry[] = rows.map((row, i) => {
    const v = validateRow(row, language);
    if (!v.valid) throw new Error(`row ${i} invalid`);
    return { id: `r${i}`, priceCents: v.priceCents, quantity: v.quantity, unit: v.unit };
  });
  const comparison = compareEntries(entries);
  return { entries, comparison, savings: computeSavings(entries, comparison) };
}

const e = (id: string, priceCents: number, quantity: number, unit: PriceEntry['unit']) => ({
  id,
  priceCents,
  quantity,
  unit,
});

describe('worked examples end to end', () => {
  it('AGENTS.md: Milk 1 L @ R$4,59 vs 12 L @ R$50,00 -> item B wins', () => {
    const { comparison, savings } = run([
      { price: '4,59', quantity: '1', unit: 'L' },
      { price: '50,00', quantity: '12', unit: 'L' },
    ]);
    expect(comparison.winnerId).toBe('r1');
    expect(comparison.isTie).toBe(false);
    expect(comparison.baseUnit).toBe('L');
    expect(roundCentsForDisplay(comparison.cheapestCentsPerBaseUnit, true)).toBe(417);
    expect(savings?.differenceCents).toBe(508);
    expect(savings?.unit).toBe('L');
    expect(savings?.quantity).toBe(12);
  });

  it('Designer: 5 kg @ R$24,90 vs 5 kg @ R$35,56 -> R$4,98/kg wins', () => {
    const { comparison, entries } = run([
      { price: '24,90', quantity: '5', unit: 'kg' },
      { price: '35,56', quantity: '5', unit: 'kg' },
    ]);
    expect(comparison.winnerId).toBe('r0');
    expect(priceForDisplay(entries[0], 'base')).toEqual({
      kind: 'measure',
      cents: 498,
      quantity: 1,
      unit: 'kg',
    });
  });

  it('cross-unit: 500 g @ R$10,00 vs 1 kg @ R$25,00 -> the 500 g pack wins', () => {
    const { comparison, savings } = run([
      { price: '10,00', quantity: '500', unit: 'g' },
      { price: '25,00', quantity: '1', unit: 'kg' },
    ]);
    expect(comparison.winnerId).toBe('r0');
    expect(savings?.percentBelowSecondBest).toBeCloseTo(20, 10);
  });

  it('typing the AGENTS.md example in en-US gives the same entries', () => {
    const pt = run([
      { price: '4,59', quantity: '1', unit: 'L' },
      { price: '50,00', quantity: '12', unit: 'L' },
    ]);
    const en = run(
      [
        { price: '$4.59', quantity: '1', unit: 'L' },
        { price: '$50.00', quantity: '12', unit: 'L' },
      ],
      'en-US',
    );
    expect(en.entries).toEqual(pt.entries);
  });
});

describe('engine edge cases', () => {
  it('single price: refuses to compare', () => {
    expect(() => compareEntries([e('a', 100, 1, 'kg')])).toThrow(NotEnoughEntriesError);
  });

  it('mixed measurement types: refuses to compare', () => {
    expect(() => compareEntries([e('a', 100, 1, 'L'), e('b', 100, 1, 'm')])).toThrow(
      IncompatibleUnitsError,
    );
    expect(() => compareEntries([e('a', 100, 1, 'mg'), e('b', 100, 1, 'mL')])).toThrow(
      IncompatibleUnitsError,
    );
  });

  it.each([NaN, -1, 0, Infinity, -Infinity])('rejects quantity %s in a comparison', (q) => {
    expect(() => compareEntries([e('a', 100, q, 'kg'), e('b', 100, 1, 'kg')])).toThrow(
      InvalidPriceInputError,
    );
  });

  it.each([NaN, -1, Infinity])('rejects price %s in a comparison', (p) => {
    expect(() => compareEntries([e('a', p, 1, 'kg'), e('b', 100, 1, 'kg')])).toThrow(
      InvalidPriceInputError,
    );
  });

  it('a free item (price 0) is the sole winner with 100% savings', () => {
    const entries = [e('free', 0, 1, 'kg'), e('paid', 500, 1, 'kg')];
    const comparison = compareEntries(entries);
    expect(comparison.winnerId).toBe('free');
    expect(computeSavings(entries, comparison)?.percentBelowSecondBest).toBe(100);
  });

  it('two free items tie', () => {
    expect(compareEntries([e('a', 0, 1, 'kg'), e('b', 0, 3, 'kg')]).isTie).toBe(true);
  });

  it('ties across every volume unit (m3, L, mL)', () => {
    const result = compareEntries([
      e('a', 1_000_000, 1, 'm3'), // 1000 / L
      e('b', 1000, 1, 'L'),
      e('c', 1, 1, 'mL'),
    ]);
    expect(result.cheapestIds).toEqual(['a', 'b', 'c']);
    expect(result.winnerId).toBeNull();
  });

  it('mixes mg and kg and km and mm correctly', () => {
    expect(compareEntries([e('mg', 1, 1, 'mg'), e('kg', 1, 1, 'kg')]).winnerId).toBe('kg');
    expect(compareEntries([e('km', 1, 1, 'km'), e('mm', 1, 1, 'mm')]).winnerId).toBe('km');
  });

  it('uses dense ranks with several tie groups', () => {
    const result = compareEntries([
      e('a', 300, 1, 'L'),
      e('b', 100, 1, 'L'),
      e('c', 300, 1000, 'mL'),
      e('d', 200, 1, 'L'),
      e('e', 100, 1000, 'mL'),
    ]);
    // c: 300 per 1000 mL = 300 / L, ties with a
    expect(result.rankings.map((r) => r.rank)).toEqual([3, 1, 3, 2, 1]);
    expect(result.cheapestIds).toEqual(['b', 'e']);
  });

  it('pricePerBaseUnit is not rounded', () => {
    const { centsPerBaseUnit } = pricePerBaseUnit(100, 3, 'L');
    expect(centsPerBaseUnit).toBeCloseTo(33.3333333, 6);
    expect(centsPerBaseUnit).not.toBe(33);
  });

  it('savings differenceCents is a whole number of cents', () => {
    const entries = [e('a', 100, 3, 'L'), e('b', 99, 3, 'L')];
    expect(Number.isInteger(computeSavings(entries)!.differenceCents)).toBe(true);
  });

  it('savings propagates comparison errors when no comparison is passed', () => {
    expect(() => computeSavings([e('a', 1, 1, 'kg'), e('b', 1, 1, 'L')])).toThrow(
      IncompatibleUnitsError,
    );
    expect(() => computeSavings([e('a', 1, 1, 'kg')])).toThrow(NotEnoughEntriesError);
  });
});

describe('roundCentsForDisplay edge cases', () => {
  it('handles zero and zero extra digits', () => {
    expect(roundCentsForDisplay(0, true)).toBe(0);
    expect(roundCentsForDisplay(0, false)).toBe(0);
    expect(roundCentsForDisplay(416.666, false, 0)).toBe(417);
  });

  it('rounds .5 up and leaves exact values alone', () => {
    expect(roundCentsForDisplay(0.5, true)).toBe(1);
    expect(roundCentsForDisplay(1234.56, false)).toBe(1234.56);
  });
});
