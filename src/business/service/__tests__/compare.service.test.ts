import type { PriceEntry } from '@/models/PriceEntry';
import type { Unit } from '@/models/Unit';

import { compareEntries, isSameUnitPrice, NotEnoughEntriesError } from '../compare.service';
import { InvalidPriceInputError } from '../price.service';
import { IncompatibleUnitsError } from '../unit.service';

const entry = (id: string, priceCents: number, quantity: number, unit: Unit): PriceEntry => ({
  id,
  priceCents,
  quantity,
  unit,
});

describe('compareEntries', () => {
  it('AGENTS.md example: 12 L @ R$50,00 beats 1 L @ R$4,59', () => {
    const result = compareEntries([entry('A', 459, 1, 'L'), entry('B', 5000, 12, 'L')]);
    expect(result.winnerId).toBe('B');
    expect(result.isTie).toBe(false);
    expect(result.baseUnit).toBe('L');
    expect(result.cheapestCentsPerBaseUnit).toBeCloseTo(416.6667, 3);
    expect(result.rankings.map((r) => r.rank)).toEqual([2, 1]);
  });

  it('works for 2 entries in either order', () => {
    expect(compareEntries([entry('a', 100, 1, 'kg'), entry('b', 300, 2, 'kg')]).winnerId).toBe('a');
    expect(compareEntries([entry('b', 300, 2, 'kg'), entry('a', 100, 1, 'kg')]).winnerId).toBe('a');
  });

  it('picks the winner across 3 mixed units (kg, kg, g)', () => {
    const result = compareEntries([
      entry('1', 2490, 5, 'kg'), // 498 / kg
      entry('2', 1000, 2, 'kg'), // 500 / kg
      entry('3', 240, 500, 'g'), // 480 / kg
    ]);
    expect(result.winnerId).toBe('3');
    expect(result.baseUnit).toBe('kg');
    expect(result.rankings.map((r) => r.rank)).toEqual([2, 3, 1]);
    expect(result.rankings[2].centsPerBaseUnit).toBe(480);
  });

  it('handles many rows (6)', () => {
    const entries = [5, 4, 3, 2, 1, 6].map((p, i) => entry(`r${i}`, p * 100, 1, 'L'));
    const result = compareEntries(entries);
    expect(result.winnerId).toBe('r4');
    expect(result.rankings).toHaveLength(6);
  });

  it('reports a tie across mixed units instead of picking a winner', () => {
    const result = compareEntries([
      entry('a', 1000, 1, 'kg'), // 1000 / kg
      entry('b', 500, 500, 'g'), // 1000 / kg
      entry('c', 3000, 2, 'kg'), // 1500 / kg
    ]);
    expect(result.isTie).toBe(true);
    expect(result.winnerId).toBeNull();
    expect(result.cheapestIds).toEqual(['a', 'b']);
    expect(result.rankings.map((r) => r.rank)).toEqual([1, 1, 2]);
    expect(result.rankings.map((r) => r.isCheapest)).toEqual([true, true, false]);
  });

  it('reports a full tie when every row is equal', () => {
    const result = compareEntries([
      entry('a', 100, 1, 'L'),
      entry('b', 200, 2, 'L'),
      entry('c', 100, 1000, 'mL'),
    ]);
    expect(result.cheapestIds).toEqual(['a', 'b', 'c']);
    expect(result.isTie).toBe(true);
  });

  it('is not fooled by floating-point noise', () => {
    // 30 / 0.3 and 10 / 0.1 differ by float noise only.
    const result = compareEntries([entry('a', 30, 0.3, 'kg'), entry('b', 10, 0.1, 'kg')]);
    expect(result.isTie).toBe(true);
  });

  it('does not tie genuinely different prices (1 cent apart on 1 kg)', () => {
    const result = compareEntries([entry('a', 1000, 1, 'kg'), entry('b', 1001, 1, 'kg')]);
    expect(result.isTie).toBe(false);
    expect(result.winnerId).toBe('a');
  });

  it('does not round before comparing', () => {
    // Both round to 333 cents/L, but b is genuinely cheaper.
    const result = compareEntries([entry('a', 1000, 3, 'L'), entry('b', 1000, 3.001, 'L')]);
    expect(result.winnerId).toBe('b');
  });

  it('works for length and volume units', () => {
    expect(compareEntries([entry('a', 300, 100, 'cm'), entry('b', 400, 1, 'm')]).winnerId).toBe(
      'a',
    );
    expect(compareEntries([entry('a', 500, 1, 'm3'), entry('b', 1, 1, 'mL')]).winnerId).toBe('a');
  });

  it('rejects mixing measurement types', () => {
    expect(() => compareEntries([entry('a', 100, 1, 'kg'), entry('b', 100, 1, 'L')])).toThrow(
      IncompatibleUnitsError,
    );
    expect(() =>
      compareEntries([entry('a', 100, 1, 'kg'), entry('b', 100, 1, 'g'), entry('c', 100, 1, 'm')]),
    ).toThrow(IncompatibleUnitsError);
  });

  it('rejects fewer than 2 entries', () => {
    expect(() => compareEntries([])).toThrow(NotEnoughEntriesError);
    expect(() => compareEntries([entry('a', 100, 1, 'kg')])).toThrow(NotEnoughEntriesError);
  });

  it('propagates invalid rows', () => {
    expect(() => compareEntries([entry('a', 100, 0, 'kg'), entry('b', 100, 1, 'kg')])).toThrow(
      InvalidPriceInputError,
    );
  });

  it('does not mutate the input', () => {
    const entries = [entry('a', 300, 1, 'kg'), entry('b', 100, 1, 'kg')];
    const copy = JSON.parse(JSON.stringify(entries));
    compareEntries(entries);
    expect(entries).toEqual(copy);
  });
});

describe('isSameUnitPrice', () => {
  it('is exact for equal values and tolerant of float noise only', () => {
    expect(isSameUnitPrice(0, 0)).toBe(true);
    expect(isSameUnitPrice(100, 100)).toBe(true);
    expect(isSameUnitPrice(30 / 0.3, 10 / 0.1)).toBe(true);
    expect(isSameUnitPrice(100, 100.01)).toBe(false);
  });
});
