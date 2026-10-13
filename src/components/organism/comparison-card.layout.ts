import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  card: { gap: 12 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  name: { flex: 1 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  price: { flexShrink: 1 },
  best: { marginLeft: 'auto' },
});
