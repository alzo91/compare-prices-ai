import { router } from 'expo-router';

import { useI18n } from '@/i18n';

import { NewComparePricesScene } from './new-compare-prices.scene';

type NewComparePricesContainerProps = {
  // Set when editing a saved comparison (compare/[id], Epic 6).
  comparisonId?: string;
};

// Container: form state and the comparison engine come with Epics 3 and 4.
export function NewComparePricesContainer({ comparisonId }: NewComparePricesContainerProps) {
  const { t } = useI18n();
  const title = comparisonId ? t('newComparison.editTitle') : t('newComparison.title');
  return <NewComparePricesScene title={title} onClose={() => router.back()} />;
}
