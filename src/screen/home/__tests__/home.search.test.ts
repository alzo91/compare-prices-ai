import { filterByProductName, normalizeSearchText } from '../home.search';

const items = [
  { name: 'Feijão preto' },
  { name: 'Café torrado e moído' },
  { name: 'Arroz branco tipo 1' },
];

describe('normalizeSearchText', () => {
  it('lowercases, strips accents and trims', () => {
    expect(normalizeSearchText('  FeiJÃO  ')).toBe('feijao');
  });
});

describe('filterByProductName', () => {
  it('finds accented names without accents', () => {
    expect(filterByProductName(items, 'feijao')).toEqual([items[0]]);
  });
  it('finds names typed with accents against plain text', () => {
    expect(filterByProductName(items, 'café')).toEqual([items[1]]);
    expect(filterByProductName(items, 'moido')).toEqual([items[1]]);
  });
  it('is case-insensitive and matches substrings', () => {
    expect(filterByProductName(items, 'BRANCO')).toEqual([items[2]]);
    expect(filterByProductName(items, 'oz bra')).toEqual([items[2]]);
  });
  it('returns everything for a blank query', () => {
    expect(filterByProductName(items, '')).toEqual(items);
    expect(filterByProductName(items, '   ')).toEqual(items);
  });
  it('returns an empty list when nothing matches', () => {
    expect(filterByProductName(items, 'leite')).toEqual([]);
  });
});
