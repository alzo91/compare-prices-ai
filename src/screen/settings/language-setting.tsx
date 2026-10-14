import { Text, View } from 'react-native';

import { Card } from '@/components/atoms/card';
import { Pill } from '@/components/atoms/pill';
import { useI18n } from '@/i18n';
import type { LanguagePreference } from '@/models/Settings';
import { languageStore, useLanguagePreference } from '@/store/useLanguagePreference';
import { useTheme } from '@/theme/useTheme';

import { styles } from './settings.layout';

const LANGUAGE_OPTIONS = [
  { value: 'device', labelKey: 'settings.language.device' },
  { value: 'pt-BR', labelKey: 'settings.language.ptBR' },
  { value: 'en-US', labelKey: 'settings.language.enUS' },
] as const satisfies readonly { value: LanguagePreference; labelKey: string }[];

// "Idioma" card: follow the device, or force Português (Brasil) / English (US).
// Picking one switches i18n at once (root layout), so every screen updates without a restart.
export function LanguageSetting() {
  const { colors } = useTheme();
  const { t } = useI18n();
  const preference = useLanguagePreference();
  return (
    <Card style={styles.group}>
      <Text style={[styles.rowLabel, { color: colors.text }]}>{t('settings.language.title')}</Text>
      <View accessibilityRole="radiogroup" style={styles.pills}>
        {LANGUAGE_OPTIONS.map(({ value, labelKey }) => (
          <Pill
            key={value}
            label={t(labelKey)}
            selected={preference === value}
            onPress={() => void languageStore.setPreference(value)}
            accessibilityLabel={t('settings.language.option', { option: t(labelKey) })}
          />
        ))}
      </View>
    </Card>
  );
}
