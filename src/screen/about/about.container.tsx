import Constants from 'expo-constants';
import { router } from 'expo-router';

import { AboutScene } from './about.scene';
import { resolveAppVersion } from './about.version';

export function AboutContainer() {
  return (
    <AboutScene
      version={resolveAppVersion(Constants.expoConfig?.version)}
      onBack={() => router.back()}
    />
  );
}
