// Raw color ramps. Source of truth: Designer/images/ColorsTokens.png and
// Designer/html/_ds/*/styles.css (--color-neutral-*, --color-accent-*, --color-accent-2-*).
// Screens should use semantic names from light.ts; reach for ramps only when no semantic token fits.

export const base = {
  fundo: '#f5ead8', // Fundo: screens
  superficie: '#ebddc5', // Superfície: cards, fields
  texto: '#201e1d', // Texto: titles, values
} as const;

// Warm neutrals: structure.
export const neutral = {
  100: '#f9f4ed',
  200: '#eee7db',
  300: '#dcd3c4', // inactive button
  400: '#c0b6a5', // outlines, toggle off
  500: '#a19786', // placeholder
  600: '#82796a', // arrow icons
  700: '#645c50', // secondary text
  800: '#474238',
  900: '#2e2b25',
} as const;

// Terracota: action. Brand color #C67139 (the base swatch) is not one of the ramp steps.
export const terracota = {
  base: '#c67139',
  100: '#fff2eb', // active nav
  200: '#ffe1d0',
  300: '#ffc6a5',
  400: '#f6a06b',
  500: '#d67f48',
  600: '#b2622d', // pressed
  700: '#8c491a', // warnings, links
  800: '#643312', // nav label
  900: '#402310',
} as const;

// Sálvia: "Mais barato". Brand color #56633F is ramp step 700.
export const salvia = {
  base: '#56633f',
  100: '#f0fae1', // text on badge
  200: '#e1eecc', // winner card
  300: '#ccdbb2',
  400: '#aebf92',
  500: '#8fa073',
  600: '#728157',
  700: '#56633f', // badge
  800: '#3d472b', // secondary text
  900: '#272e1b', // winner price
} as const;
