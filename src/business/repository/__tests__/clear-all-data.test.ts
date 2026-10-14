import { DEFAULT_SETTINGS } from '@/models/Settings';

import { clearAllData } from '../clear-all-data';
import { KeyValueComparisonRepository } from '../kv-comparison.repository';
import { KeyValuePriceHistoryRepository, PRICE_HISTORY_KEY } from '../kv-price-history.repository';
import { KeyValueSettingsRepository } from '../kv-settings.repository';
import { MemoryStorage } from '../storage/memory-storage';

describe('clearAllData', () => {
  it('removes comparisons and price history and resets settings to defaults', async () => {
    const storage = new MemoryStorage();
    const comparisons = new KeyValueComparisonRepository(storage, { generateId: () => 'id-1' });
    const settings = new KeyValueSettingsRepository(storage);
    await comparisons.create({ product: { name: 'Leite' }, entries: [] } as never);
    await settings.update({ roundCents: true, displayBasis: 'per100' });
    storage.set('priceHistory.v1', '{}');

    await clearAllData(storage);

    expect(await comparisons.list()).toEqual([]);
    expect(await settings.get()).toEqual(DEFAULT_SETTINGS);
    expect(storage.getString('priceHistory.v1')).toBeUndefined();
  });

  it('wipes the history written by the price history repository (S.2)', async () => {
    const storage = new MemoryStorage();
    const history = new KeyValuePriceHistoryRepository(storage);
    await history.record('Leite', [{ priceCents: 459, unit: 'L' }]);
    expect(storage.getString(PRICE_HISTORY_KEY)).toBeDefined();

    await clearAllData(storage);

    expect(storage.getString(PRICE_HISTORY_KEY)).toBeUndefined();
    expect(await history.suggestions('Leite', 'L')).toEqual([]);
    expect(await new KeyValuePriceHistoryRepository(storage).listForProduct('Leite')).toEqual([]);
  });

  it('is a no-op on empty storage', async () => {
    await expect(clearAllData(new MemoryStorage())).resolves.toBeUndefined();
  });
});
