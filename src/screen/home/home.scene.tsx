import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useI18n } from '@/i18n';
import { useTheme } from '@/theme/useTheme';

import { styles } from './home.layout';

// Scene: pure UI, receives everything through props.
export function HomeScene() {
  const { colors } = useTheme();
  const { t } = useI18n();
  return (
    <SafeAreaView
      edges={['top']}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Text style={[styles.title, { color: colors.text }]}>{t('home.title')}</Text>
    </SafeAreaView>
  );
}
