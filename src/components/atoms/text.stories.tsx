import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import { typography } from '@/theme/typography';

import { Text } from './text';

const meta = {
  title: 'Atoms/Text',
  component: Text,
  args: { children: 'Quanto custa o litro?', variant: 'body', color: 'text' },
  argTypes: {
    children: { control: 'text' },
    variant: { control: 'select', options: Object.keys(typography) },
    color: {
      control: 'select',
      options: ['text', 'textMuted', 'accent', 'onAccent', 'accent2Strong'],
    },
  },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Body: Story = {};
export const Display: Story = { args: { variant: 'display', children: 'Comparar' } };
export const Title: Story = { args: { variant: 'title' } };
export const Subtitle: Story = { args: { variant: 'subtitle' } };
export const BodyStrong: Story = { args: { variant: 'bodyStrong' } };
export const Caption: Story = { args: { variant: 'caption', color: 'textMuted' } };
export const Accent: Story = { args: { color: 'accent' } };

export const TypeScale: Story = {
  render: (args) => (
    <View style={{ gap: 8 }}>
      {(Object.keys(typography) as (keyof typeof typography)[]).map((variant) => (
        <Text key={variant} {...args} variant={variant}>
          {variant}
        </Text>
      ))}
    </View>
  ),
};
