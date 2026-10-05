import { BASE_UNIT, MeasurementType, Unit } from '@/models/Unit';

// value in base unit = value * multiplier / divisor.
// Sub-units use a divisor (g = kg / 1000) so results stay exact in floating point.
type UnitDefinition = { type: MeasurementType; multiplier: number; divisor: number };

export const UNIT_TABLE: Record<Unit, UnitDefinition> = {
  m: { type: 'length', multiplier: 1, divisor: 1 },
  km: { type: 'length', multiplier: 1000, divisor: 1 },
  cm: { type: 'length', multiplier: 1, divisor: 100 },
  mm: { type: 'length', multiplier: 1, divisor: 1000 },
  kg: { type: 'mass', multiplier: 1, divisor: 1 },
  g: { type: 'mass', multiplier: 1, divisor: 1000 },
  mg: { type: 'mass', multiplier: 1, divisor: 1_000_000 },
  L: { type: 'volume', multiplier: 1, divisor: 1 },
  mL: { type: 'volume', multiplier: 1, divisor: 1000 },
  m3: { type: 'volume', multiplier: 1000, divisor: 1 },
};

export class IncompatibleUnitsError extends Error {
  readonly from: Unit;
  readonly to: Unit;

  constructor(from: Unit, to: Unit) {
    super(
      `Cannot convert ${from} (${UNIT_TABLE[from].type}) to ${to} (${UNIT_TABLE[to].type}): incompatible measurement types`,
    );
    this.name = 'IncompatibleUnitsError';
    this.from = from;
    this.to = to;
  }
}

export function getMeasurementType(unit: Unit): MeasurementType {
  return UNIT_TABLE[unit].type;
}

export function getBaseUnit(unit: Unit): Unit {
  return BASE_UNIT[getMeasurementType(unit)];
}

export function areUnitsCompatible(a: Unit, b: Unit): boolean {
  return getMeasurementType(a) === getMeasurementType(b);
}

/** Converts a quantity to the base unit of its type (m, kg or L). */
export function toBaseUnit(value: number, unit: Unit): number {
  const { multiplier, divisor } = UNIT_TABLE[unit];
  return (value * multiplier) / divisor;
}

/** Converts between units of the same type. Throws IncompatibleUnitsError otherwise. */
export function convert(value: number, from: Unit, to: Unit): number {
  if (!areUnitsCompatible(from, to)) {
    throw new IncompatibleUnitsError(from, to);
  }
  if (from === to) return value;
  const target = UNIT_TABLE[to];
  return (toBaseUnit(value, from) * target.divisor) / target.multiplier;
}
