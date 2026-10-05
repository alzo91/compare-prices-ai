import type { PriceEntry } from './PriceEntry';
import type { Product } from './Product';

export type Comparison = {
  id: string;
  product: Product;
  entries: PriceEntry[];
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
};

// What a screen sends to create or update a comparison; the repository owns id and timestamps.
export type ComparisonInput = Pick<Comparison, 'product' | 'entries'>;
