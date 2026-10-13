import type { SettingsRepository } from '@/business/repository/settings.repository';
import { DEFAULT_SETTINGS, type DisplayBasis } from '@/models/Settings';

// In-memory copy of the "Mostrar preço por" setting, so every mounted screen (Home, result card,
// Ajustes) sees a change at once. Storage stays the source of truth (settings repository).
export function createDisplayBasisStore(repository: SettingsRepository) {
  let basis: DisplayBasis = DEFAULT_SETTINGS.displayBasis;
  const listeners = new Set<() => void>();

  const set = (next: DisplayBasis) => {
    if (next === basis) return;
    basis = next;
    listeners.forEach((listener) => listener());
  };

  return {
    getSnapshot: () => basis,
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    // Reads the persisted value; call at startup and after anything that rewrites settings.
    async load() {
      try {
        set((await repository.get()).displayBasis);
      } catch {
        // Unreadable storage: keep the current value.
      }
    },
    // Optimistic: the UI switches first, then the choice is persisted.
    async setBasis(next: DisplayBasis) {
      set(next);
      await repository.update({ displayBasis: next });
    },
  };
}

export type DisplayBasisStore = ReturnType<typeof createDisplayBasisStore>;
