import { useEffect, useSyncExternalStore } from 'react';

import { settingsRepository } from '@/business/repository';
import type { LanguagePreference } from '@/models/Settings';

import { createLanguageStore } from './language.store';

export const languageStore = createLanguageStore(settingsRepository);

let loaded = false;

// Current "Idioma" choice, shared app-wide. Loads the persisted value on first use.
export function useLanguagePreference(): LanguagePreference {
  useEffect(() => {
    if (loaded) return;
    loaded = true;
    void languageStore.load();
  }, []);
  return useSyncExternalStore(languageStore.subscribe, languageStore.getSnapshot);
}
