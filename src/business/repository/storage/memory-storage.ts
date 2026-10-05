import type { KeyValueStorage } from './key-value-storage';

// In-memory storage for tests and previews. Nothing survives a restart.
export class MemoryStorage implements KeyValueStorage {
  private readonly data = new Map<string, string>();

  getString(key: string) {
    return this.data.get(key);
  }

  set(key: string, value: string) {
    this.data.set(key, value);
  }

  remove(key: string) {
    this.data.delete(key);
  }

  clearAll() {
    this.data.clear();
  }
}
