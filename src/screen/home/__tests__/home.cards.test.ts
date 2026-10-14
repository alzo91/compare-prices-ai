import type { Comparison } from '@/models/Comparison';
import type { PriceEntry } from '@/models/PriceEntry';

import { buildComparisonCard, buildComparisonCards } from '../home.cards';

const entry = (id: string, priceCents: number, quantity: number, unit: PriceEntry['unit']) => ({
  id,
  priceCents,
  quantity,
  unit,
});

const comparison = (name: string, entries: PriceEntry[]): Comparison => ({
  id: `id-${name}`,
  product: { name },
  entries,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
});

describe('buildComparisonCard', () => {
  it('rounds the unit price to whole units when "Arredondar centavos" is on', () => {
    const c = comparison('Arroz', [entry('a', 2490, 5, 'kg'), entry('b', 3050, 5, 'kg')]);
    expect(buildComparisonCard(c, 'base', false)).toMatchObject({ unitPriceCents: 498 });
    expect(buildComparisonCard(c, 'base', false)?.wholeUnits).toBeUndefined();
    expect(buildComparisonCard(c, 'base', true)).toMatchObject({
      unitPriceCents: 500,
      wholeUnits: true,
      best: { priceCents: 2490 },
    });
  });

  it('builds the Designer rice card (R$ 4,98/kg, 5 kg for R$ 24,90)', () => {
    const card = buildComparisonCard(
      comparison('Arroz branco tipo 1', [
        entry('a', 2490, 5, 'kg'),
        entry('b', 3050, 5, 'kg'),
        entry('c', 360, 500, 'g'),
        entry('d', 3200, 5, 'kg'),
        entry('e', 2000, 3, 'kg'),
      ]),
    );
    expect(card).toMatchObject({
      id: 'id-Arroz branco tipo 1',
      name: 'Arroz branco tipo 1',
      priceQuantity: 1,
      priceUnit: 'kg',
      pricesCount: 5,
    });
  });

  it('shows the winner row, price per unit and savings against the 2nd best', () => {
    const card = buildComparisonCard(
      comparison('Arroz', [entry('a', 3050, 5, 'kg'), entry('b', 2490, 5, 'kg')]),
    );
    expect(card).toMatchObject({
      unitPriceCents: 498,
      best: { quantity: 5, unit: 'kg', priceCents: 2490 },
      summary: { kind: 'savings', winnerRow: 2, savingsCents: 560 },
    });
  });

  it('compares across units of the same type (500 g beats 1 kg)', () => {
    const card = buildComparisonCard(
      comparison('Café', [entry('a', 3500, 1, 'kg'), entry('b', 1595, 500, 'g')]),
    );
    expect(card).toMatchObject({
      unitPriceCents: 3190,
      best: { quantity: 500, unit: 'g', priceCents: 1595 },
    });
  });

  it('lists the distinct package sizes on a tie', () => {
    const card = buildComparisonCard(
      comparison('Café', [
        entry('a', 1000, 500, 'g'),
        entry('b', 500, 250, 'g'),
        entry('c', 1000, 500, 'g'),
      ]),
    );
    expect(card?.summary).toEqual({
      kind: 'packages',
      sizes: [
        { quantity: 500, unit: 'g' },
        { quantity: 250, unit: 'g' },
      ],
    });
    expect(card?.best).toEqual({ quantity: 500, unit: 'g', priceCents: 1000 });
  });

  it('handles a single price without savings', () => {
    const card = buildComparisonCard(comparison('Leite', [entry('a', 449, 1, 'L')]));
    expect(card).toMatchObject({
      unitPriceCents: 449,
      priceUnit: 'L',
      pricesCount: 1,
      summary: { kind: 'packages', sizes: [{ quantity: 1, unit: 'L' }] },
    });
  });

  it('returns null when there is nothing to show', () => {
    expect(buildComparisonCard(comparison('Vazio', []))).toBeNull();
    expect(
      buildComparisonCard(comparison('Misto', [entry('a', 100, 1, 'kg'), entry('b', 100, 1, 'L')])),
    ).toBeNull();
  });
});

describe('buildComparisonCard display basis', () => {
  const rice = comparison('Arroz', [entry('a', 3050, 5, 'kg'), entry('b', 2490, 5, 'kg')]);

  it('base (default): per kg', () => {
    expect(buildComparisonCard(rice)).toMatchObject({
      unitPriceCents: 498,
      priceQuantity: 1,
      priceUnit: 'kg',
    });
  });

  it('per100: per 100 g', () => {
    expect(buildComparisonCard(rice, 'per100')).toMatchObject({
      unitPriceCents: 50,
      priceQuantity: 100,
      priceUnit: 'g',
    });
  });

  it('unit: the best package price as entered', () => {
    expect(buildComparisonCard(rice, 'unit')).toMatchObject({
      unitPriceCents: 2490,
      priceQuantity: 5,
      priceUnit: 'kg',
    });
  });

  it('never changes the stored entries', () => {
    const before = JSON.stringify(rice);
    buildComparisonCard(rice, 'per100');
    expect(JSON.stringify(rice)).toBe(before);
  });
});

describe('buildComparisonCards', () => {
  it('keeps order and skips cards that cannot be built', () => {
    const cards = buildComparisonCards([
      comparison('A', [entry('a', 100, 1, 'kg')]),
      comparison('B', []),
      comparison('C', [entry('a', 100, 1, 'L')]),
    ]);
    expect(cards.map((c) => c.name)).toEqual(['A', 'C']);
  });
});
