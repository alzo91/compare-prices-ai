import { Text, View } from 'react-native';

import { Card } from '@/components/atoms/card';
import { Pill } from '@/components/atoms/pill';
import { useI18n } from '@/i18n';
import { CURRENCIES } from '@/models/Settings';
import { currencyStore, useCurrency } from '@/store/useCurrency';
import { useTheme } from '@/theme/useTheme';

import { styles } from './settings.layout';

// "Moeda" (7.3): picks the currency every price in the app is formatted with. Default Real (R$).
// Self-contained (reads and writes the currency store) so the settings scene only renders it.
export function CurrencySetting() {
  const { colors } = useTheme();
  const { t } = useI18n();
  const currency = useCurrency();
  const label = t('settings.currency.label');

  return (
    <Card style={styles.group}>
      <Text style={[styles.rowLabel, { color: colors.text }]}>{label}</Text>
      <View accessibilityRole="radiogroup" style={styles.pills}>
        {CURRENCIES.map((value) => (
          <Pill
            key={value}
            label={t(`settings.currency.${value}`)}
            size="small"
            selected={currency === value}
            onPress={() => void currencyStore.setCurrency(value)}
            accessibilityLabel={`${label}: ${t(`settings.currency.${value}`)}`}
          />
        ))}
      </View>
    </Card>
  );
}
