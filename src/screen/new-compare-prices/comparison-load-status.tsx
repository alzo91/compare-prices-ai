import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/atoms/icon';
import { Text } from '@/components/atoms/text';
import { useI18n } from '@/i18n';
import { useTheme } from '@/theme/useTheme';

type ComparisonLoadStatusProps = {
  title: string;
  state: 'loading' | 'notFound' | 'failed';
  onClose: () => void;
};

const MESSAGE_KEY = {
  loading: 'newComparison.loading',
  notFound: 'newComparison.notFound',
  failed: 'newComparison.loadError',
} as const;

// Shown instead of the form while a saved comparison loads, or when it cannot be opened.
export function ComparisonLoadStatus({ title, state, onClose }: ComparisonLoadStatusProps) {
  const { colors } = useTheme();
  const { t } = useI18n();
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('common.back')}
          onPress={onClose}
          style={[styles.close, { backgroundColor: colors.surface }]}
        >
          <Icon name={{ ios: 'chevron.left', android: 'chevron_left' }} color={colors.text} />
        </Pressable>
        <Text variant="title">{title}</Text>
      </View>
      <Text color="textMuted" style={styles.message}>
        {t(MESSAGE_KEY[state])}
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 24 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 16 },
  close: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: { marginTop: 24 },
});
