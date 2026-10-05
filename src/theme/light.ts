import { base, neutral, salvia, terracota } from './palette';
import { typography } from './typography';

// Semantic tokens built from the Designer palette (see palette.ts).
export const light = {
  colors: {
    background: base.fundo,
    surface: base.superficie,
    text: base.texto,
    textMuted: neutral[700],
    divider: neutral[300],
    accent: terracota.base, // Terracota
    accentPressed: terracota[600],
    accentSoft: terracota[100],
    onAccent: '#ffffff',
    accent2: salvia.base, // Sálvia (cheapest badge)
    accent2Soft: salvia[200],
    accent2Strong: salvia[900],
    onAccent2: salvia[100],
  },
  palette: { neutral, terracota, salvia },
  typography,
};

export type Theme = typeof light;
