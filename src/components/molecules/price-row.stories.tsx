import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';

import type { Unit } from '@/models/Unit';

import { PriceRow, type PriceRowProps } from './price-row';

const meta = {
  title: 'Molecules/PriceRow',
  component: PriceRow,
  args: {
    index: 1,
    price: '',
    quantity: '',
    unit: null,
    currencySymbol: 'R$',
    highlight: false,
    // Replaced by the Actions panel (argTypes below); the noop satisfies the required props.
    onChangePrice: () => {},
    onChangeQuantity: () => {},
    onChangeUnit: () => {},
  },
  argTypes: {
    index: { control: 'number' },
    price: { control: 'text' },
    quantity: { control: 'text' },
    currencySymbol: { control: 'text' },
    highlight: { control: 'boolean' },
    onChangePrice: { action: 'price changed' },
    onChangeQuantity: { action: 'quantity changed' },
    onChangeUnit: { action: 'unit changed' },
  },
} satisfies Meta<typeof PriceRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};
export const Filled: Story = { args: { price: '24,90', quantity: '5', unit: 'kg' } };
export const Highlighted: Story = {
  args: { price: '24,90', quantity: '5', unit: 'kg', highlight: true },
};

// Interactive: typing and picking a unit update the row.
function InteractiveRow(args: PriceRowProps) {
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState<Unit | null>('kg');
  return (
    <PriceRow
      {...args}
      price={price}
      quantity={quantity}
      unit={unit}
      onChangePrice={setPrice}
      onChangeQuantity={setQuantity}
      onChangeUnit={setUnit}
    />
  );
}

export const Interactive: Story = { render: (args) => <InteractiveRow {...args} /> };
