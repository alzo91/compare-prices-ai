import type { Comparison, ComparisonInput } from '@/models/Comparison';

import type { ComparisonRepository } from './comparison.repository';
import type { KeyValueStorage } from './storage/key-value-storage';

// All comparisons live in one JSON document: the data set is small (dozens to hundreds of
// rows) and a single write keeps each change atomic.
const KEY = 'comparisons.v1';

type Options = {
  generateId: () => string;
  now?: () => Date;
};

export class KeyValueComparisonRepository implements ComparisonRepository {
  private readonly now: () => Date;

  constructor(
    private readonly storage: KeyValueStorage,
    private readonly options: Options,
  ) {
    this.now = options.now ?? (() => new Date());
  }

  async list() {
    return this.read().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }

  async get(id: string) {
    return this.read().find((c) => c.id === id);
  }

  async create(input: ComparisonInput) {
    const timestamp = this.now().toISOString();
    const comparison: Comparison = {
      id: this.options.generateId(),
      product: input.product,
      entries: input.entries,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    this.write([...this.read(), comparison]);
    return comparison;
  }

  async update(id: string, input: ComparisonInput) {
    const all = this.read();
    const index = all.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new Error(`Comparison not found: ${id}`);
    }
    const updated: Comparison = {
      ...all[index],
      product: input.product,
      entries: input.entries,
      updatedAt: this.now().toISOString(),
    };
    all[index] = updated;
    this.write(all);
    return updated;
  }

  async remove(id: string) {
    this.write(this.read().filter((c) => c.id !== id));
  }

  private read(): Comparison[] {
    const raw = this.storage.getString(KEY);
    // Corrupt data throws instead of returning [] — the next write would erase it.
    return raw ? (JSON.parse(raw) as Comparison[]) : [];
  }

  private write(comparisons: Comparison[]) {
    this.storage.set(KEY, JSON.stringify(comparisons));
  }
}
