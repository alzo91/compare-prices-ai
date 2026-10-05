import type { Meta, StoryObj } from '@storybook/react-native';
import type { BottomTabBarProps } from 'expo-router/tabs';
import { View } from 'react-native';

import { BottomBar } from './bottom-bar';

// BottomBar only reads `state`, `descriptors` and `navigation`; fake just those.
function makeProps(activeIndex: number): BottomTabBarProps {
  const routes = [
    { key: 'index-key', name: 'index' },
    { key: 'settings-key', name: 'settings' },
  ];
  const titles: Record<string, string> = { index: 'Comparações', settings: 'Ajustes' };
  const descriptors = Object.fromEntries(
    routes.map((route) => [route.key, { options: { title: titles[route.name] } }]),
  );
  return {
    state: { index: activeIndex, routes },
    descriptors,
    navigation: {
      emit: () => ({ defaultPrevented: false }),
      navigate: () => {},
    },
  } as unknown as BottomTabBarProps;
}

type StoryArgs = { activeTab: 'index' | 'settings' };

// The story args drive a fake navigation state instead of the real BottomTabBarProps.
// Note: the "+" FAB calls expo-router's router.push, which has no navigator in Storybook.
function BottomBarStory({ activeTab }: StoryArgs) {
  return (
    <View style={{ flex: 1, justifyContent: 'flex-end', marginHorizontal: -16 }}>
      <BottomBar {...makeProps(activeTab === 'index' ? 0 : 1)} />
    </View>
  );
}

const meta = {
  title: 'Organisms/BottomBar',
  component: BottomBarStory,
  args: { activeTab: 'index' },
  argTypes: { activeTab: { control: 'select', options: ['index', 'settings'] } },
} satisfies Meta<typeof BottomBarStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ComparisonsActive: Story = {};
export const SettingsActive: Story = { args: { activeTab: 'settings' } };
