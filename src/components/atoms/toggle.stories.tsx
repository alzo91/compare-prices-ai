import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';

import { Toggle, type ToggleProps } from './toggle';

// Toggle is controlled: keep local state so the switch moves, and still emit the action.
function InteractiveToggle({ value, onValueChange, ...rest }: ToggleProps) {
  const [on, setOn] = useState(value);
  return (
    <Toggle
      {...rest}
      value={on}
      onValueChange={(next) => {
        setOn(next);
        onValueChange(next);
      }}
    />
  );
}

// Typed with Meta<typeof Toggle> (not `satisfies`) so stories do not have to repeat the required
// `onValueChange` arg; the action below provides it.
const meta: Meta<typeof Toggle> = {
  title: 'Atoms/Toggle',
  component: Toggle,
  args: { value: false, disabled: false, accessibilityLabel: 'Notificações' },
  argTypes: {
    value: { control: 'boolean' },
    disabled: { control: 'boolean' },
    accessibilityLabel: { control: 'text' },
    onValueChange: { action: 'valueChanged' },
  },
  render: (args) => <InteractiveToggle {...args} />,
};

export default meta;
type Story = StoryObj<typeof Toggle>;

export const Off: Story = {};
export const On: Story = { args: { value: true } };
export const DisabledOff: Story = { args: { disabled: true } };
export const DisabledOn: Story = { args: { disabled: true, value: true } };
