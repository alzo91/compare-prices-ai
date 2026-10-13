import type { SettingsRepository } from '@/business/repository/settings.repository';
import { DEFAULT_SETTINGS } from '@/models/Settings';

// In-memory copy of the "Arredondar centavos" setting, so every mounted screen (Home, result card,
// Ajustes) sees a change at once. Storage stays the source of truth (settings repository).
export function createRoundCentsStore(repository: SettingsRepository) {
  let enabled: boolean = DEFAULT_SETTINGS.roundCents;
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
        set((await repository.get()).roundCents);
      } catch {
        // Unreadable storage: keep the current value.
      }
    },
    // Optimistic: the UI switches first, then the choice is persisted.
    async setEnabled(next: boolean) {
      set(next);
      await repository.update({ roundCents: next });
    },
  };
}

export type RoundCentsStore = ReturnType<typeof createRoundCentsStore>;
