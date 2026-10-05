import { StyleSheet, Text, View } from 'react-native';

import { fontFamily } from '@/theme/typography';
import { useTheme } from '@/theme/useTheme';

export type BadgeProps = {
  label: string;
  // "best" = "Melhor" (soft sálvia, home cards); "cheapest" = "Mais barato" (solid sálvia, price card).
  tone?: 'best' | 'cheapest';
};

export function Badge({ label, tone = 'best' }: BadgeProps) {
  const { colors } = useTheme();
  const solid = tone === 'cheapest';

  return (
    <View style={[styles.badge, { backgroundColor: solid ? colors.accent2 : colors.accent2Soft }]}>
      <Text
        style={[styles.label, { color: solid ? colors.onAccent2 : colors.accent2Strong }]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  label: { fontFamily: fontFamily.body, fontSize: 13, lineHeight: 18 },
});
