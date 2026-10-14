import { getHomeViewState } from '../home.state';

describe('getHomeViewState', () => {
  it('is loading until the first load finishes', () => {
    expect(getHomeViewState(false, 0)).toBe('loading');
  });
  it('is empty when loaded with no comparisons', () => {
    expect(getHomeViewState(true, 0)).toBe('empty');
  });
  it('is noResults when comparisons exist but the search matches none', () => {
    expect(getHomeViewState(true, 3, 0)).toBe('noResults');
  });
  it('stays empty (not noResults) when there are no comparisons at all', () => {
    expect(getHomeViewState(true, 0, 0)).toBe('empty');
  });
  it('is list when loaded with comparisons', () => {
    expect(getHomeViewState(true, 3)).toBe('list');
  });
});
