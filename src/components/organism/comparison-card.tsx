import { Pressable, View } from 'react-native';

import { Badge } from '@/components/atoms/badge';
import { Card } from '@/components/atoms/card';
import { Icon } from '@/components/atoms/icon';
import { Text } from '@/components/atoms/text';
import { useI18n } from '@/i18n';
import { useFormat } from '@/i18n/format';
import type { Unit } from '@/models/Unit';
import { useTheme } from '@/theme/useTheme';

import { styles } from './comparison-card.layout';

// Numbers only; every sentence is built here from i18n so it follows the language.
export type ComparisonCardSummary =
  // "preço 1 é o mais barato · economia de R$ 6,40"
  | { kind: 'savings'; winnerRow: number; savingsCents: number }
  // "pacotes de 250 g e 500 g" / "embalagem de 1 L"
  | { kind: 'packages'; sizes: { quantity: number; unit: Unit }[] };

export type ComparisonCardModel = {
  id: string;
  name: string;
  // Lowest price per base unit in whole cents, e.g. 498 for R$ 4,98/kg.
  unitPriceCents: number;
  baseUnit: Unit;
  // The best entry as typed: "5 kg · R$ 24,90".
  best: { quantity: number; unit: Unit; priceCents: number };
  pricesCount: number;
  summary: ComparisonCardSummary;
};

export type ComparisonCardProps = {
  comparison: ComparisonCardModel;
  onPress: (id: string) => void;
};

// Home list item: name, "Melhor" badge, price per unit, best package and a summary line.
export function ComparisonCard({ comparison, onPress }: ComparisonCardProps) {
  const { colors } = useTheme();
  const { t } = useI18n();
  const { formatCents, formatNumber } = useFormat();

  const unitLabel = (unit: Unit) => t(`units.${unit}`);
  const sizeLabel = (quantity: number, unit: Unit) =>
    `${formatNumber(quantity)} ${unitLabel(unit)}`;

  const { best, summary } = comparison;
  let summaryText: string;
  if (summary.kind === 'savings') {
    summaryText = t('home.cheapestSummary', {
      index: summary.winnerRow,
      savings: formatCents(summary.savingsCents),
    });
  } else {
    const sizes = summary.sizes.map((s) => sizeLabel(s.quantity, s.unit));
    summaryText =
      sizes.length === 1
        ? t('home.packageSize', { size: sizes[0] })
        : t('home.packagesOf', { sizes: sizes.join(t('home.listAnd')) });
  }
  const unitPrice = formatCents(comparison.unitPriceCents);
  const unitSuffix = `/${unitLabel(comparison.baseUnit)}`;
  const pricesText = t('home.pricesCount', { count: comparison.pricesCount });
  const bestText = `${sizeLabel(best.quantity, best.unit)} · ${formatCents(best.priceCents)}`;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={[
        comparison.name,
        t('home.best'),
        unitPrice + unitSuffix,
        bestText,
        pricesText,
        summaryText,
      ].join('. ')}
      accessibilityHint={t('home.openComparison', { name: comparison.name })}
      onPress={() => onPress(comparison.id)}
    >
      <Card style={styles.card}>
        <View style={styles.header}>
          <Text variant="subtitle" style={styles.name} numberOfLines={2}>
            {comparison.name}
          </Text>
          <Icon
            name={{ ios: 'chevron.right', android: 'chevron_right' }}
            color={colors.textMuted}
            size={18}
          />
        </View>
        <View style={styles.priceRow}>
          <Badge label={t('home.best')} />
          <Text variant="subtitle" style={styles.price}>
            {unitPrice}
            <Text variant="bodyStrong" color="textMuted">
              {unitSuffix}
            </Text>
          </Text>
          <Text color="textMuted" style={styles.best}>
            {bestText}
          </Text>
        </View>
        <Text variant="caption" color="textMuted">
          {pricesText} · {summaryText}
        </Text>
      </Card>
    </Pressable>
  );
}
