import { becameComplete, collapsedSnapPoint, SHEET_HANDLE_HEIGHT } from '../result-sheet.layout';

describe('collapsedSnapPoint', () => {
  it('adds the handle, the summary line and the footer', () => {
    expect(collapsedSnapPoint(56, 106)).toBe(SHEET_HANDLE_HEIGHT + 56 + 106);
  });

  it('rounds measured fractions up so the Save button is never clipped', () => {
    expect(collapsedSnapPoint(55.5, 100.2)).toBe(Math.ceil(SHEET_HANDLE_HEIGHT + 155.7));
  });
});

describe('becameComplete', () => {
  it('is true only when the form goes from incomplete to complete', () => {
    expect(becameComplete(false, true)).toBe(true);
  });

  it('stays false while the form stays complete (editing a filled field, edit screen at mount)', () => {
    expect(becameComplete(true, true)).toBe(false);
  });

  it('is false while incomplete or when a new blank price makes it incomplete', () => {
    expect(becameComplete(false, false)).toBe(false);
    expect(becameComplete(true, false)).toBe(false);
  });
});
