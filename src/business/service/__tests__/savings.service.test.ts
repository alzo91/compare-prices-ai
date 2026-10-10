import type { PriceEntry } from '@/models/PriceEntry';
import type { Unit } from '@/models/Unit';

import { compareEntries } from '../compare.service';
import { computeSavings } from '../savings.service';

const entry = (id: string, priceCents: number, quantity: number, unit: Unit): PriceEntry => ({
  id,
  priceCents,
  quantity,
  unit,
});

describe('computeSavings', () => {
  it('reproduces "18% abaixo do 2º melhor — R$ 6,40 de diferença em 5 kg"', () => {
    const savings = computeSavings([
      entry('a', 3556, 5, 'kg'), // R$ 35,56 -> 711,20 / kg
      entry('b', 2916, 5, 'kg'), // R$ 29,16 -> 583,20 / kg
    ]);
    expect(savings).not.toBeNull();
    expect(Math.round(savings!.percentBelowSecondBest)).toBe(18);
    expect(savings!.differenceCents).toBe(640);
    expect(savings!.quantity).toBe(5);
    expect(savings!.unit).toBe('kg');
    expect(savings!.winnerId).toBe('b');
    expect(savings!.secondBestId).toBe('a');
  });

  it('2 entries: AGENTS.md example, 12 L @ R$50,00 vs 1 L @ R$4,59', () => {
    const savings = computeSavings([entry('A', 459, 1, 'L'), entry('B', 5000, 12, 'L')])!;
    // 12 L at 459 / L = 5508, minus 5000
    expect(savings.differenceCents).toBe(508);
    expect(savings.percentBelowSecondBest).toBeCloseTo((508 / 5508) * 100, 10);
    expect(savings.quantity).toBe(12);
    expect(savings.unit).toBe('L');
  });

  it('3+ entries: second best is the next cheapest, not the worst', () => {
    const savings = computeSavings([
      entry('worst', 1000, 1, 'kg'), // 1000 / kg
      entry('best', 400, 1, 'kg'), // 400 / kg
      entry('mid', 500, 1, 'kg'), // 500 / kg
    ])!;
    expect(savings.winnerId).toBe('best');
    expect(savings.secondBestId).toBe('mid');
    expect(savings.percentBelowSecondBest).toBeCloseTo(20, 10);
    expect(savings.differenceCents).toBe(100);
  });

  it('returns null on a tie for cheapest', () => {
    expect(
      computeSavings([
        entry('a', 1000, 1, 'kg'),
        entry('b', 500, 500, 'g'),
        entry('c', 3000, 2, 'kg'),
      ]),
    ).toBeNull();
  });

  it('a tie for 2nd place still yields savings for the single winner', () => {
    const savings = computeSavings([
      entry('w', 800, 1, 'L'),
      entry('x', 1000, 1, 'L'),
      entry('y', 1000, 1, 'L'),
    ])!;
    expect(savings.winnerId).toBe('w');
    expect(savings.secondBestId).toBe('x');
    expect(savings.percentBelowSecondBest).toBeCloseTo(20, 10);
  });

  it('mixed units: reports the winner in its own quantity and unit', () => {
    const savings = computeSavings([
      entry('kg', 2490, 5, 'kg'), // 498 / kg
      entry('g', 240, 500, 'g'), // 480 / kg
    ])!;
    expect(savings.winnerId).toBe('g');
    expect(savings.quantity).toBe(500);
    expect(savings.unit).toBe('g');
    // 0.5 kg at 498 / kg = 249, minus 240
    expect(savings.differenceCents).toBe(9);
    expect(savings.percentBelowSecondBest).toBeCloseTo((18 / 498) * 100, 10);
  });

  it('accepts a precomputed comparison', () => {
    const entries = [entry('a', 200, 1, 'm'), entry('b', 100, 1, 'm')];
    expect(computeSavings(entries, compareEntries(entries))).toEqual(computeSavings(entries));
  });
});
