import { useEffect, useSyncExternalStore } from 'react';

import { settingsRepository } from '@/business/repository';

import { createKeepPriceHistoryStore } from './keep-price-history.store';

export const keepPriceHistoryStore = createKeepPriceHistoryStore(settingsRepository);

let loaded = false;

// Current "Manter histórico de preços" choice, shared app-wide. Loads the persisted value on
// first use.
export function useKeepPriceHistory(): boolean {
  useEffect(() => {
    if (loaded) return;
    loaded = true;
    void keepPriceHistoryStore.load();
  }, []);
  return useSyncExternalStore(keepPriceHistoryStore.subscribe, keepPriceHistoryStore.getSnapshot);
}
