import { rowHighlight } from '../new-compare-prices.highlight';
import type { ResultCardModel } from '../new-compare-prices.result';

const model = (cheapestRows: number[]): ResultCardModel => ({
  priceCents: 100,
  priceQuantity: 1,
  priceUnit: 'kg',
  cheapestRows,
  winner: null,
  savings: null,
});

describe('rowHighlight', () => {
  it('has no highlight without a result', () => {
    expect(rowHighlight(null, 1)).toEqual({ highlight: false, cheapest: false });
  });

  it('tints and badges the single winner only', () => {
    const result = model([2]);
    expect(rowHighlight(result, 1)).toEqual({ highlight: false, cheapest: false });
    expect(rowHighlight(result, 2)).toEqual({ highlight: true, cheapest: true });
  });

  it('tints every tied row but shows no badge', () => {
    const result = model([1, 3]);
    expect(rowHighlight(result, 1)).toEqual({ highlight: true, cheapest: false });
    expect(rowHighlight(result, 2)).toEqual({ highlight: false, cheapest: false });
    expect(rowHighlight(result, 3)).toEqual({ highlight: true, cheapest: false });
  });
});
