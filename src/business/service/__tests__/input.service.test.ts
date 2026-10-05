import {
  isRowValid,
  parsePositiveNumber,
  parsePriceCents,
  parseQuantity,
  validateRow,
} from '../input.service';

const ok = (value: number) => ({ ok: true, value });
const fail = (reason: string) => ({ ok: false, reason });

describe('parsePositiveNumber', () => {
  it.each([
    ['4,59', 'pt-BR', 4.59],
    ['4.59', 'pt-BR', 4.59],
    ['4.59', 'en-US', 4.59],
    ['4,59', 'en-US', 4.59],
    ['1.234,56', 'pt-BR', 1234.56],
    ['1,234.56', 'en-US', 1234.56],
    ['1.234', 'pt-BR', 1234],
    ['1,234', 'en-US', 1234],
    ['1.234.567', 'pt-BR', 1234567],
    ['0.500', 'pt-BR', 0.5],
    [',5', 'pt-BR', 0.5],
    ['  1 234,5 ', 'pt-BR', 1234.5],
    ['\t12\n', 'en-US', 12],
    ['+3', 'pt-BR', 3],
    ['500', 'pt-BR', 500],
  ] as const)('parses %j in %s as %d', (input, language, value) => {
    expect(parsePositiveNumber(input, language)).toEqual(ok(value));
  });

  it.each([null, undefined, '', '   '])('rejects empty input %j', (input) => {
    expect(parsePositiveNumber(input, 'pt-BR')).toEqual(fail('empty'));
  });

  it.each(['0', '0,00', '0.0', '000'])('rejects zero %j', (input) => {
    expect(parsePositiveNumber(input, 'pt-BR')).toEqual(fail('zero'));
  });

  it.each(['-1', '-4,59', '- 2', '−5'])('rejects negative %j', (input) => {
    expect(parsePositiveNumber(input, 'pt-BR')).toEqual(fail('negative'));
  });

  it.each([
    'abc',
    '1e3',
    'Infinity',
    'NaN',
    '1,2,3',
    '1.2,3.4',
    '12,34.5',
    '1.23.4',
    '12.345,6.7',
    '5,',
    ',',
    '.',
    '1,5kg',
    '--1',
  ])('rejects non-numeric %j', (input) => {
    expect(parsePositiveNumber(input, 'pt-BR')).toEqual(fail('not_a_number'));
  });

  it('keeps locales strict about the decimal mark with grouping', () => {
    expect(parsePositiveNumber('1,234,56', 'pt-BR')).toEqual(fail('not_a_number'));
    expect(parsePositiveNumber('1.234.56', 'en-US')).toEqual(fail('not_a_number'));
    expect(parsePositiveNumber('1.234,56', 'en-US')).toEqual(fail('not_a_number'));
  });
});

describe('parseQuantity', () => {
  it('parses fractional quantities', () => {
    expect(parseQuantity('0,75', 'pt-BR')).toEqual(ok(0.75));
  });

  it('rejects zero and negative quantities', () => {
    expect(parseQuantity('0', 'pt-BR')).toEqual(fail('zero'));
    expect(parseQuantity('-1', 'pt-BR')).toEqual(fail('negative'));
  });
});

describe('parsePriceCents', () => {
  it.each([
    ['24,90', 'pt-BR', 2490],
    ['R$ 24,90', 'pt-BR', 2490],
    ['$1,234.56', 'en-US', 123456],
    ['4.59', 'pt-BR', 459],
    ['0,10', 'pt-BR', 10],
  ] as const)('parses %j in %s as %d cents', (input, language, cents) => {
    expect(parsePriceCents(input, language)).toEqual(ok(cents));
  });

  it('avoids floating point drift', () => {
    expect(parsePriceCents('1,15', 'pt-BR')).toEqual(ok(115));
    expect(parsePriceCents('19,99', 'pt-BR')).toEqual(ok(1999));
  });

  it('rejects empty, zero, negative and sub-cent prices', () => {
    expect(parsePriceCents('', 'pt-BR')).toEqual(fail('empty'));
    expect(parsePriceCents('R$', 'pt-BR')).toEqual(fail('empty'));
    expect(parsePriceCents('0', 'pt-BR')).toEqual(fail('zero'));
    expect(parsePriceCents('0,004', 'pt-BR')).toEqual(fail('zero'));
    expect(parsePriceCents('-5', 'pt-BR')).toEqual(fail('negative'));
    expect(parsePriceCents('abc', 'pt-BR')).toEqual(fail('not_a_number'));
  });
});

describe('validateRow', () => {
  it('is valid when price, quantity and unit are set', () => {
    expect(validateRow({ price: '4,59', quantity: '500', unit: 'g' }, 'pt-BR')).toEqual({
      valid: true,
      priceCents: 459,
      quantity: 500,
      unit: 'g',
    });
  });

  it('is invalid without a unit', () => {
    expect(validateRow({ price: '4,59', quantity: '1', unit: null }, 'pt-BR')).toEqual({
      valid: false,
      errors: { unit: 'empty' },
    });
  });

  it('reports every failing field', () => {
    expect(validateRow({ price: '', quantity: '0', unit: undefined }, 'pt-BR')).toEqual({
      valid: false,
      errors: { price: 'empty', quantity: 'zero', unit: 'empty' },
    });
    expect(validateRow({ price: '-1', quantity: 'x', unit: 'L' }, 'en-US')).toEqual({
      valid: false,
      errors: { price: 'negative', quantity: 'not_a_number' },
    });
  });

  it('isRowValid mirrors validateRow', () => {
    expect(isRowValid({ price: '1', quantity: '1', unit: 'kg' }, 'en-US')).toBe(true);
    expect(isRowValid({ price: '1', quantity: '', unit: 'kg' }, 'en-US')).toBe(false);
  });
});
