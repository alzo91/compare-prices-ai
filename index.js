// App entry. Storybook mode is chosen at bundle time: EXPO_PUBLIC_STORYBOOK_ENABLED is inlined by
// Metro, so the unused branch is removed and Storybook never reaches the normal bundle.
if (process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === 'true') {
  require('./.rnstorybook');
} else {
  require('expo-router/entry');
}
