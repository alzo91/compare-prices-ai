import { router } from 'expo-router';

import { SettingsScene } from './settings.scene';

// Container: settings store wiring comes with Epic 7.
export function SettingsContainer() {
  return <SettingsScene onOpenAbout={() => router.push('/about')} />;
}
