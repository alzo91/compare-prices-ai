import type { Comparison, ComparisonInput } from '@/models/Comparison';

// Async on purpose: today's MMKV implementation is synchronous, but a SQLite or cloud
// implementation won't be, and callers shouldn't change when the engine does.
export interface ComparisonRepository {
  list(): Promise<Comparison[]>; // newest updatedAt first
  get(id: string): Promise<Comparison | undefined>;
  create(input: ComparisonInput): Promise<Comparison>;
  update(id: string, input: ComparisonInput): Promise<Comparison>; // throws if id is unknown
  remove(id: string): Promise<void>;
}
