// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const { withStorybook } = require('@storybook/react-native/metro/withStorybook');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

module.exports = withStorybook(config, {
  // When false, Storybook is stripped from the bundle (normal app and production builds).
  enabled: process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === 'true',
});
