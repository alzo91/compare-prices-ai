import { createMMKV, type MMKV } from 'react-native-mmkv';

import type { KeyValueStorage } from './key-value-storage';

export class MMKVStorage implements KeyValueStorage {
  private readonly mmkv: MMKV;

  constructor(id = 'compare-prices') {
    this.mmkv = createMMKV({ id });
  }

  getString(key: string) {
    return this.mmkv.getString(key);
  }

  set(key: string, value: string) {
    this.mmkv.set(key, value);
  }

  remove(key: string) {
    this.mmkv.remove(key);
  }

  clearAll() {
    this.mmkv.clearAll();
  }
}
