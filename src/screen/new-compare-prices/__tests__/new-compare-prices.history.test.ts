import { KeyValuePriceHistoryRepository } from '@/business/repository/kv-price-history.repository';
import { MemoryStorage } from '@/business/repository/storage/memory-storage';

import { centsToPriceText, rowPriceSuggestions } from '../new-compare-prices.history';

// Intl output uses a non-breaking space between symbol and amount; compare loosely.
const normalize = (s: string) => s.replace(/\s/g, ' ');

describe('centsToPriceText', () => {
  it('writes the price as the user would type it', () => {
    expect(centsToPriceText(459, 'pt-BR')).toBe('4,59');
    expect(centsToPriceText(5000, 'pt-BR')).toBe('50,00');
    expect(centsToPriceText(459, 'en-US')).toBe('4.59');
  });
});

describe('rowPriceSuggestions', () => {
  async function history() {
    let t = 0;
    const repo = new KeyValuePriceHistoryRepository(new MemoryStorage(), {
      now: () => new Date((t += 1000)),
    });
    await repo.record('Leite', [{ priceCents: 459, unit: 'L' }]);
    await repo.record('Leite', [{ priceCents: 5000, unit: 'L' }]);
    await repo.record('Leite', [{ priceCents: 120, unit: 'mL' }]);
    return repo.listForProduct('leite');
  }

  it("offers the product's recent prices for the row's unit, most recent first", async () => {
    const chips = rowPriceSuggestions(await history(), 'L', 'pt-BR', true);
    expect(chips.map((c) => c.value)).toEqual(['50,00', '4,59']);
    expect(chips.map((c) => normalize(c.label))).toEqual(['R$ 50,00', 'R$ 4,59']);
    expect(rowPriceSuggestions(await history(), 'mL', 'pt-BR', true).map((c) => c.value)).toEqual([
      '1,20',
    ]);
  });

  it('offers nothing for another unit, no unit, or with history off', async () => {
    const entries = await history();
    expect(rowPriceSuggestions(entries, 'kg', 'pt-BR', true)).toEqual([]);
    expect(rowPriceSuggestions(entries, null, 'pt-BR', true)).toEqual([]);
    expect(rowPriceSuggestions(entries, 'L', 'pt-BR', false)).toEqual([]);
  });
});
