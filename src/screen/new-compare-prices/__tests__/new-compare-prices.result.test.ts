import type { PriceRowDraft } from '../new-compare-prices.form';
import { buildResultCard } from '../new-compare-prices.result';

const row = (
  id: string,
  price: string,
  quantity: string,
  unit: PriceRowDraft['unit'] = 'kg',
): PriceRowDraft => ({ id, price, quantity, unit });

describe('buildResultCard', () => {
  it('is hidden with no valid rows or only one', () => {
    expect(buildResultCard([row('a', '', ''), row('b', '', '')], 'pt-BR')).toBeNull();
    expect(buildResultCard([row('a', '24,90', '5'), row('b', '', '')], 'pt-BR')).toBeNull();
    expect(buildResultCard([row('a', '24,90', '5'), row('b', '12,20', '0')], 'pt-BR')).toBeNull();
    expect(
      buildResultCard([row('a', '24,90', '5'), row('b', '12,20', '2', null)], 'pt-BR'),
    ).toBeNull();
  });

  it('builds the Designer example (R$ 4,98/kg, winner 5 kg for R$ 24,90)', () => {
    const card = buildResultCard(
      [row('a', '24,90', '5'), row('b', '30,50', '5'), row('c', '3,60', '500', 'g')],
      'pt-BR',
    );
    expect(card).toMatchObject({
      priceCents: 498,
      priceQuantity: 1,
      priceUnit: 'kg',
      cheapestRows: [1],
      winner: { priceCents: 2490, quantity: 5, unit: 'kg' },
    });
    expect(card?.savings).toMatchObject({ quantity: 5, unit: 'kg' });
  });

  it('rounds the price to whole units when "Arredondar centavos" is on, display only', () => {
    const rows = [row('a', '24,90', '5'), row('b', '30,50', '5')];
    const off = buildResultCard(rows, 'pt-BR', 'base', false);
    expect(off?.priceCents).toBe(498);
    expect(off?.wholeUnits).toBeUndefined();
    const on = buildResultCard(rows, 'pt-BR', 'base', true);
    expect(on).toMatchObject({ priceCents: 500, wholeUnits: true });
    // Typed prices are untouched.
    expect(on?.winner?.priceCents).toBe(2490);
  });

  it('ignores an invalid row once 2 others are valid', () => {
    const card = buildResultCard(
      [row('a', '24,90', '5'), row('b', 'abc', '2'), row('c', '12,20', '1')],
      'pt-BR',
    );
    expect(card?.cheapestRows).toEqual([1]);
    expect(card?.priceCents).toBe(498);
  });

  it('numbers rows by form position', () => {
    const card = buildResultCard(
      [row('a', '', ''), row('b', '5', '1'), row('c', '4', '1')],
      'pt-BR',
    );
    expect(card?.cheapestRows).toEqual([3]);
  });

  it('converts units before comparing', () => {
    const card = buildResultCard([row('a', '10', '1'), row('b', '3', '500', 'g')], 'pt-BR');
    expect(card?.cheapestRows).toEqual([2]);
    expect(card?.priceCents).toBe(600);
    expect(card?.savings?.percent).toBe(40);
    expect(card?.savings?.differenceCents).toBe(200);
  });

  it('reports a tie without winner or savings', () => {
    const card = buildResultCard([row('a', '10', '1'), row('b', '5', '500', 'g')], 'pt-BR');
    expect(card?.cheapestRows).toEqual([1, 2]);
    expect(card?.winner).toBeNull();
    expect(card?.savings).toBeNull();
  });

  it('is hidden when measurement types are mixed', () => {
    expect(
      buildResultCard([row('a', '10', '1', 'kg'), row('b', '5', '1', 'L')], 'pt-BR'),
    ).toBeNull();
  });

  it('parses en-US input', () => {
    const card = buildResultCard([row('a', '24.90', '5'), row('b', '12.20', '1')], 'en-US');
    expect(card?.cheapestRows).toEqual([1]);
  });

  it('honors the display basis', () => {
    const rows = [row('a', '24,90', '5'), row('b', '30,50', '5')];
    expect(buildResultCard(rows, 'pt-BR', 'base')).toMatchObject({
      priceCents: 498,
      priceQuantity: 1,
      priceUnit: 'kg',
    });
    expect(buildResultCard(rows, 'pt-BR', 'per100')).toMatchObject({
      priceCents: 50,
      priceQuantity: 100,
      priceUnit: 'g',
    });
    expect(buildResultCard(rows, 'pt-BR', 'unit')).toMatchObject({
      priceCents: 2490,
      priceQuantity: 5,
      priceUnit: 'kg',
    });
  });
});
