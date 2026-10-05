import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/atoms/icon';
import { useI18n } from '@/i18n';
import { useTheme } from '@/theme/useTheme';

import { styles } from './new-compare-prices.layout';

type NewComparePricesSceneProps = {
  title: string;
  onClose: () => void;
};

export function NewComparePricesScene({ title, onClose }: NewComparePricesSceneProps) {
  const { colors } = useTheme();
  const { t } = useI18n();
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('common.close')}
          onPress={onClose}
          style={[styles.close, { backgroundColor: colors.surface }]}
        >
          <Icon name={{ ios: 'xmark', android: 'close' }} color={colors.text} />
        </Pressable>
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      </View>
    </SafeAreaView>
  );
}
