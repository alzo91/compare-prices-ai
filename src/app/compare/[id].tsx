import { useLocalSearchParams } from 'expo-router';

import { NewComparePricesContainer } from '@/screen/new-compare-prices/new-compare-prices.container';

// Detail / edit reuses the New Comparison screen (Epic 6).
export default function CompareDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <NewComparePricesContainer comparisonId={id} />;
}
