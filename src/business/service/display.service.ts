import type { PriceEntry } from '@/models/PriceEntry';
import type { DisplayBasis } from '@/models/Settings';
import type { MeasurementType, Unit } from '@/models/Unit';

import { pricePerBaseUnitOfEntry, type UnitPrice } from './price.service';
import { getMeasurementType, toBaseUnit } from './unit.service';

/** Unit used for the "per100" basis: 100 g, 100 mL or 100 cm. */
const PER_100_UNIT: Record<MeasurementType, Unit> = {
  mass: 'g',
  volume: 'mL',
  length: 'cm',
};

export type MeasureDisplayPrice = {
  kind: 'measure';
  /** Cents, not rounded. */
  cents: number;
  /** The price is for this many `unit`s: 1 kg / 1 L / 1 m, or 100 g / 100 mL / 100 cm. */
  quantity: number;
  unit: Unit;
};

export type PackageDisplayPrice = {
  kind: 'package';
  /** The price exactly as entered, in cents. */
  cents: number;
};

export type DisplayPrice = MeasureDisplayPrice | PackageDisplayPrice;

/**
 * Expresses a price per base unit on a measure basis:
 * 'base' -> per kg / L / m, 'per100' -> per 100 g / 100 mL / 100 cm. Not rounded.
 * The 'unit' basis needs the entry, see priceForDisplay.
 */
export function unitPriceForBasis(
  unitPrice: UnitPrice,
  basis: Exclude<DisplayBasis, 'unit'>,
): MeasureDisplayPrice {
  if (basis === 'base') {
    return {
      kind: 'measure',
      cents: unitPrice.centsPerBaseUnit,
      quantity: 1,
      unit: unitPrice.baseUnit,
    };
  }
  const unit = PER_100_UNIT[getMeasurementType(unitPrice.baseUnit)];
  return {
    kind: 'measure',
    cents: unitPrice.centsPerBaseUnit * toBaseUnit(100, unit),
    quantity: 100,
    unit,
  };
}

/**
 * Price of an entry on the chosen display basis. Never rounds.
 * 'unit' = price per package as entered (no normalization): R$ 24,90 for 5 kg -> R$ 24,90.
 */
export function priceForDisplay(entry: PriceEntry, basis: DisplayBasis): DisplayPrice {
  if (basis === 'unit') return { kind: 'package', cents: entry.priceCents };
  return unitPriceForBasis(pricePerBaseUnitOfEntry(entry), basis);
}

/**
 * Rounds cents for display, separate from the stored precision.
 * roundCents true -> whole cents (R$ 4,98); false -> keeps `extraDigits` (default 2) decimals
 * of a cent, so R$ 4,1667 is not cut short. Half rounds up; float noise is cleaned first
 * (249.49999999999997 -> 249.5 -> 250).
 */
export function roundCentsForDisplay(cents: number, roundCents: boolean, extraDigits = 2): number {
  const clean = Number(cents.toPrecision(12));
  const factor = roundCents ? 1 : 10 ** extraDigits;
  return Math.round(clean * factor) / factor;
}
