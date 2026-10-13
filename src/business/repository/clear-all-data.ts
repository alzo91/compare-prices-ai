import type { KeyValueStorage } from './storage/key-value-storage';

// "Apagar todos os dados" (S.1). Comparisons, price history and settings all live in the same
// storage, so one clearAll() wipes them together: there is no state where only part is gone.
// Don't replace this with per-repository deletes; that would break the atomicity.
export async function clearAllData(storage: KeyValueStorage): Promise<void> {
  storage.clearAll();
}
