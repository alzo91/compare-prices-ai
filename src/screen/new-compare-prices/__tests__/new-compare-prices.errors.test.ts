import {
  fieldKey,
  hasMixedMeasurementTypes,
  NAME_KEY,
  productNameError,
  touch,
  touchAll,
  validateProductName,
  visibleRowErrors,
} from '../new-compare-prices.errors';

const row = { price: '', quantity: '', unit: 'kg' as const };

describe('product name', () => {
  it('flags blank and whitespace-only names', () => {
    expect(validateProductName('')).toBe('empty');
    expect(validateProductName('   ')).toBe('empty');
    expect(validateProductName('Rice')).toBeUndefined();
  });

  it('only shows the error once touched', () => {
    expect(productNameError('', {})).toBeUndefined();
    expect(productNameError('', touch({}, NAME_KEY))).toBe('empty');
    expect(productNameError('Rice', touch({}, NAME_KEY))).toBeUndefined();
  });
});

describe('visibleRowErrors', () => {
  it('is quiet for an untouched row', () => {
    expect(visibleRowErrors('row-1', row, {}, 'pt-BR')).toEqual({});
  });

  it('shows the reason code of touched invalid fields only', () => {
    const touched = touch({}, fieldKey('row-1', 'price'));
    expect(visibleRowErrors('row-1', row, touched, 'pt-BR')).toEqual({ price: 'empty' });
    const both = touch(touched, fieldKey('row-1', 'quantity'));
    expect(visibleRowErrors('row-1', { ...row, quantity: '0' }, both, 'pt-BR')).toEqual({
      price: 'empty',
      quantity: 'zero',
    });
  });

  it('maps each 3.5 reason', () => {
    const touched = touchAll(['row-1']);
    expect(
      visibleRowErrors('row-1', { ...row, price: 'abc', quantity: '-2' }, touched, 'en-US'),
    ).toEqual({ price: 'not_a_number', quantity: 'negative' });
  });

  it('shows nothing for a valid row', () => {
    const r = { price: '4,59', quantity: '1', unit: 'kg' as const };
    expect(visibleRowErrors('row-1', r, touchAll(['row-1']), 'pt-BR')).toEqual({});
  });

  it('shows a missing unit once the row was touched', () => {
    const touched = touch({}, fieldKey('row-1', 'price'));
    const r = { price: '1', quantity: '1', unit: null };
    expect(visibleRowErrors('row-1', r, touched, 'pt-BR')).toEqual({ unit: 'empty' });
  });

  it('does not leak between rows', () => {
    const touched = touch({}, fieldKey('row-1', 'price'));
    expect(visibleRowErrors('row-2', row, touched, 'pt-BR')).toEqual({});
  });
});

describe('touch helpers', () => {
  it('touch is idempotent and immutable', () => {
    const a = touch({}, 'x');
    expect(touch(a, 'x')).toBe(a);
    expect(a).toEqual({ x: true });
  });

  it('touchAll covers name and every field', () => {
    expect(Object.keys(touchAll(['row-1', 'row-2'])).sort()).toEqual(
      ['name', 'row-1.price', 'row-1.quantity', 'row-2.price', 'row-2.quantity'].sort(),
    );
  });
});

describe('hasMixedMeasurementTypes', () => {
  it('is false for one type, any unit scale', () => {
    expect(hasMixedMeasurementTypes([{ unit: 'kg' }, { unit: 'g' }])).toBe(false);
  });
  it('is true for different types', () => {
    expect(hasMixedMeasurementTypes([{ unit: 'kg' }, { unit: 'L' }, { unit: 'g' }])).toBe(true);
  });
  it('ignores rows without a unit', () => {
    expect(hasMixedMeasurementTypes([{ unit: 'kg' }, { unit: null }])).toBe(false);
  });
});
