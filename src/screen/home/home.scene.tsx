import { FlatList, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/atoms/icon';
import { Text as ThemedText } from '@/components/atoms/text';
import { ComparisonCard, type ComparisonCardModel } from '@/components/organism/comparison-card';
import { useI18n } from '@/i18n';
import { useTheme } from '@/theme/useTheme';

import { styles } from './home.layout';
import { getHomeViewState } from './home.state';

type HomeSceneProps = {
  cards: ComparisonCardModel[];
  // False until the first load finishes (avoids flashing the empty state).
  loaded: boolean;
  onOpenComparison: (id: string) => void;
};

function Separator() {
  return <View style={styles.separator} />;
}

// Scene: pure UI, receives everything through props.
export function HomeScene({ cards, loaded, onOpenComparison }: HomeSceneProps) {
  const { colors } = useTheme();
  const { t } = useI18n();
  const viewState = getHomeViewState(loaded, cards.length);
  const title = <Text style={[styles.title, { color: colors.text }]}>{t('home.title')}</Text>;
  return (
    <SafeAreaView
      edges={['top']}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {viewState === 'empty' ? (
        <>
          {title}
          <View style={styles.empty} testID="home-empty-state">
            <View style={[styles.emptyIcon, { backgroundColor: colors.accentSoft }]}>
              <Icon
                name={{ ios: 'plus.circle', android: 'add_circle' }}
                color={colors.accentText}
                size={48}
              />
            </View>
            <ThemedText variant="title" style={styles.emptyText}>
              {t('home.emptyTitle')}
            </ThemedText>
            <ThemedText color="textMuted" style={styles.emptyText}>
              {t('home.emptyBody')}
            </ThemedText>
          </View>
        </>
      ) : (
        <FlatList
          data={cards}
          keyExtractor={(card) => card.id}
          ListHeaderComponent={title}
          renderItem={({ item }) => <ComparisonCard comparison={item} onPress={onOpenComparison} />}
          ItemSeparatorComponent={Separator}
          contentContainerStyle={styles.list}
        />
      )}
    </SafeAreaView>
  );
}
