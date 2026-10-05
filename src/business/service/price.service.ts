import type { PriceEntry } from '@/models/PriceEntry';
import type { Unit } from '@/models/Unit';

import { getBaseUnit, toBaseUnit } from './unit.service';

/**
 * Thrown when a price or quantity cannot produce a meaningful unit price:
 * quantity must be a finite number > 0 and price a finite number >= 0.
 * (A zero quantity would divide by zero; a negative one is meaningless.)
 */
export class InvalidPriceInputError extends Error {
  readonly field: 'quantity' | 'priceCents';
  readonly value: number;

  constructor(field: 'quantity' | 'priceCents', value: number) {
    super(
      field === 'quantity'
        ? `Invalid quantity ${value}: must be a finite number greater than 0`
        : `Invalid price ${value}: must be a finite number greater than or equal to 0`,
    );
    this.name = 'InvalidPriceInputError';
    this.field = field;
    this.value = value;
  }
}

export type UnitPrice = {
  /** Price in cents per one base unit (kg, L or m). Not rounded. */
  centsPerBaseUnit: number;
  baseUnit: Unit;
};

/**
 * Price per base unit: priceCents / quantity normalized to the base unit of `unit`.
 * e.g. 2490 cents for 5 kg -> 498 cents/kg; 500 g @ 1000 cents -> 2000 cents/kg.
 * The result is not rounded; rounding is a display concern.
 * Throws InvalidPriceInputError on a non-positive quantity or a negative price.
 */
export function pricePerBaseUnit(priceCents: number, quantity: number, unit: Unit): UnitPrice {
  if (!Number.isFinite(priceCents) || priceCents < 0) {
    throw new InvalidPriceInputError('priceCents', priceCents);
  }
  if (!Number.isFinite(quantity) || quantity <= 0) {
    throw new InvalidPriceInputError('quantity', quantity);
  }
  return {
    centsPerBaseUnit: priceCents / toBaseUnit(quantity, unit),
    baseUnit: getBaseUnit(unit),
  };
}

export function pricePerBaseUnitOfEntry(entry: PriceEntry): UnitPrice {
  return pricePerBaseUnit(entry.priceCents, entry.quantity, entry.unit);
}
