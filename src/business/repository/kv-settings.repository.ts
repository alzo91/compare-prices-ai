import { DEFAULT_SETTINGS, type Settings } from '@/models/Settings';

import type { SettingsRepository } from './settings.repository';
import type { KeyValueStorage } from './storage/key-value-storage';

const KEY = 'settings.v1';

export class KeyValueSettingsRepository implements SettingsRepository {
  constructor(private readonly storage: KeyValueStorage) {}

  async get() {
    // Merge so settings added in a later version get their default.
    return { ...DEFAULT_SETTINGS, ...this.read() };
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

  // Settings are cheap to lose, so unreadable data falls back to defaults (unlike comparisons).
  private read(): Partial<Settings> {
    const raw = this.storage.getString(KEY);
    if (!raw) return {};
    try {
      const parsed: unknown = JSON.parse(raw);
      return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
        ? (parsed as Partial<Settings>)
        : {};
    } catch {
      return {};
    }
  }
}
