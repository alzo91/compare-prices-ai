import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import { comparisonRepository } from '@/business/repository';
import type { ComparisonCardModel } from '@/components/organism/comparison-card';

import { buildComparisonCards } from './home.cards';
import { HomeScene } from './home.scene';

// Container: loads saved comparisons and handles navigation.
export function HomeContainer() {
  const [cards, setCards] = useState<ComparisonCardModel[]>([]);

  // Tabs stay mounted, so reload every time Home regains focus (e.g. after saving a comparison).
  useFocusEffect(
    useCallback(() => {
      let active = true;
      comparisonRepository
        .list()
        .then((list) => {
          if (active) setCards(buildComparisonCards(list));
        })
        .catch(() => {
          // Corrupt storage throws in the repository; Home shows no cards meanwhile.
        });
      return () => {
        active = false;
      };
    }, []),
  );

  return <HomeScene cards={cards} onOpenComparison={(id) => router.push(`/compare/${id}`)} />;
}
