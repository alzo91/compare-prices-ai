import {
  addRow,
  buildComparisonInput,
  canRemoveRow,
  removeRow,
  rowsFromComparison,
  updateRow,
} from '../new-compare-prices.form';
import { buildResultCard } from '../new-compare-prices.result';

describe('rowsFromComparison (task 6.1)', () => {
  const saved = {
    id: 'c1',
    product: { name: 'Arroz' },
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    entries: [
      { id: 'row-1', priceCents: 2490, quantity: 5, unit: 'kg' as const },
      { id: 'row-2', priceCents: 500, quantity: 0.75, unit: 'kg' as const },
      { id: 'row-7', priceCents: 100, quantity: 250, unit: 'g' as const },
    ],
  };

  it('fills price and quantity with the language decimal mark', () => {
    const { rows } = rowsFromComparison(saved, 'pt-BR');
    expect(rows.map((r) => [r.id, r.price, r.quantity, r.unit])).toEqual([
      ['row-1', '24,90', '5', 'kg'],
      ['row-2', '5,00', '0,75', 'kg'],
      ['row-7', '1,00', '250', 'g'],
    ]);
    expect(rowsFromComparison(saved, 'en-US').rows[0]).toMatchObject({ price: '24.90' });
  });

  it('round-trips through buildComparisonInput', () => {
    const { rows } = rowsFromComparison(saved, 'pt-BR');
    expect(buildComparisonInput('Arroz', rows, 'pt-BR')?.entries).toEqual(saved.entries);
  });

  it('never reuses a saved row id for new rows', () => {
    const state = addRow(rowsFromComparison(saved, 'en-US'));
    expect(state.rows.map((r) => r.id)).toEqual(['row-1', 'row-2', 'row-7', 'row-8']);
  });

  it('edits, adds and removes rows, and the result recomputes', () => {
    let state = rowsFromComparison(saved, 'en-US');
    const before = buildResultCard(state.rows, 'en-US');
    state = updateRow(state, 'row-1', { price: '1.00' });
    state = removeRow(state, 'row-7');
    expect(state.rows.map((r) => r.id)).toEqual(['row-1', 'row-2']);
    expect(canRemoveRow(state, 'row-2')).toBe(false);
    expect(buildResultCard(state.rows, 'en-US')).not.toEqual(before);
  });
});
