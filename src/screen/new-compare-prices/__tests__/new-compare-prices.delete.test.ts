import type { AlertButton } from 'react-native';

import enUS from '@/i18n/locales/en-US.json';
import ptBR from '@/i18n/locales/pt-BR.json';

import { confirmDeleteComparison } from '../new-compare-prices.delete';

const t = (key: string, options?: Record<string, unknown>) =>
  options ? `${key}:${JSON.stringify(options)}` : key;

function open() {
  const showAlert = jest.fn<void, [string, string, AlertButton[]]>();
  const onConfirm = jest.fn();
  confirmDeleteComparison(showAlert, t, 'Leite', onConfirm);
  const [title, message, buttons] = showAlert.mock.calls[0];
  return { showAlert, onConfirm, title, message, buttons };
}

describe('confirmDeleteComparison (task 6.2)', () => {
  it('asks for confirmation instead of deleting right away', () => {
    const { showAlert, onConfirm, title, message } = open();
    expect(showAlert).toHaveBeenCalledTimes(1);
    expect(onConfirm).not.toHaveBeenCalled();
    expect(title).toBe('newComparison.delete.title');
    expect(message).toBe('newComparison.delete.message:{"name":"Leite"}');
  });

  it('deletes only from the destructive button; cancel does nothing', () => {
    const { onConfirm, buttons } = open();
    const cancel = buttons.find((b) => b.style === 'cancel');
    const confirm = buttons.find((b) => b.style === 'destructive');
    cancel?.onPress?.();
    expect(onConfirm).not.toHaveBeenCalled();
    confirm?.onPress?.();
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('has the delete strings in both languages', () => {
    for (const locale of [enUS, ptBR]) {
      const d = locale.newComparison.delete;
      expect([d.action, d.title, d.confirm, d.error, locale.common.cancel]).not.toContain('');
      expect(d.message).toContain('{{name}}');
    }
  });
});
