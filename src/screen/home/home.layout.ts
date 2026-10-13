import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  list: {
    paddingBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    marginTop: 24,
    marginBottom: 16,
  },
  separator: {
    height: 12,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 48,
    gap: 12,
  },
  emptyIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emptyText: {
    textAlign: 'center',
  },
});
