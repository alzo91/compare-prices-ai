import { useEffect, useSyncExternalStore } from 'react';

import { settingsRepository } from '@/business/repository';
import type { Currency } from '@/models/Settings';

import { createCurrencyStore } from './currency.store';

export const currencyStore = createCurrencyStore(settingsRepository);

let loaded = false;

// Current "Moeda" choice, shared app-wide. Loads the persisted value on first use.
export function useCurrency(): Currency {
  useEffect(() => {
    if (loaded) return;
    loaded = true;
    void currencyStore.load();
  }, []);
  return useSyncExternalStore(currencyStore.subscribe, currencyStore.getSnapshot);
}
