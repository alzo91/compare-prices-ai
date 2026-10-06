import type { Meta, StoryObj } from '@storybook/react-native';

import { Card } from './card';
import { Text } from './text';

const meta = {
  title: 'Atoms/Card',
  component: Card,
  args: { tone: 'default', muted: false },
  argTypes: {
    tone: { control: 'select', options: ['default', 'highlight'] },
    muted: { control: 'boolean' },
  },
  render: (args) => (
    <Card {...args}>
      <Text variant="subtitle">Leite Muu</Text>
      <Text variant="caption" color="textMuted">
        R$ 4,59 por litro
      </Text>
    </Card>
  ),
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Highlight: Story = { args: { tone: 'highlight' } };
export const Muted: Story = { args: { muted: true } };
