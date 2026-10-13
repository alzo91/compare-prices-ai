import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card } from '@/components/atoms/card';
import { Icon } from '@/components/atoms/icon';
import { Pill } from '@/components/atoms/pill';
import { Text as AppText } from '@/components/atoms/text';
import { useI18n } from '@/i18n';
import type { DisplayBasis } from '@/models/Settings';
import { useTheme } from '@/theme/useTheme';

import { styles } from './settings.layout';

const BASIS_OPTIONS = [
  { value: 'base', labelKey: 'settings.basisBase' },
  { value: 'per100', labelKey: 'settings.basisPer100' },
  { value: 'unit', labelKey: 'settings.basisUnit' },
] as const satisfies readonly { value: DisplayBasis; labelKey: string }[];

type SettingsSceneProps = {
  displayBasis: DisplayBasis;
  onChangeDisplayBasis: (basis: DisplayBasis) => void;
  onOpenAbout: () => void;
  onDeleteAllData: () => void;
};

export function SettingsScene({
  displayBasis,
  onChangeDisplayBasis,
  onOpenAbout,
  onDeleteAllData,
}: SettingsSceneProps) {
  const { colors } = useTheme();
  const { t } = useI18n();
  return (
    <SafeAreaView
      edges={['top']}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Text style={[styles.title, { color: colors.text }]}>{t('settings.title')}</Text>
      <Card style={styles.group}>
        <AppText variant="caption" color="accent" style={styles.eyebrow}>
          {t('settings.comparisonSection')}
        </AppText>
        <Text style={[styles.rowLabel, { color: colors.text }]}>{t('settings.showPricePer')}</Text>
        <View accessibilityRole="radiogroup" style={styles.pills}>
          {BASIS_OPTIONS.map(({ value, labelKey }) => (
            <Pill
              key={value}
              label={t(labelKey)}
              selected={displayBasis === value}
              onPress={() => onChangeDisplayBasis(value)}
              accessibilityLabel={`${t('settings.showPricePer')}: ${t(labelKey)}`}
            />
          ))}
        </View>
      </Card>
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
      <Pressable accessibilityRole="button" onPress={onDeleteAllData} style={styles.deleteButton}>
        <Text style={[styles.deleteLabel, { color: colors.accentText }]}>
          {t('settings.deleteAllData')}
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}
