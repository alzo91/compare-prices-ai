import { DEFAULT_SETTINGS, type Settings } from '@/models/Settings';

import type { SettingsRepository } from './settings.repository';
import type { KeyValueStorage } from './storage/key-value-storage';

const KEY = 'settings.v1';

export class KeyValueSettingsRepository implements SettingsRepository {
  constructor(private readonly storage: KeyValueStorage) {}

  async get() {
    const raw = this.storage.getString(KEY);
    // Merge so settings added in a later version get their default.
    return { ...DEFAULT_SETTINGS, ...(raw ? (JSON.parse(raw) as Partial<Settings>) : {}) };
  }

  async update(patch: Partial<Settings>) {
    const next = { ...(await this.get()), ...patch };
    this.storage.set(KEY, JSON.stringify(next));
    return next;
  }

  async reset() {
    this.storage.remove(KEY);
    return { ...DEFAULT_SETTINGS };
  }
}
