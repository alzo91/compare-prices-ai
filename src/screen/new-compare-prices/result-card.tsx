import { View } from 'react-native';

import { Card } from '@/components/atoms/card';
import { Text } from '@/components/atoms/text';
import { useI18n } from '@/i18n';
import { useFormat } from '@/i18n/format';
import type { Unit } from '@/models/Unit';
import { useTheme } from '@/theme/useTheme';

import type { ResultCardModel } from './new-compare-prices.result';
import { styles } from './result-card.layout';

type ResultCardProps = {
  result: ResultCardModel;
};

// Live "Resultado" card: cheapest price per unit, that row's qty + price, and the savings line.
export function ResultCard({ result }: ResultCardProps) {
  const { colors } = useTheme();
  const { t } = useI18n();
  const { formatCents, formatNumber } = useFormat();

  const unitLabel = (unit: Unit) => t(`units.${unit}`);
  const quantityLabel = (quantity: number, unit: Unit) =>
    `${formatNumber(quantity)} ${unitLabel(unit)}`;

  const { winner, savings, cheapestRows } = result;
  const headline = winner
    ? t('newComparison.resultWinner', {
        index: cheapestRows[0],
        quantity: quantityLabel(winner.quantity, winner.unit),
        price: formatCents(winner.priceCents),
      })
    : t('newComparison.resultTie', { indexes: cheapestRows.join(', ') });
  const savingsDetail =
    savings &&
    t('newComparison.resultBelowSecondDetail', {
      difference: formatCents(savings.differenceCents),
      quantity: quantityLabel(savings.quantity, savings.unit),
    });

  return (
    <Card
      tone="highlight"
      // One screen-reader element: the colour alone never says "cheapest".
      accessibilityLabel={[
        t('newComparison.result'),
        `${formatCents(result.centsPerBaseUnit)}/${unitLabel(result.baseUnit)}`,
        headline,
        savings && `${savings.percent}% ${savingsDetail}`,
      ]
        .filter(Boolean)
        .join('. ')}
      style={styles.card}
    >
      <Text variant="caption" color="accent2Strong" style={styles.eyebrow}>
        {t('newComparison.result')}
      </Text>
      <View style={styles.priceRow}>
        <Text variant="display" color="accent2Strong" style={styles.price}>
          {formatCents(result.centsPerBaseUnit)}
        </Text>
        <Text variant="subtitle" color="accent2Strong" style={styles.unit}>
          /{unitLabel(result.baseUnit)}
        </Text>
      </View>
      <Text color="accent2Strong">{headline}</Text>
      {savings ? (
        <View style={[styles.savings, { backgroundColor: colors.background }]}>
          <Text variant="subtitle" color="accent2Strong" style={styles.savingsPercent}>
            {savings.percent}%
          </Text>
          <Text color="accent2Strong" style={styles.savingsText}>
            {savingsDetail}
          </Text>
        </View>
      ) : null}
    </Card>
  );
}
