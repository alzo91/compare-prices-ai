import { router } from 'expo-router';
import { Alert } from 'react-native';

import { clearAllData } from '@/business/repository';
import { useI18n } from '@/i18n';
import { displayBasisStore, useDisplayBasis } from '@/store/useDisplayBasis';
import { languageStore } from '@/store/useLanguagePreference';
import { roundCentsStore, useRoundCents } from '@/store/useRoundCents';

import { SettingsScene } from './settings.scene';

// Container: wires the settings controls to the store / repository.
export function SettingsContainer() {
  const { t } = useI18n();
  const displayBasis = useDisplayBasis();
  const roundCents = useRoundCents();

  const confirmDeleteAllData = () => {
    Alert.alert(t('settings.deleteAllDataTitle'), t('settings.deleteAllDataMessage'), [
      { text: t('settings.deleteAllDataCancel'), style: 'cancel' },
      {
        text: t('settings.deleteAllDataConfirm'),
        style: 'destructive',
        onPress: () => {
          // Wiping resets settings in storage; bring the in-memory copy back to the defaults.
          void clearAllData().then(() =>
            Promise.all([displayBasisStore.load(), roundCentsStore.load(), languageStore.load()]),
          );
        },
      },
    ]);
  };

  return (
    <SettingsScene
      displayBasis={displayBasis}
      onChangeDisplayBasis={(basis) => void displayBasisStore.setBasis(basis)}
      roundCents={roundCents}
      onChangeRoundCents={(value) => void roundCentsStore.setEnabled(value)}
      onOpenAbout={() => router.push('/about')}
      onDeleteAllData={confirmDeleteAllData}
    />
  );
}
