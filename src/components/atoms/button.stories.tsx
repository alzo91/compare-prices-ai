import type { Meta, StoryObj } from '@storybook/react-native';

import { Button } from './button';

const meta = {
  title: 'Atoms/Button',
  component: Button,
  args: { label: 'Comparar', disabled: false },
  argTypes: {
    label: { control: 'text' },
    disabled: { control: 'boolean' },
    onPress: { action: 'pressed' },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// Press and hold it on the device to see the pressed color.
export const Default: Story = {};
export const Disabled: Story = { args: { disabled: true } };
