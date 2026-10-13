export type HomeViewState = 'loading' | 'empty' | 'list';

// Home shows the empty state only after the first load finished with no comparisons,
// so it never flashes while storage is still being read.
export function getHomeViewState(loaded: boolean, count: number): HomeViewState {
  if (!loaded) return 'loading';
  return count === 0 ? 'empty' : 'list';
}
