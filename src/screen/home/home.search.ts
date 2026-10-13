// Lowercase and strip accents so "feijao" matches "Feijão" and "CAFE" matches "Café".
export function normalizeSearchText(text: string): string {
  return text.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().trim();
}

// Filters items by product name (case/accent-insensitive substring). A blank query keeps everything.
export function filterByProductName<T extends { name: string }>(
  items: readonly T[],
  query: string,
): T[] {
  const needle = normalizeSearchText(query);
  if (needle === '') return [...items];
  return items.filter((item) => normalizeSearchText(item.name).includes(needle));
}
