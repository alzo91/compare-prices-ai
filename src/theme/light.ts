import { base, neutral, salvia, terracota } from './palette';
import { typography } from './typography';

// Semantic tokens built from the Designer palette (see palette.ts).
export const light = {
  colors: {
    background: base.fundo,
    surface: base.superficie,
    text: base.texto,
    textMuted: neutral[700],
    divider: neutral[300], // decorative separators only (1.2:1, not a UI boundary)
    // Boundary of inputs, unselected pills and the toggle-off track. WCAG 1.4.11 needs 3:1;
    // neutral[300]/[400] give 1.25/1.68 on background, neutral[600] gives 3.6/3.2 (background/surface).
    border: neutral[600],
    accent: terracota.base, // Terracota (fills and icons; 3.0:1 on background, too low for body text)
    accentText: terracota[700], // terracota as text/links on background or surface (5.7:1 / 5.1:1)
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
