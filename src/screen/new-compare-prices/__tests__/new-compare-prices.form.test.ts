import { UNIT_OPTIONS } from '@/components/molecules/price-row.units';

import { isFormValid, isProductNameValid } from '../new-compare-prices.form';

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

describe('UNIT_OPTIONS', () => {
  it('matches the Designer set and maps the ml label to mL', () => {
    expect(UNIT_OPTIONS.map((o) => o.label)).toEqual(['kg', 'g', 'L', 'ml', 'm', 'cm']);
    expect(UNIT_OPTIONS.find((o) => o.label === 'ml')?.unit).toBe('mL');
  });
});
