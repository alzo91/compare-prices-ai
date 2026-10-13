export type HomeViewState = 'loading' | 'empty' | 'noResults' | 'list';

// Home shows the empty state only after the first load finished with no comparisons,
// so it never flashes while storage is still being read.
// `noResults` = comparisons exist but the search matched none of them (distinct from `empty`).
// `visibleCount` defaults to `count` when no search is applied.
export function getHomeViewState(
  loaded: boolean,
  count: number,
  visibleCount: number = count,
): HomeViewState {
  if (!loaded) return 'loading';
  if (count === 0) return 'empty';
  return visibleCount === 0 ? 'noResults' : 'list';
}
