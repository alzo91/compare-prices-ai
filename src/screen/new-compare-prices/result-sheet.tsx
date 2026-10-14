import BottomSheet, {
  BottomSheetFooter,
  type BottomSheetFooterProps,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Keyboard, Platform, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/atoms/button';
import { FieldError } from '@/components/atoms/field-error';
import { Icon } from '@/components/atoms/icon';
import { Text } from '@/components/atoms/text';
import { useI18n } from '@/i18n';
import { useTheme } from '@/theme/useTheme';

import type { ResultCardModel } from './new-compare-prices.result';
import { ResultCard } from './result-card';
import { collapsedSnapPoint, styles } from './result-sheet.layout';
import { useResultText } from './result-text';

type ResultSheetProps = {
  // Null until 2 rows are valid: the sheet then shows a hint and cannot expand.
  result: ResultCardModel | null;
  isValid: boolean;
  saveError?: string;
  onSave: () => void;
  // Collapsed height, so the form can pad its bottom and scroll its last row clear of the sheet.
  onCollapsedHeight?: (height: number) => void;
};

// Result + "Salvar comparação" in a sheet pinned to the bottom of the form (9.5). Inline, not
// modal: the form behind it stays usable. Collapsed = one summary line + Save; dragging up or
// tapping the summary shows the full result card. Hidden while the keyboard is up.
export function ResultSheet({
  result,
  isValid,
  saveError,
  onSave,
  onCollapsedHeight,
}: ResultSheetProps) {
  const { colors } = useTheme();
  const { t } = useI18n();
  const insets = useSafeAreaInsets();
  const sheet = useRef<BottomSheet>(null);
  const [expanded, setExpanded] = useState(false);
  // Measured on layout; the estimates only avoid a jump on the first frame.
  const [summaryHeight, setSummaryHeight] = useState(56);
  const [footerHeight, setFooterHeight] = useState(80 + Math.max(insets.bottom, 16));
  const collapsed = collapsedSnapPoint(summaryHeight, footerHeight);
  const snapPoints = useMemo(() => [collapsed], [collapsed]);

  useEffect(() => {
    onCollapsedHeight?.(collapsed);
  }, [collapsed, onCollapsedHeight]);

  // The keyboard would push the sheet over the field being typed in, so step aside until it closes.
  useEffect(() => {
    const ios = Platform.OS === 'ios';
    const show = Keyboard.addListener(ios ? 'keyboardWillShow' : 'keyboardDidShow', () =>
      sheet.current?.close(),
    );
    const hide = Keyboard.addListener(ios ? 'keyboardWillHide' : 'keyboardDidHide', () =>
      sheet.current?.snapToIndex(0),
    );
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  // Nothing to expand without a result.
  useEffect(() => {
    if (!result) sheet.current?.collapse();
  }, [result]);

  const renderFooter = useCallback(
    (props: BottomSheetFooterProps) => (
      <BottomSheetFooter {...props}>
        <View
          onLayout={(e) => setFooterHeight(e.nativeEvent.layout.height)}
          style={[
            styles.footer,
            { backgroundColor: colors.surface, paddingBottom: Math.max(insets.bottom, 16) },
          ]}
        >
          {saveError ? <FieldError message={saveError} /> : null}
          <Button label={t('newComparison.saveComparison')} onPress={onSave} disabled={!isValid} />
        </View>
      </BottomSheetFooter>
    ),
    [colors.surface, insets.bottom, saveError, isValid, onSave, t],
  );

  return (
    <BottomSheet
      ref={sheet}
      index={0}
      snapPoints={snapPoints}
      // Adds the full content height as the expanded snap point.
      enableDynamicSizing
      enablePanDownToClose={false}
      onChange={(index) => setExpanded(index > 0)}
      footerComponent={renderFooter}
      backgroundStyle={{ backgroundColor: colors.surface }}
      handleIndicatorStyle={{ backgroundColor: colors.border }}
      style={styles.sheet}
    >
      <BottomSheetView style={{ paddingBottom: footerHeight }}>
        <View onLayout={(e) => setSummaryHeight(e.nativeEvent.layout.height)}>
          {result ? (
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ expanded }}
              accessibilityHint={
                expanded
                  ? t('newComparison.sheet.hideDetails')
                  : t('newComparison.sheet.showDetails')
              }
              onPress={() => (expanded ? sheet.current?.collapse() : sheet.current?.expand())}
              style={styles.summary}
            >
              <ResultSummary result={result} />
              <Icon
                name={
                  expanded
                    ? { ios: 'chevron.down', android: 'expand_more' }
                    : { ios: 'chevron.up', android: 'expand_less' }
                }
                color={colors.textMuted}
                size={18}
              />
            </Pressable>
          ) : (
            <View style={styles.summary}>
              <Text color="textMuted">{t('newComparison.sheet.empty')}</Text>
            </View>
          )}
        </View>
        {result ? (
          <View style={styles.details}>
            <ResultCard result={result} />
          </View>
        ) : null}
      </BottomSheetView>
    </BottomSheet>
  );
}

// "R$ 4,98/kg · Preço 1 é o mais barato" on one line.
function ResultSummary({ result }: { result: ResultCardModel }) {
  const { price, unitSuffix, summary } = useResultText(result);
  return (
    <View style={styles.summaryText}>
      <Text variant="subtitle" color="accent2Strong" numberOfLines={1}>
        {price}
        {unitSuffix}
      </Text>
      <Text color="textMuted" numberOfLines={1} style={styles.summaryLine}>
        {summary}
      </Text>
    </View>
  );
}
