import type { SettingsRepository } from '@/business/repository/settings.repository';
import { DEFAULT_SETTINGS } from '@/models/Settings';

// In-memory copy of the "Manter histórico de preços" setting (S.2), so Ajustes and the
// comparison form see a change at once. Storage stays the source of truth (settings repository).
export function createKeepPriceHistoryStore(repository: SettingsRepository) {
  let enabled: boolean = DEFAULT_SETTINGS.keepPriceHistory;
  const listeners = new Set<() => void>();

  const set = (next: boolean) => {
    if (next === enabled) return;
    enabled = next;
    listeners.forEach((listener) => listener());
  };

  return {
    getSnapshot: () => enabled,
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    // Reads the persisted value; call at startup and after anything that rewrites settings.
    async load() {
      try {
        set((await repository.get()).keepPriceHistory);
      } catch {
        // Unreadable storage: keep the current value.
      }
    },
    // Optimistic: the UI switches first, then the choice is persisted.
    async setEnabled(next: boolean) {
      set(next);
      await repository.update({ keepPriceHistory: next });
    },
  };
}

export type KeepPriceHistoryStore = ReturnType<typeof createKeepPriceHistoryStore>;
