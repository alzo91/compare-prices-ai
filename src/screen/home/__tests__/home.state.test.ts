import { getHomeViewState } from '../home.state';

describe('getHomeViewState', () => {
  it('is loading until the first load finishes', () => {
    expect(getHomeViewState(false, 0)).toBe('loading');
  });
  it('is empty when loaded with no comparisons', () => {
    expect(getHomeViewState(true, 0)).toBe('empty');
  });
  it('is list when loaded with comparisons', () => {
    expect(getHomeViewState(true, 3)).toBe('list');
  });
});
