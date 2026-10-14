import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card } from '@/components/atoms/card';
import { Icon } from '@/components/atoms/icon';
import { Pill } from '@/components/atoms/pill';
import { Text as AppText } from '@/components/atoms/text';
import { Toggle } from '@/components/atoms/toggle';
import { useI18n } from '@/i18n';
import { useFormat } from '@/i18n/format';
import type { DisplayBasis } from '@/models/Settings';
import { useTheme } from '@/theme/useTheme';

import { PriceHistorySetting } from './price-history-setting';
import { styles } from './settings.layout';

const BASIS_OPTIONS = [
  { value: 'base', labelKey: 'settings.basisBase' },
  { value: 'per100', labelKey: 'settings.basisPer100' },
  { value: 'unit', labelKey: 'settings.basisUnit' },
] as const satisfies readonly { value: DisplayBasis; labelKey: string }[];

type SettingsSceneProps = {
  displayBasis: DisplayBasis;
  onChangeDisplayBasis: (basis: DisplayBasis) => void;
  keepPriceHistory: boolean;
  onChangeKeepPriceHistory: (value: boolean) => void;
  roundCents: boolean;
  onChangeRoundCents: (value: boolean) => void;
  onOpenAbout: () => void;
  onDeleteAllData: () => void;
};

export function SettingsScene({
  displayBasis,
  onChangeDisplayBasis,
  keepPriceHistory,
  onChangeKeepPriceHistory,
  roundCents,
  onChangeRoundCents,
  onOpenAbout,
  onDeleteAllData,
}: SettingsSceneProps) {
  const { colors } = useTheme();
  const { t } = useI18n();
  const { formatCents } = useFormat();
  // Example from the Designer: R$ 4,98 -> R$ 5.
  const hint = t('settings.roundCentsHint', {
    rounded: formatCents(500, { minimumFractionDigits: 0, maximumFractionDigits: 0 }),
    exact: formatCents(498),
  });
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
      <Card style={styles.toggleCard}>
        <PriceHistorySetting value={keepPriceHistory} onValueChange={onChangeKeepPriceHistory} />
        <View style={styles.toggleRow}>
          <View style={styles.toggleText}>
            <Text style={[styles.rowLabel, { color: colors.text }]}>
              {t('settings.roundCents')}
            </Text>
            <AppText variant="caption" color="textMuted">
              {hint}
            </AppText>
          </View>
          <Toggle
            value={roundCents}
            onValueChange={onChangeRoundCents}
            accessibilityLabel={t('settings.roundCents')}
            accessibilityHint={hint}
          />
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
