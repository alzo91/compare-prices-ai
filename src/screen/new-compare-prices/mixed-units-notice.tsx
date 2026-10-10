import { StyleSheet, View } from 'react-native';

import { Card } from '@/components/atoms/card';
import { Text } from '@/components/atoms/text';
import { useI18n } from '@/i18n';
import { useTheme } from '@/theme/useTheme';

// Shown instead of the result when the rows mix measurement types (kg with L, ...).
export function MixedUnitsNotice() {
  const { t } = useI18n();
  const { colors } = useTheme();
  return (
    <Card style={[styles.card, { borderColor: colors.accentText }]}>
      <View
        style={styles.body}
        accessible
        accessibilityRole="alert"
        accessibilityLiveRegion="polite"
      >
        <Text variant="body" color="accent" style={styles.title}>
          {t('validation.mixedUnitsTitle')}
        </Text>
        <Text variant="body">{t('validation.mixedUnits')}</Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1 },
  body: { gap: 4 },
  title: { fontWeight: '700' },
});
