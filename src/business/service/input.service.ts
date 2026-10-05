import type { Language } from '@/models/Settings';
import type { Unit } from '@/models/Unit';

// Reason codes the UI translates; no user-facing text lives here.
export type NumberInvalidReason = 'empty' | 'not_a_number' | 'zero' | 'negative';
export type UnitInvalidReason = 'empty';

export type ParseResult<R extends string = NumberInvalidReason> =
  { ok: true; value: number } | { ok: false; reason: R };

type Separators = { decimal: string; group: string };

const SEPARATORS: Record<Language, Separators> = {
  'pt-BR': { decimal: ',', group: '.' },
  'en-US': { decimal: '.', group: ',' },
};

const count = (text: string, char: string): number => text.split(char).length - 1;

// Thousands groups: 1-3 digits (no leading zero), then groups of exactly 3 ("1.234.567").
function isGrouped(integerPart: string, group: string): boolean {
  const [first, ...rest] = integerPart.split(group);
  return (
    first.length >= 1 &&
    first.length <= 3 &&
    !first.startsWith('0') &&
    rest.length > 0 &&
    rest.every((part) => part.length === 3)
  );
}

const digitsOnly = (text: string): boolean => /^\d*$/.test(text);

// Unsigned text made of digits, "." and ",". "1.234,56" → 1234.56 (pt-BR) · "1,234.56" (en-US).
// The other language's decimal mark is accepted when unambiguous: "4.59" in pt-BR is 4.59,
// while "1.234" in pt-BR is 1234 (a valid thousands group wins).
function parseUnsigned(raw: string, language: Language): number | undefined {
  if (!/^[\d.,]+$/.test(raw)) return undefined;
  const { decimal, group } = SEPARATORS[language];

  let integer: string;
  let fraction = '';

  if (raw.includes(decimal)) {
    if (count(raw, decimal) > 1) return undefined;
    const [integerPart, fractionPart] = raw.split(decimal);
    if (fractionPart === '' || !digitsOnly(fractionPart)) return undefined; // "5," / "1,2.3"
    if (integerPart.includes(group)) {
      if (!isGrouped(integerPart, group)) return undefined;
      integer = integerPart.split(group).join('');
    } else {
      integer = integerPart;
    }
    fraction = fractionPart;
  } else if (raw.includes(group)) {
    const groupedOnce = count(raw, group) === 1;
    if (isGrouped(raw, group)) {
      integer = raw.split(group).join('');
    } else if (groupedOnce && !raw.endsWith(group)) {
      [integer, fraction] = raw.split(group); // lone foreign decimal mark
    } else {
      return undefined;
    }
  } else {
    integer = raw;
  }

  if (integer === '' && fraction === '') return undefined;
  return Number(`${integer || '0'}${fraction ? `.${fraction}` : ''}`);
}

/** Parses a user-typed number and requires it to be greater than zero. */
export function parsePositiveNumber(
  input: string | null | undefined,
  language: Language,
): ParseResult {
  const text = (input ?? '').replace(/\s+/g, '');
  if (text === '') return { ok: false, reason: 'empty' };

  const negative = /^[-−]/.test(text);
  const unsigned = negative || text.startsWith('+') ? text.slice(1) : text;
  const value = parseUnsigned(unsigned, language);
  if (value === undefined) return { ok: false, reason: 'not_a_number' };
  if (value === 0) return { ok: false, reason: 'zero' };
  if (negative) return { ok: false, reason: 'negative' };
  return { ok: true, value };
}

/** Quantity field: "0,75" → 0.75. */
export function parseQuantity(input: string | null | undefined, language: Language): ParseResult {
  return parsePositiveNumber(input, language);
}

/** Price field to cents (PriceEntry.priceCents): "R$ 24,90" → 2490. Currency symbols are ignored. */
export function parsePriceCents(input: string | null | undefined, language: Language): ParseResult {
  const result = parsePositiveNumber((input ?? '').replace(/R\$|\$/g, ''), language);
  if (!result.ok) return result;
  const cents = Math.round(result.value * 100);
  // Below half a cent the price rounds to nothing, so it counts as zero.
  return cents === 0 ? { ok: false, reason: 'zero' } : { ok: true, value: cents };
}

export type RowDraft = {
  price: string | null | undefined;
  quantity: string | null | undefined;
  unit: Unit | null | undefined;
};

export type RowErrors = {
  price?: NumberInvalidReason;
  quantity?: NumberInvalidReason;
  unit?: UnitInvalidReason;
};

export type RowValidation =
  | { valid: true; priceCents: number; quantity: number; unit: Unit }
  | { valid: false; errors: RowErrors };

/** A row is valid only when price, quantity and unit are all set and positive. */
export function validateRow(row: RowDraft, language: Language): RowValidation {
  const price = parsePriceCents(row.price, language);
  const quantity = parseQuantity(row.quantity, language);

  if (price.ok && quantity.ok && row.unit) {
    return { valid: true, priceCents: price.value, quantity: quantity.value, unit: row.unit };
  }

  const errors: RowErrors = {};
  if (!price.ok) errors.price = price.reason;
  if (!quantity.ok) errors.quantity = quantity.reason;
  if (!row.unit) errors.unit = 'empty';
  return { valid: false, errors };
}

export function isRowValid(row: RowDraft, language: Language): boolean {
  return validateRow(row, language).valid;
}
