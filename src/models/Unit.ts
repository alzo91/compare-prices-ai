// Units from the AGENTS.md table. Conversion factors live in the engine (Epic 3).
export type MeasurementType = 'length' | 'mass' | 'volume';

export type LengthUnit = 'm' | 'km' | 'cm' | 'mm';
export type MassUnit = 'kg' | 'g' | 'mg';
export type VolumeUnit = 'L' | 'mL' | 'm3';

export type Unit = LengthUnit | MassUnit | VolumeUnit;
