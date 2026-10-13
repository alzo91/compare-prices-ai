import { DEFAULT_SETTINGS } from '@/models/Settings';

import { clearAllData } from '../clear-all-data';
import { KeyValueComparisonRepository } from '../kv-comparison.repository';
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

  it('is a no-op on empty storage', async () => {
    await expect(clearAllData(new MemoryStorage())).resolves.toBeUndefined();
  });
});
