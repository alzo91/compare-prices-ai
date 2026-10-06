import type { StorybookConfig } from '@storybook/react-native';

const main: StorybookConfig = {
  // Stories live next to the components they document.
  stories: ['../src/components/**/*.stories.?(ts|tsx)'],
  deviceAddons: ['@storybook/addon-ondevice-controls', '@storybook/addon-ondevice-actions'],
};

export default main;
