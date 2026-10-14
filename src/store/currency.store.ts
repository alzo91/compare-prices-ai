import type { SettingsRepository } from '@/business/repository/settings.repository';
import { toCurrency } from '@/i18n/currency';
import { type Currency, DEFAULT_SETTINGS } from '@/models/Settings';

// In-memory copy of the "Moeda" setting, so every mounted screen (Home, result card, form,
// Ajustes) formats prices in the new currency at once. Storage stays the source of truth.
export function createCurrencyStore(repository: SettingsRepository) {
  let currency: Currency = DEFAULT_SETTINGS.currency;
  const listeners = new Set<() => void>();

  const set = (next: Currency) => {
    if (next === currency) return;
    currency = next;
    listeners.forEach((listener) => listener());
  };

  return {
    getSnapshot: () => currency,
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    // Reads the persisted value; call at startup and after anything that rewrites settings.
    async load() {
      try {
        set(toCurrency((await repository.get()).currency));
      } catch {
        // Unreadable storage: keep the current value.
      }
    },
    // Optimistic: the UI switches first, then the choice is persisted.
    async setCurrency(next: Currency) {
      set(next);
      await repository.update({ currency: next });
    },
  };
}

export type CurrencyStore = ReturnType<typeof createCurrencyStore>;
