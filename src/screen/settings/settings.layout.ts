import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    gap: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    marginTop: 24,
  },
  group: {
    gap: 12,
  },
  eyebrow: {
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  pills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderRadius: 24,
  },
  rowLabel: {
    fontSize: 17,
  },
  deleteButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  deleteLabel: {
    fontSize: 17,
  },
});
