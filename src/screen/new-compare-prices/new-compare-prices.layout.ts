import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginTop: 16,
  },
  close: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
  },
  content: {
    paddingTop: 24,
    paddingBottom: 32,
    gap: 16,
  },
  subtitle: {
    fontSize: 32,
    lineHeight: 36,
    fontWeight: '800',
  },
  section: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    paddingHorizontal: 4,
  },
  sectionLabel: {
    fontSize: 13,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    paddingHorizontal: 8,
  },
  // Text-only destructive action, same style as Settings "Apagar todos os dados".
  deleteButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  deleteLabel: {
    fontSize: 17,
  },
});
