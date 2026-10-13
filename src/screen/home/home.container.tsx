import { router, useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';

import { comparisonRepository } from '@/business/repository';
import type { ComparisonCardModel } from '@/components/organism/comparison-card';
import type { Comparison } from '@/models/Comparison';
import { useDisplayBasis } from '@/store/useDisplayBasis';

import { buildComparisonCards } from './home.cards';
import { HomeScene } from './home.scene';

// Container: loads saved comparisons and handles navigation.
export function HomeContainer() {
  const basis = useDisplayBasis();
  const [comparisons, setComparisons] = useState<Comparison[]>([]);
  const [loaded, setLoaded] = useState(false);
  // Re-derived when the display basis changes, without reloading from storage.
  const cards: ComparisonCardModel[] = useMemo(
    () => buildComparisonCards(comparisons, basis),
    [comparisons, basis],
  );

  // Tabs stay mounted, so reload every time Home regains focus (e.g. after saving a comparison).
  useFocusEffect(
    useCallback(() => {
      let active = true;
      comparisonRepository
        .list()
        .then((list) => {
          if (!active) return;
          setComparisons(list);
          setLoaded(true);
        })
        .catch(() => {
          // Corrupt storage throws in the repository; Home shows no cards meanwhile.
        });
      return () => {
        active = false;
      };
    }, []),
  );

  return (
    <HomeScene
      cards={cards}
      loaded={loaded}
      onOpenComparison={(id) => router.push(`/compare/${id}`)}
    />
  );
}
