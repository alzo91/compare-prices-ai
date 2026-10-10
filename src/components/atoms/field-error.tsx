import { StyleSheet } from 'react-native';

import { Text } from '@/components/atoms/text';

export type FieldErrorProps = {
  // Already translated message.
  message: string;
};

// Inline error text under a field. Uses the accentText color (terracota 700, AA on the
// background and card colors); the message itself carries the meaning, not only the color.
// role="alert" + polite live region make screen readers announce it when it appears.
export function FieldError({ message }: FieldErrorProps) {
  return (
    <Text
      variant="caption"
      color="accent"
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
      style={styles.text}
    >
      {message}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: { paddingHorizontal: 8 },
});
