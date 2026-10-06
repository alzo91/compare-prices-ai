import type { Unit } from '@/models/Unit';

// Unit pills shown on a price row (Designer set). `label` is what the pill displays
// ("ml" in the Designer); `unit` is the Unit symbol the services use ("mL").
export const UNIT_OPTIONS: readonly { label: string; unit: Unit }[] = [
  { label: 'kg', unit: 'kg' },
  { label: 'g', unit: 'g' },
  { label: 'L', unit: 'L' },
  { label: 'ml', unit: 'mL' },
  { label: 'm', unit: 'm' },
  { label: 'cm', unit: 'cm' },
];
