import type { Meta, StoryObj } from '@storybook/react-native';

import { ComparisonCard } from './comparison-card';

const meta = {
  title: 'Organisms/ComparisonCard',
  component: ComparisonCard,
  args: {
    onPress: () => {},
    comparison: {
      id: '1',
      name: 'Arroz branco tipo 1',
      unitPriceCents: 498,
      priceQuantity: 1,
      priceUnit: 'kg',
      best: { quantity: 5, unit: 'kg', priceCents: 2490 },
      pricesCount: 5,
      summary: { kind: 'savings', winnerRow: 1, savingsCents: 640 },
    },
  },
} satisfies Meta<typeof ComparisonCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithSavings: Story = {};
export const Packages: Story = {
  args: {
    comparison: {
      id: '3',
      name: 'Café torrado e moído',
      unitPriceCents: 3190,
      priceQuantity: 1,
      priceUnit: 'kg',
      best: { quantity: 500, unit: 'g', priceCents: 1595 },
      pricesCount: 6,
      summary: {
        kind: 'packages',
        sizes: [
          { quantity: 250, unit: 'g' },
          { quantity: 500, unit: 'g' },
        ],
      },
    },
  },
};

export const Per100g: Story = {
  args: {
    comparison: {
      id: '4',
      name: 'Arroz branco tipo 1',
      unitPriceCents: 50,
      priceQuantity: 100,
      priceUnit: 'g',
      best: { quantity: 5, unit: 'kg', priceCents: 2490 },
      pricesCount: 5,
      summary: { kind: 'savings', winnerRow: 1, savingsCents: 640 },
    },
  },
};
