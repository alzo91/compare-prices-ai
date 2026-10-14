import type { SettingsRepository } from '@/business/repository/settings.repository';
import type { LanguagePreference } from '@/models/Settings';

export const DEFAULT_LANGUAGE_PREFERENCE: LanguagePreference = 'device';

const PREFERENCES: readonly LanguagePreference[] = ['device', 'pt-BR', 'en-US'];

// Unknown / missing stored values (older data) mean "follow the device".
export function normalizeLanguagePreference(value: unknown): LanguagePreference {
  return (PREFERENCES as readonly unknown[]).includes(value)
    ? (value as LanguagePreference)
    : DEFAULT_LANGUAGE_PREFERENCE;
}

// In-memory copy of the "Idioma" setting. The root layout reads it and switches i18n, so every
// mounted screen re-renders in the new language. Storage stays the source of truth.
export function createLanguageStore(repository: SettingsRepository) {
  let preference: LanguagePreference = DEFAULT_LANGUAGE_PREFERENCE;
  const listeners = new Set<() => void>();

  const set = (next: LanguagePreference) => {
    if (next === preference) return;
    preference = next;
    listeners.forEach((listener) => listener());
  };

  return {
    getSnapshot: () => preference,
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    // Reads the persisted value; call at startup and after anything that rewrites settings.
    async load() {
      try {
        set(normalizeLanguagePreference((await repository.get()).languagePreference));
      } catch {
        // Unreadable storage: keep the current value.
      }
    },
    // Optimistic: the UI switches first, then the choice is persisted.
    async setPreference(next: LanguagePreference) {
      set(next);
      await repository.update({ languagePreference: next });
    },
  };
}

export type LanguageStore = ReturnType<typeof createLanguageStore>;
