// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');

module.exports = defineConfig([
  expoConfig,
  eslintPluginPrettierRecommended,
  {
    files: ['src/i18n/**'],
    // The i18next default export is the configured instance; its methods are what we want.
    rules: { 'import/no-named-as-default-member': 'off' },
  },
  {
    ignores: [
      'ios/*',
      'android/*',
      'node_modules/*',
      '.expo/*',
      'dist/*',
      'notion-board/*',
      'Designer/*',
      '.claude/*',
      '.agents/*',
    ],
  },
]);
