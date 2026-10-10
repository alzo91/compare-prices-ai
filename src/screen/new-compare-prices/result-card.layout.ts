import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  card: {
    gap: 12,
    padding: 22,
    borderRadius: 32,
  },
  eyebrow: {
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
  },
  price: {
    fontSize: 50,
    lineHeight: 52,
    letterSpacing: -1,
  },
  unit: {
    paddingBottom: 5,
  },
  savings: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 22,
  },
  savingsPercent: {
    flexShrink: 0,
  },
  savingsText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
});
