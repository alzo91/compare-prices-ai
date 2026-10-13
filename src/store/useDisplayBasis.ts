import { useEffect, useSyncExternalStore } from 'react';

import { settingsRepository } from '@/business/repository';
import type { DisplayBasis } from '@/models/Settings';

import { createDisplayBasisStore } from './display-basis.store';

export const displayBasisStore = createDisplayBasisStore(settingsRepository);

let loaded = false;

// Current "Mostrar preço por" choice, shared app-wide. Loads the persisted value on first use.
export function useDisplayBasis(): DisplayBasis {
  useEffect(() => {
    if (loaded) return;
    loaded = true;
    void displayBasisStore.load();
  }, []);
  return useSyncExternalStore(displayBasisStore.subscribe, displayBasisStore.getSnapshot);
}
