import type { Meta, StoryObj } from '@storybook/react-native';

import { Badge } from './badge';

const meta = {
  title: 'Atoms/Badge',
  component: Badge,
  args: { label: 'Melhor', tone: 'best' },
  argTypes: {
    label: { control: 'text' },
    tone: { control: 'select', options: ['best', 'cheapest'] },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Best: Story = {};
export const Cheapest: Story = { args: { label: 'Mais barato', tone: 'cheapest' } };
