import { useEffect, useSyncExternalStore } from 'react';

import { settingsRepository } from '@/business/repository';

import { createRoundCentsStore } from './round-cents.store';

export const roundCentsStore = createRoundCentsStore(settingsRepository);

let loaded = false;

// Current "Arredondar centavos" choice, shared app-wide. Loads the persisted value on first use.
export function useRoundCents(): boolean {
  useEffect(() => {
    if (loaded) return;
    loaded = true;
    void roundCentsStore.load();
  }, []);
  return useSyncExternalStore(roundCentsStore.subscribe, roundCentsStore.getSnapshot);
}
