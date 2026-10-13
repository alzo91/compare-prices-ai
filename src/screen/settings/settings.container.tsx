import { router } from 'expo-router';
import { Alert } from 'react-native';

import { clearAllData } from '@/business/repository';
import { useI18n } from '@/i18n';

import { SettingsScene } from './settings.scene';

// Container: settings store wiring comes with Epic 7.
export function SettingsContainer() {
  const { t } = useI18n();

  const confirmDeleteAllData = () => {
    Alert.alert(t('settings.deleteAllDataTitle'), t('settings.deleteAllDataMessage'), [
      { text: t('settings.deleteAllDataCancel'), style: 'cancel' },
      {
        text: t('settings.deleteAllDataConfirm'),
        style: 'destructive',
        onPress: () => {
          void clearAllData();
        },
      },
    ]);
  };

  return (
    <SettingsScene
      onOpenAbout={() => router.push('/about')}
      onDeleteAllData={confirmDeleteAllData}
    />
  );
}
