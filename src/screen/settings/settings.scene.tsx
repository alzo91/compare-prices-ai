import { Pressable, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/atoms/icon';
import { useI18n } from '@/i18n';
import { useTheme } from '@/theme/useTheme';

import { styles } from './settings.layout';

type SettingsSceneProps = {
  onOpenAbout: () => void;
};

export function SettingsScene({ onOpenAbout }: SettingsSceneProps) {
  const { colors } = useTheme();
  const { t } = useI18n();
  return (
    <SafeAreaView
      edges={['top']}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Text style={[styles.title, { color: colors.text }]}>{t('settings.title')}</Text>
      <Pressable
        accessibilityRole="button"
        onPress={onOpenAbout}
        style={[styles.row, { backgroundColor: colors.surface }]}
      >
        <Text style={[styles.rowLabel, { color: colors.text }]}>{t('settings.about')}</Text>
        <Icon
          name={{ ios: 'chevron.right', android: 'chevron_right' }}
          color={colors.textMuted}
          size={18}
        />
      </Pressable>
    </SafeAreaView>
  );
}
