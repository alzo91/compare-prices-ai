import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/atoms/icon';
import { useI18n } from '@/i18n';
import { useTheme } from '@/theme/useTheme';

import { styles } from './about.layout';

type AboutSceneProps = {
  version: string;
  onBack: () => void;
};

export function AboutScene({ version, onBack }: AboutSceneProps) {
  const { colors } = useTheme();
  const { t } = useI18n();
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('common.back')}
          onPress={onBack}
          style={[styles.back, { backgroundColor: colors.surface }]}
        >
          <Icon name={{ ios: 'chevron.left', android: 'chevron_left' }} color={colors.text} />
        </Pressable>
        <Text style={[styles.title, { color: colors.text }]}>{t('about.title')}</Text>
      </View>
      <Text style={[styles.version, { color: colors.textMuted }]}>
        {t('about.version', { version })}
      </Text>
    </SafeAreaView>
  );
}
