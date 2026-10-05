// Minimal key-value contract the repositories need. Swap the engine (MMKV, memory…) by
// implementing this interface; repositories don't change.
export interface KeyValueStorage {
  getString(key: string): string | undefined;
  set(key: string, value: string): void;
  remove(key: string): void;
  clearAll(): void;
}
