import type { TextStyle } from 'react-native';

// Font files are loaded in src/app/_layout.tsx via useFonts (see fonts.ts).
// Display: Caprasimo (bold slab/serif, a single 400 weight that is already heavy), used by the
// designs for headings, product names and "R$" values. Body: Figtree.
export const fontFamily = {
  display: 'Caprasimo_400Regular',
  body: 'Figtree_400Regular',
  bodySemiBold: 'Figtree_600SemiBold',
  bodyBold: 'Figtree_700Bold',
} as const;

type Variant = Pick<TextStyle, 'fontFamily' | 'fontSize' | 'lineHeight' | 'letterSpacing'>;

// Type scale defined once. Sizes follow the _ds styles.css headings (h1 42, h2 32, h3 25, h4 20)
// and the sizes most used in the designs (15 body, 11-13 captions).
export const typography = {
  display: { fontFamily: fontFamily.display, fontSize: 42, lineHeight: 47, letterSpacing: -0.6 },
  title: { fontFamily: fontFamily.display, fontSize: 25, lineHeight: 28, letterSpacing: -0.4 },
  subtitle: { fontFamily: fontFamily.display, fontSize: 20, lineHeight: 22, letterSpacing: -0.3 },
  body: { fontFamily: fontFamily.body, fontSize: 15, lineHeight: 23 },
  bodyStrong: { fontFamily: fontFamily.bodySemiBold, fontSize: 15, lineHeight: 23 },
  caption: { fontFamily: fontFamily.body, fontSize: 12, lineHeight: 17 },
} as const satisfies Record<string, Variant>;

export type TypographyVariant = keyof typeof typography;
