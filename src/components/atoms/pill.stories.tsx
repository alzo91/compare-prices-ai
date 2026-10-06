import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import { Pill } from './pill';

const meta = {
  title: 'Atoms/Pill',
  component: Pill,
  args: { label: 'kg', selected: false, tone: 'accent' },
  argTypes: {
    label: { control: 'text' },
    selected: { control: 'boolean' },
    tone: { control: 'select', options: ['accent', 'accent2'] },
    onPress: { action: 'pressed' },
  },
} satisfies Meta<typeof Pill>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Unselected: Story = {};
export const Selected: Story = { args: { selected: true } };
export const SelectedAccent2: Story = { args: { selected: true, tone: 'accent2' } };
export const UnselectedAccent2: Story = { args: { tone: 'accent2' } };

export const UnitChips: Story = {
  render: (args) => (
    <View style={{ flexDirection: 'row', gap: 8 }}>
      <Pill {...args} label="kg" selected />
      <Pill {...args} label="g" />
      <Pill {...args} label="L" />
      <Pill {...args} label="mL" />
    </View>
  ),
};
