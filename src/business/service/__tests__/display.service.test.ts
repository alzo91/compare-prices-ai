import type { PriceEntry } from '@/models/PriceEntry';
import type { Unit } from '@/models/Unit';

import { priceForDisplay, roundCentsForDisplay, unitPriceForBasis } from '../display.service';
import { pricePerBaseUnit } from '../price.service';

const entry = (priceCents: number, quantity: number, unit: Unit): PriceEntry => ({
  id: 'x',
  priceCents,
  quantity,
  unit,
});

describe('priceForDisplay', () => {
  it('base: per kg / L / m', () => {
    expect(priceForDisplay(entry(2490, 5, 'kg'), 'base')).toEqual({
      kind: 'measure',
      cents: 498,
      quantity: 1,
      unit: 'kg',
    });
    expect(priceForDisplay(entry(1000, 500, 'g'), 'base')).toEqual({
      kind: 'measure',
      cents: 2000,
      quantity: 1,
      unit: 'kg',
    });
    expect(priceForDisplay(entry(5000, 12, 'L'), 'base')).toMatchObject({ quantity: 1, unit: 'L' });
  });

  it('per100: 100 g, 100 mL, 100 cm', () => {
    const mass = priceForDisplay(entry(1000, 500, 'g'), 'per100');
    expect(mass).toMatchObject({ quantity: 100, unit: 'g' });
    expect(mass.cents).toBeCloseTo(200, 10);

    const volume = priceForDisplay(entry(459, 1, 'L'), 'per100');
    expect(volume).toMatchObject({ quantity: 100, unit: 'mL' });
    expect(volume.cents).toBeCloseTo(45.9, 10);

    const length = priceForDisplay(entry(400, 1, 'm'), 'per100');
    expect(length).toMatchObject({ quantity: 100, unit: 'cm' });
    expect(length.cents).toBeCloseTo(400, 10);
  });

  it('unit: price per package as entered, no normalization', () => {
    expect(priceForDisplay(entry(2490, 5, 'kg'), 'unit')).toEqual({ kind: 'package', cents: 2490 });
    expect(priceForDisplay(entry(1000, 500, 'g'), 'unit')).toEqual({
      kind: 'package',
      cents: 1000,
    });
  });

  it('does not round', () => {
    const result = priceForDisplay(entry(5000, 12, 'L'), 'base');
    expect(result.cents).toBeCloseTo(416.66666667, 6);
    expect(result.cents).not.toBe(417);
  });
});

describe('unitPriceForBasis', () => {
  it('converts an existing UnitPrice', () => {
    const up = pricePerBaseUnit(2490, 5, 'kg');
    expect(unitPriceForBasis(up, 'base').cents).toBe(498);
    expect(unitPriceForBasis(up, 'per100').cents).toBeCloseTo(49.8, 10);
  });
});

describe('roundCentsForDisplay', () => {
  it('roundCents true: whole cents, half up', () => {
    expect(roundCentsForDisplay(416.6667, true)).toBe(417);
    expect(roundCentsForDisplay(498, true)).toBe(498);
    expect(roundCentsForDisplay(249.5, true)).toBe(250);
    expect(roundCentsForDisplay(249.49999999999997, true)).toBe(250);
  });

  it('roundCents false: keeps 2 extra decimals of a cent by default', () => {
    expect(roundCentsForDisplay(416.66666667, false)).toBe(416.67);
    expect(roundCentsForDisplay(45.9, false)).toBe(45.9);
    expect(roundCentsForDisplay(416.66666667, false, 3)).toBe(416.667);
  });
});
