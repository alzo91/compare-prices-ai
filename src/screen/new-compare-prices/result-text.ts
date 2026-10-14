import { useI18n } from '@/i18n';
import { useFormat } from '@/i18n/format';
import type { Unit } from '@/models/Unit';

import type { ResultCardModel } from './new-compare-prices.result';

const NO_CENTS = { minimumFractionDigits: 0, maximumFractionDigits: 0 };

// Translated pieces of the result, shared by the full card and the sheet's one-line summary (9.5).
export function useResultText(result: ResultCardModel) {
  const { t } = useI18n();
  const { formatCents, formatNumber } = useFormat();

  const unitLabel = (unit: Unit) => t(`units.${unit}`);
  const quantityLabel = (quantity: number, unit: Unit) =>
    `${formatNumber(quantity)} ${unitLabel(unit)}`;

  const { winner, savings, cheapestRows } = result;
  return {
    // "R$ 4,98" (or "R$ 5" with Arredondar centavos).
    price: formatCents(result.priceCents, result.wholeUnits ? NO_CENTS : undefined),
    // "/kg", or "/5 kg" on the "unidade" basis.
    unitSuffix:
      result.priceQuantity === 1
        ? `/${unitLabel(result.priceUnit)}`
        : `/${quantityLabel(result.priceQuantity, result.priceUnit)}`,
    // "O preço 1 é o mais barato — 5 kg por R$ 24,90" or the tie sentence.
    headline: winner
      ? t('newComparison.resultWinner', {
          index: cheapestRows[0],
          quantity: quantityLabel(winner.quantity, winner.unit),
          price: formatCents(winner.priceCents),
        })
      : t('newComparison.resultTie', { indexes: cheapestRows.join(', ') }),
    // Short form for the collapsed sheet: "Preço 1 é o mais barato" / "Empate: preços 1, 2".
    summary: winner
      ? t('newComparison.sheet.winner', { index: cheapestRows[0] })
      : t('newComparison.sheet.tie', { indexes: cheapestRows.join(', ') }),
    savingsDetail:
      savings &&
      t('newComparison.resultBelowSecondDetail', {
        difference: formatCents(savings.differenceCents),
        quantity: quantityLabel(savings.quantity, savings.unit),
      }),
  };
}
