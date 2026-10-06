import type { Meta, StoryObj } from '@storybook/react-native';

import { PillInput } from './pill-input';

const meta = {
  title: 'Atoms/PillInput',
  component: PillInput,
  args: { placeholder: 'Nome do produto', on: 'surface', editable: true },
  argTypes: {
    placeholder: { control: 'text' },
    prefix: { control: 'text' },
    on: { control: 'select', options: ['surface', 'background'] },
    editable: { control: 'boolean' },
    value: { control: 'text' },
  },
} satisfies Meta<typeof PillInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};
export const Filled: Story = { args: { value: 'Leite Muu' } };
export const Price: Story = {
  args: { prefix: 'R$', placeholder: '0,00', keyboardType: 'decimal-pad' },
};
export const OnBackground: Story = { args: { on: 'background' } };
export const Disabled: Story = { args: { editable: false, value: 'Somente leitura' } };
