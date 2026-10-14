import { randomUUID } from 'expo-crypto';

import { clearAllData as clearStorage } from './clear-all-data';
import type { ComparisonRepository } from './comparison.repository';
import { KeyValueComparisonRepository } from './kv-comparison.repository';
import { KeyValuePriceHistoryRepository } from './kv-price-history.repository';
import { KeyValueSettingsRepository } from './kv-settings.repository';
import type { PriceHistoryRepository } from './price-history.repository';
import type { SettingsRepository } from './settings.repository';
import { MMKVStorage } from './storage/mmkv-storage';

// The only place that picks implementations. To change storage, swap the classes here;
// everything else imports the interfaces below.
const storage = new MMKVStorage();

export const comparisonRepository: ComparisonRepository = new KeyValueComparisonRepository(
  storage,
  {
    generateId: randomUUID,
  },
);

export const settingsRepository: SettingsRepository = new KeyValueSettingsRepository(storage);

export const priceHistoryRepository: PriceHistoryRepository = new KeyValuePriceHistoryRepository(
  storage,
);

// "Apagar todos os dados" (S.1): one call wipes comparisons, history and settings together.
export async function clearAllData(): Promise<void> {
  return clearStorage(storage);
}

export { recordPriceHistory, suggestPrices } from './price-history.suggestions';
export type { ComparisonRepository, PriceHistoryRepository, SettingsRepository };
