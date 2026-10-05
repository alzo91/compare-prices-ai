import type { Settings } from '@/models/Settings';

export interface SettingsRepository {
  get(): Promise<Settings>; // always complete: missing fields fall back to DEFAULT_SETTINGS
  update(patch: Partial<Settings>): Promise<Settings>;
  reset(): Promise<Settings>;
}
