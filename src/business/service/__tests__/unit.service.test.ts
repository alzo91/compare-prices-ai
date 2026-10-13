import { BASE_UNIT, type Unit } from '@/models/Unit';

import {
  IncompatibleUnitsError,
  UNIT_TABLE,
  areUnitsCompatible,
  convert,
  getBaseUnit,
  getMeasurementType,
  toBaseUnit,
} from '../unit.service';

const ALL_UNITS = Object.keys(UNIT_TABLE) as Unit[];

describe('getMeasurementType / getBaseUnit', () => {
  it.each([
    ['m', 'length', 'm'],
    ['km', 'length', 'm'],
    ['cm', 'length', 'm'],
    ['mm', 'length', 'm'],
    ['kg', 'mass', 'kg'],
    ['g', 'mass', 'kg'],
    ['mg', 'mass', 'kg'],
    ['L', 'volume', 'L'],
    ['mL', 'volume', 'L'],
    ['m3', 'volume', 'L'],
  ] as const)('%s is %s with base unit %s', (unit, type, base) => {
    expect(getMeasurementType(unit)).toBe(type);
    expect(getBaseUnit(unit)).toBe(base);
    expect(BASE_UNIT[type]).toBe(base);
  });
});

describe('areUnitsCompatible', () => {
  it('is true within a measurement type', () => {
    expect(areUnitsCompatible('L', 'mL')).toBe(true);
    expect(areUnitsCompatible('m', 'cm')).toBe(true);
    expect(areUnitsCompatible('kg', 'g')).toBe(true);
    expect(areUnitsCompatible('kg', 'kg')).toBe(true);
    expect(areUnitsCompatible('m3', 'L')).toBe(true);
  });

  it('is false across measurement types, in both directions', () => {
    expect(areUnitsCompatible('kg', 'L')).toBe(false);
    expect(areUnitsCompatible('L', 'kg')).toBe(false);
    expect(areUnitsCompatible('m', 'g')).toBe(false);
    expect(areUnitsCompatible('mL', 'cm')).toBe(false);
  });
});

describe('toBaseUnit', () => {
  it.each([
    [1, 'm', 1],
    [2, 'km', 2000],
    [50, 'cm', 0.5],
    [250, 'mm', 0.25],
    [1, 'kg', 1],
    [500, 'g', 0.5],
    [1500, 'mg', 0.0015],
    [1, 'L', 1],
    [750, 'mL', 0.75],
    [1, 'm3', 1000],
  ] as const)('%d %s -> %d in base unit', (value, unit, expected) => {
    expect(toBaseUnit(value, unit)).toBeCloseTo(expected, 12);
  });

  it('is exact for sub-units (divisor keeps results free of float noise)', () => {
    expect(toBaseUnit(500, 'g')).toBe(0.5);
    expect(toBaseUnit(1000, 'g')).toBe(1);
    expect(toBaseUnit(1000, 'mL')).toBe(1);
    expect(toBaseUnit(100, 'cm')).toBe(1);
  });

  it('keeps zero as zero and is linear', () => {
    for (const unit of ALL_UNITS) {
      expect(toBaseUnit(0, unit)).toBe(0);
      expect(toBaseUnit(6, unit)).toBeCloseTo(2 * toBaseUnit(3, unit), 12);
    }
  });

  it('propagates NaN', () => {
    expect(toBaseUnit(NaN, 'kg')).toBeNaN();
  });
});

describe('convert', () => {
  it.each([
    [1, 'L', 'mL', 1000],
    [1000, 'mL', 'L', 1],
    [250, 'mL', 'L', 0.25],
    [1, 'm', 'cm', 100],
    [150, 'cm', 'm', 1.5],
    [1, 'km', 'm', 1000],
    [1, 'm', 'mm', 1000],
    [1, 'km', 'cm', 100000],
    [1, 'kg', 'g', 1000],
    [500, 'g', 'kg', 0.5],
    [1, 'g', 'mg', 1000],
    [1, 'kg', 'mg', 1_000_000],
    [1, 'm3', 'L', 1000],
    [1, 'm3', 'mL', 1_000_000],
    [2500, 'L', 'm3', 2.5],
  ] as const)('%d %s -> %d %s', (value, from, to, expected) => {
    expect(convert(value, from, to)).toBeCloseTo(expected, 9);
  });

  it('returns the same value for the same unit', () => {
    for (const unit of ALL_UNITS) expect(convert(3.7, unit, unit)).toBe(3.7);
  });

  it('round-trips within a type', () => {
    for (const from of ALL_UNITS) {
      for (const to of ALL_UNITS) {
        if (!areUnitsCompatible(from, to)) continue;
        expect(convert(convert(12.5, from, to), to, from)).toBeCloseTo(12.5, 9);
      }
    }
  });

  it('converts zero and negative values without throwing', () => {
    expect(convert(0, 'kg', 'g')).toBe(0);
    expect(convert(-2, 'L', 'mL')).toBe(-2000);
  });

  it.each([
    ['kg', 'L'],
    ['L', 'kg'],
    ['m', 'g'],
    ['mL', 'cm'],
    ['m3', 'm'],
  ] as const)('throws IncompatibleUnitsError for %s -> %s', (from, to) => {
    expect(() => convert(1, from, to)).toThrow(IncompatibleUnitsError);
    let caught: unknown;
    try {
      convert(1, from, to);
    } catch (error) {
      caught = error;
    }
    expect(caught).toMatchObject({ name: 'IncompatibleUnitsError', from, to });
  });
});
