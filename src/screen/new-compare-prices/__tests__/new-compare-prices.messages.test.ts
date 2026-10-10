import enUS from '@/i18n/locales/en-US.json';
import ptBR from '@/i18n/locales/pt-BR.json';

import {
  numberErrorKey,
  productNameErrorKey,
  unitErrorKey,
  type ValidationKey,
} from '../new-compare-prices.messages';

const REASONS = ['empty', 'not_a_number', 'zero', 'negative'] as const;

describe('validation messages', () => {
  it('maps every 3.5 reason to a key translated in both languages', () => {
    const keys: ValidationKey[] = [
      productNameErrorKey('empty'),
      unitErrorKey('empty'),
      ...REASONS.flatMap((r) => [numberErrorKey('price', r), numberErrorKey('quantity', r)]),
    ];
    for (const key of keys) {
      const name = key.replace('validation.', '') as keyof typeof enUS.validation;
      expect(enUS.validation[name]).toBeTruthy();
      expect(ptBR.validation[name]).toBeTruthy();
    }
  });

  it('uses field-specific text only for empty', () => {
    expect(numberErrorKey('price', 'empty')).not.toBe(numberErrorKey('quantity', 'empty'));
    expect(numberErrorKey('price', 'zero')).toBe(numberErrorKey('quantity', 'zero'));
  });
});
