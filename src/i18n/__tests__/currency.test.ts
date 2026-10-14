import { currencySymbol, formatMoney, isCurrency, toCurrency } from '../currency';

// Intl may use a no-break space between symbol and number; compare with plain spaces.
const plain = (text: string) => text.replace(/\s/g, ' ');

describe('formatMoney', () => {
  it.each([
    ['BRL', 'pt-BR', 'R$ 1.234,50'],
    ['USD', 'pt-BR', 'US$ 1.234,50'],
    ['EUR', 'pt-BR', '€ 1.234,50'],
    ['BRL', 'en-US', 'R$1,234.50'],
    ['USD', 'en-US', '$1,234.50'],
    ['EUR', 'en-US', '€1,234.50'],
  ] as const)('formats %s in %s as %j', (currency, language, expected) => {
    expect(plain(formatMoney(1234.5, currency, language))).toBe(expected);
  });

  it('passes Intl options through (whole units for "Arredondar centavos")', () => {
    const noCents = { minimumFractionDigits: 0, maximumFractionDigits: 0 };
    expect(plain(formatMoney(5, 'EUR', 'pt-BR', noCents))).toBe('€ 5');
  });
});

describe('currencySymbol', () => {
  it.each([
    ['BRL', 'pt-BR', 'R$'],
    ['USD', 'pt-BR', 'US$'],
    ['USD', 'en-US', '$'],
    ['EUR', 'en-US', '€'],
  ] as const)('%s in %s is %j', (currency, language, symbol) => {
    expect(currencySymbol(currency, language)).toBe(symbol);
  });
});

describe('toCurrency', () => {
  it('accepts supported currencies', () => {
    expect(isCurrency('EUR')).toBe(true);
    expect(toCurrency('USD')).toBe('USD');
  });

  it('falls back to Real for anything else', () => {
    expect(isCurrency('GBP')).toBe(false);
    expect(toCurrency('GBP')).toBe('BRL');
    expect(toCurrency(undefined)).toBe('BRL');
    expect(toCurrency(42)).toBe('BRL');
  });
});
