import { randomUUID } from 'expo-crypto';

import type { ComparisonRepository } from './comparison.repository';
import { KeyValueComparisonRepository } from './kv-comparison.repository';
import { KeyValueSettingsRepository } from './kv-settings.repository';
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

// "Apagar todos os dados" (S.1): one call wipes comparisons, history and settings together.
export async function clearAllData(): Promise<void> {
  storage.clearAll();
}

export type { ComparisonRepository, SettingsRepository };
