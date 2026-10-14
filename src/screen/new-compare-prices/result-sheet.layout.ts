import { StyleSheet } from 'react-native';

// Height of @gorhom/bottom-sheet's default handle (10 pt padding above and below a 4 pt bar).
export const SHEET_HANDLE_HEIGHT = 24;

// Collapsed snap point: handle + summary line + footer (Save, error, bottom inset).
export function collapsedSnapPoint(summaryHeight: number, footerHeight: number): number {
  return Math.ceil(SHEET_HANDLE_HEIGHT + summaryHeight + footerHeight);
}

// The form just went from incomplete to complete: the moment the sheet opens fully on its own.
export function becameComplete(wasValid: boolean, isValid: boolean): boolean {
  return !wasValid && isValid;
}

export const styles = StyleSheet.create({
  sheet: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 12,
  },
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 48,
    paddingHorizontal: 24,
    paddingBottom: 8,
  },
  summaryText: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'baseline',
    flexWrap: 'wrap',
    columnGap: 8,
  },
  summaryLine: {
    flexShrink: 1,
  },
  details: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 8,
    gap: 8,
  },
});
