import {
  InvalidPriceInputError,
  pricePerBaseUnit,
  pricePerBaseUnitOfEntry,
} from '../price.service';

describe('pricePerBaseUnit', () => {
  it('matches the Designer example: 5 kg @ R$24,90 -> R$4,98/kg', () => {
    const result = pricePerBaseUnit(2490, 5, 'kg');
    expect(result.centsPerBaseUnit).toBeCloseTo(498, 10);
    expect(result.baseUnit).toBe('kg');
  });

  it('matches the AGENTS.md example: B (12 L @ R$50,00) is cheaper than A (1 L @ R$4,59)', () => {
    const a = pricePerBaseUnit(459, 1, 'L');
    const b = pricePerBaseUnit(5000, 12, 'L');
    expect(a.centsPerBaseUnit).toBeCloseTo(459, 10);
    expect(b.centsPerBaseUnit).toBeCloseTo(416.6667, 3);
    expect(b.centsPerBaseUnit).toBeLessThan(a.centsPerBaseUnit);
  });

  it('normalizes mixed units: 500 g @ R$10,00 vs 1 kg @ R$25,00', () => {
    const a = pricePerBaseUnit(1000, 500, 'g');
    const b = pricePerBaseUnit(2500, 1, 'kg');
    expect(a.centsPerBaseUnit).toBe(2000);
    expect(a.baseUnit).toBe('kg');
    expect(b.centsPerBaseUnit).toBe(2500);
    expect(a.centsPerBaseUnit).toBeLessThan(b.centsPerBaseUnit);
  });

  it('gives the same unit price for equivalent quantities in different units', () => {
    expect(pricePerBaseUnit(300, 500, 'mL').centsPerBaseUnit).toBeCloseTo(600, 10);
    expect(pricePerBaseUnit(600, 1, 'L').centsPerBaseUnit).toBeCloseTo(600, 10);
    expect(pricePerBaseUnit(150, 50, 'cm').centsPerBaseUnit).toBeCloseTo(300, 10);
  });

  it('supports fractional quantities and a zero price', () => {
    expect(pricePerBaseUnit(500, 0.5, 'kg').centsPerBaseUnit).toBe(1000);
    expect(pricePerBaseUnit(0, 2, 'L').centsPerBaseUnit).toBe(0);
  });

  it.each([0, -1, NaN, Infinity])('throws InvalidPriceInputError for quantity %s', (quantity) => {
    expect(() => pricePerBaseUnit(100, quantity, 'kg')).toThrow(InvalidPriceInputError);
    expect(() => pricePerBaseUnit(100, quantity, 'kg')).toThrow(/quantity/);
  });

  it.each([-1, NaN, Infinity])('throws InvalidPriceInputError for price %s', (price) => {
    expect(() => pricePerBaseUnit(price, 1, 'kg')).toThrow(InvalidPriceInputError);
  });
});

describe('pricePerBaseUnitOfEntry', () => {
  it('computes from a PriceEntry', () => {
    const result = pricePerBaseUnitOfEntry({ id: '1', priceCents: 2490, quantity: 5, unit: 'kg' });
    expect(result.centsPerBaseUnit).toBeCloseTo(498, 10);
  });
});
