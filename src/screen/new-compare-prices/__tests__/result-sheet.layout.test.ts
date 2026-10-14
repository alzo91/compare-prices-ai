import { collapsedSnapPoint, SHEET_HANDLE_HEIGHT } from '../result-sheet.layout';

describe('collapsedSnapPoint', () => {
  it('adds the handle, the summary line and the footer', () => {
    expect(collapsedSnapPoint(56, 106)).toBe(SHEET_HANDLE_HEIGHT + 56 + 106);
  });

  it('rounds measured fractions up so the Save button is never clipped', () => {
    expect(collapsedSnapPoint(55.5, 100.2)).toBe(Math.ceil(SHEET_HANDLE_HEIGHT + 155.7));
  });
});
