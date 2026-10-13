import { FlatList, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ComparisonCard, type ComparisonCardModel } from '@/components/organism/comparison-card';
import { useI18n } from '@/i18n';
import { useTheme } from '@/theme/useTheme';

import { styles } from './home.layout';

type HomeSceneProps = {
  cards: ComparisonCardModel[];
  onOpenComparison: (id: string) => void;
};

function Separator() {
  return <View style={styles.separator} />;
}

// Scene: pure UI, receives everything through props.
export function HomeScene({ cards, onOpenComparison }: HomeSceneProps) {
  const { colors } = useTheme();
  const { t } = useI18n();
  return (
    <SafeAreaView
      edges={['top']}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <FlatList
        data={cards}
        keyExtractor={(card) => card.id}
        ListHeaderComponent={
          <Text style={[styles.title, { color: colors.text }]}>{t('home.title')}</Text>
        }
        renderItem={({ item }) => <ComparisonCard comparison={item} onPress={onOpenComparison} />}
        ItemSeparatorComponent={Separator}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}
