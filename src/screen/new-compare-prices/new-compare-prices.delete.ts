import type { AlertButton } from 'react-native';

type Translate = (key: string, options?: Record<string, unknown>) => string;
type ShowAlert = (title: string, message: string, buttons: AlertButton[]) => void;

// Delete (task 6.2): asks for confirmation first; `onConfirm` runs only on the destructive button.
export function confirmDeleteComparison(
  showAlert: ShowAlert,
  t: Translate,
  productName: string,
  onConfirm: () => void,
) {
  showAlert(
    t('newComparison.delete.title'),
    t('newComparison.delete.message', { name: productName }),
    [
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('newComparison.delete.confirm'), style: 'destructive', onPress: onConfirm },
    ],
  );
}
