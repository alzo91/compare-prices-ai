import Constants from 'expo-constants';
import { router } from 'expo-router';

import { AboutScene } from './about.scene';

// Container: full "Sobre o app" content comes with task 7.4.
export function AboutContainer() {
  return <AboutScene version={Constants.expoConfig?.version ?? ''} onBack={() => router.back()} />;
}
