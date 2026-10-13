import { UNIT_OPTIONS } from '@/components/molecules/price-row.units';

import {
  addRow,
  buildComparisonInput,
  canRemoveRow,
  createInitialRows,
  isFormValid,
  isProductNameValid,
  removeRow,
  updateRow,
} from '../new-compare-prices.form';

describe('price rows', () => {
  it('starts with 2 empty rows with kg preselected', () => {
    const { rows } = createInitialRows();
    expect(rows).toHaveLength(2);
    expect(rows.map((r) => r.id)).toEqual(['row-1', 'row-2']);
    expect(rows[0]).toMatchObject({ price: '', quantity: '', unit: 'kg' });
  });

  it('adds rows at the end with new ids', () => {
    const state = addRow(addRow(createInitialRows()));
    expect(state.rows.map((r) => r.id)).toEqual(['row-1', 'row-2', 'row-3', 'row-4']);
  });

  it('cannot remove the first two rows', () => {
    const state = addRow(createInitialRows());
    expect(canRemoveRow(state, 'row-1')).toBe(false);
    expect(canRemoveRow(state, 'row-2')).toBe(false);
    expect(canRemoveRow(state, 'row-3')).toBe(true);
    expect(removeRow(state, 'row-1')).toBe(state);
    expect(removeRow(state, 'row-2')).toBe(state);
    expect(removeRow(createInitialRows(), 'missing').rows).toHaveLength(2);
  });

  it('removes rows 3+ and keeps the others untouched', () => {
    let state = addRow(addRow(createInitialRows()));
    state = updateRow(state, 'row-4', { price: '9,90' });
    state = removeRow(state, 'row-3');
    expect(state.rows.map((r) => r.id)).toEqual(['row-1', 'row-2', 'row-4']);
    expect(state.rows[2].price).toBe('9,90');
  });

  it('never reuses an id after a removal', () => {
    let state = addRow(createInitialRows());
    state = removeRow(state, 'row-3');
    state = addRow(state);
    expect(state.rows.map((r) => r.id)).toEqual(['row-1', 'row-2', 'row-4']);
  });

  it('updates only the targeted row', () => {
    const state = updateRow(createInitialRows(), 'row-2', { quantity: '3', unit: 'g' });
    expect(state.rows[0].quantity).toBe('');
    expect(state.rows[1]).toMatchObject({ quantity: '3', unit: 'g' });
  });
});

describe('isProductNameValid', () => {
  it.each([
    ['', false],
    ['   ', false],
    ['Arroz', true],
    ['  Arroz  ', true],
  ])('%j -> %s', (name, expected) => {
    expect(isProductNameValid(name)).toBe(expected);
  });
});

describe('isFormValid', () => {
  const row = { price: '24,90', quantity: '5', unit: 'kg' as const };

  it('needs a product name and a valid row', () => {
    expect(isFormValid({ productName: 'Arroz', row }, 'pt-BR')).toBe(true);
    expect(isFormValid({ productName: ' ', row }, 'pt-BR')).toBe(false);
    expect(isFormValid({ productName: 'Arroz', row: { ...row, unit: null } }, 'pt-BR')).toBe(false);
    expect(isFormValid({ productName: 'Arroz', row: { ...row, price: '' } }, 'pt-BR')).toBe(false);
  });

  it('parses with the active language', () => {
    const en = { productName: 'Rice', row: { price: '4.59', quantity: '1,5', unit: 'L' as const } };
    expect(isFormValid(en, 'en-US')).toBe(true);
  });
});

describe('buildComparisonInput', () => {
  const filled = () => {
    let state = createInitialRows();
    state = updateRow(state, 'row-1', { price: '24,90', quantity: '5', unit: 'kg' });
    return updateRow(state, 'row-2', { price: '4,50', quantity: '500', unit: 'g' });
  };

  it('builds the repository input with trimmed name and cents', () => {
    expect(buildComparisonInput('  Arroz ', filled().rows, 'pt-BR')).toEqual({
      product: { name: 'Arroz' },
      entries: [
        { id: 'row-1', priceCents: 2490, quantity: 5, unit: 'kg' },
        { id: 'row-2', priceCents: 450, quantity: 500, unit: 'g' },
      ],
    });
  });

  it('is null until the name and every row are valid', () => {
    const { rows } = filled();
    expect(buildComparisonInput(' ', rows, 'pt-BR')).toBeNull();
    expect(buildComparisonInput('Arroz', createInitialRows().rows, 'pt-BR')).toBeNull();
    expect(buildComparisonInput('Arroz', [rows[0]], 'pt-BR')).toBeNull();
    expect(buildComparisonInput('Arroz', addRow(filled()).rows, 'pt-BR')).toBeNull();
  });

  it('is null when units mix measurement types', () => {
    const state = updateRow(filled(), 'row-2', { unit: 'L' });
    expect(buildComparisonInput('Arroz', state.rows, 'pt-BR')).toBeNull();
  });
});

describe('UNIT_OPTIONS', () => {
  it('matches the Designer set and maps the ml label to mL', () => {
    expect(UNIT_OPTIONS.map((o) => o.label)).toEqual(['kg', 'g', 'L', 'ml', 'm', 'cm']);
    expect(UNIT_OPTIONS.find((o) => o.label === 'ml')?.unit).toBe('mL');
  });
});
