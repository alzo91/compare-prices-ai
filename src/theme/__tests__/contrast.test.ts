import { AA_LARGE_TEXT_OR_UI, AA_NORMAL_TEXT, contrastRatio, isLargeText } from '../contrast';
import { light } from '../light';

const { colors, palette } = light;

type Pair = { name: string; fg: string; bg: string; min: number };

const NORMAL = AA_NORMAL_TEXT;
const UI = AA_LARGE_TEXT_OR_UI;

// Display labels (Caprasimo is a single, heavy weight) at >= 18.66 px count as large bold text.
// Keep these in sync with Button (20) and Pill (19).
const BUTTON_LABEL = isLargeText(20, true) ? UI : NORMAL;
const PILL_LABEL = isLargeText(19, true) ? UI : NORMAL;

// Every foreground/background pair actually rendered by src/components/**.
const pairs: Pair[] = [
  // Text atom colours on every surface they can sit on
  { name: 'Text text on background', fg: colors.text, bg: colors.background, min: NORMAL },
  { name: 'Text text on surface', fg: colors.text, bg: colors.surface, min: NORMAL },
  { name: 'Text text on accent2Soft', fg: colors.text, bg: colors.accent2Soft, min: NORMAL },
  {
    name: 'Text textMuted on background',
    fg: colors.textMuted,
    bg: colors.background,
    min: NORMAL,
  },
  { name: 'Text textMuted on surface', fg: colors.textMuted, bg: colors.surface, min: NORMAL },
  {
    name: 'Text textMuted on accent2Soft',
    fg: colors.textMuted,
    bg: colors.accent2Soft,
    min: NORMAL,
  },
  {
    name: 'Text accentText on background',
    fg: colors.accentText,
    bg: colors.background,
    min: NORMAL,
  },
  { name: 'Text accentText on surface', fg: colors.accentText, bg: colors.surface, min: NORMAL },
  {
    name: 'Text accent2Strong on accent2Soft',
    fg: colors.accent2Strong,
    bg: colors.accent2Soft,
    min: NORMAL,
  },
  // Button
  {
    name: 'Button label onAccent on accent',
    fg: colors.onAccent,
    bg: colors.accent,
    min: BUTTON_LABEL,
  },
  {
    name: 'Button label onAccent on accentPressed',
    fg: colors.onAccent,
    bg: colors.accentPressed,
    min: BUTTON_LABEL,
  },
  {
    name: 'Button disabled label neutral800 on divider',
    fg: palette.neutral[800],
    bg: colors.divider,
    min: NORMAL,
  },
  // Pill
  {
    name: 'Pill selected onAccent on accent',
    fg: colors.onAccent,
    bg: colors.accent,
    min: PILL_LABEL,
  },
  {
    name: 'Pill selected onAccent2 on accent2',
    fg: colors.onAccent2,
    bg: colors.accent2,
    min: NORMAL,
  },
  {
    name: 'Pill unselected text on background',
    fg: colors.text,
    bg: colors.background,
    min: NORMAL,
  },
  {
    name: 'Pill unselected border on background',
    fg: colors.border,
    bg: colors.background,
    min: UI,
  },
  { name: 'Pill unselected border on surface', fg: colors.border, bg: colors.surface, min: UI },
  {
    name: 'Pill unselected border on accent2Soft',
    fg: colors.border,
    bg: colors.accent2Soft,
    min: UI,
  },
  // Badge
  {
    name: 'Badge best accent2Strong on accent2Soft',
    fg: colors.accent2Strong,
    bg: colors.accent2Soft,
    min: NORMAL,
  },
  {
    name: 'Badge cheapest onAccent2 on accent2',
    fg: colors.onAccent2,
    bg: colors.accent2,
    min: NORMAL,
  },
  // PillInput
  { name: 'PillInput text on surface', fg: colors.text, bg: colors.surface, min: NORMAL },
  { name: 'PillInput text on background', fg: colors.text, bg: colors.background, min: NORMAL },
  {
    name: 'PillInput prefix textMuted on surface',
    fg: colors.textMuted,
    bg: colors.surface,
    min: NORMAL,
  },
  {
    name: 'PillInput placeholder neutral700 on surface',
    fg: palette.neutral[700],
    bg: colors.surface,
    min: NORMAL,
  },
  {
    name: 'PillInput placeholder neutral700 on background',
    fg: palette.neutral[700],
    bg: colors.background,
    min: NORMAL,
  },
  { name: 'PillInput border on surface', fg: colors.border, bg: colors.surface, min: UI },
  { name: 'PillInput border on background', fg: colors.border, bg: colors.background, min: UI },
  // Toggle (track vs. page, thumb vs. track)
  { name: 'Toggle off track on background', fg: colors.border, bg: colors.background, min: UI },
  { name: 'Toggle off thumb on track', fg: colors.background, bg: colors.border, min: UI },
  { name: 'Toggle on track on background', fg: colors.accent, bg: colors.background, min: UI },
  { name: 'Toggle on thumb on track', fg: colors.background, bg: colors.accent, min: UI },
  // BottomBar
  {
    name: 'BottomBar inactive label textMuted on background',
    fg: colors.textMuted,
    bg: colors.background,
    min: NORMAL,
  },
  {
    name: 'BottomBar active label terracota800 on accentSoft',
    fg: palette.terracota[800],
    bg: colors.accentSoft,
    min: NORMAL,
  },
  {
    name: 'BottomBar FAB icon onAccent on accent',
    fg: colors.onAccent,
    bg: colors.accent,
    min: UI,
  },
];

describe('WCAG AA contrast of theme token pairs used by components', () => {
  it.each(pairs)('$name', ({ fg, bg, min }) => {
    expect(contrastRatio(fg, bg)).toBeGreaterThanOrEqual(min);
  });
});

describe('contrastRatio', () => {
  it('matches the WCAG reference values', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 5);
    expect(contrastRatio('#ffffff', '#ffffff')).toBeCloseTo(1, 5);
    expect(contrastRatio('#777', '#fff')).toBeCloseTo(4.48, 2);
  });
});
