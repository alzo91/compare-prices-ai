import { StyleSheet, Text, View } from 'react-native';

import { Text as AppText } from '@/components/atoms/text';
import { Toggle } from '@/components/atoms/toggle';
import { useI18n } from '@/i18n';
import { useTheme } from '@/theme/useTheme';

import { styles as settingsStyles } from './settings.layout';

type PriceHistorySettingProps = {
  value: boolean;
  onValueChange: (value: boolean) => void;
};

// "Manter histórico de preços" row (S.2). Sits at the top of the toggle card, above
// "Arredondar centavos", with a divider below it as in the Ajustes Designer screen.
export function PriceHistorySetting({ value, onValueChange }: PriceHistorySettingProps) {
  const { colors } = useTheme();
  const { t } = useI18n();
  return (
    <>
      <View style={settingsStyles.toggleRow}>
        <View style={settingsStyles.toggleText}>
          <Text style={[settingsStyles.rowLabel, { color: colors.text }]}>
            {t('settings.keepPriceHistory')}
          </Text>
          <AppText variant="caption" color="textMuted">
            {t('settings.keepPriceHistoryHint')}
          </AppText>
        </View>
        <Toggle
          value={value}
          onValueChange={onValueChange}
          accessibilityLabel={t('settings.keepPriceHistory')}
          accessibilityHint={t('settings.keepPriceHistoryHint')}
        />
      </View>
      <View style={[styles.divider, { backgroundColor: colors.divider }]} />
    </>
  );
}

const styles = StyleSheet.create({
  divider: { height: StyleSheet.hairlineWidth, marginVertical: 12 },
});
