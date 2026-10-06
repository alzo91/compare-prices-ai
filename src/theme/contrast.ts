// WCAG 2.x contrast helpers (pure TS, no React Native imports).
// https://www.w3.org/TR/WCAG21/#dfn-contrast-ratio

function channel(value: number): number {
  const s = value / 255;
  return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}

// Parses '#rgb' or '#rrggbb'.
export function hexToRgb(hex: string): [number, number, number] {
  let h = hex.trim().replace(/^#/, '');
  if (h.length === 3) h = h.replace(/(.)/g, '$1$1');
  if (!/^[0-9a-fA-F]{6}$/.test(h)) throw new Error(`Invalid hex color: ${hex}`);
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

export function relativeLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex);
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

export function contrastRatio(foreground: string, background: string): number {
  const a = relativeLuminance(foreground);
  const b = relativeLuminance(background);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

// WCAG AA thresholds.
export const AA_NORMAL_TEXT = 4.5;
export const AA_LARGE_TEXT_OR_UI = 3;

// Large text = at least 24 px, or 18.66 px (14 pt) and bold.
export function isLargeText(fontSize: number, bold: boolean): boolean {
  return fontSize >= 24 || (bold && fontSize >= 18.66);
}
