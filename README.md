# Compare Prices

Mobile app (iOS / Android) that shows which product is the cheapest per unit of measure.
Product rules and unit-conversion table: [AGENTS.md](./AGENTS.md). Screens: [Designer/images](./Designer/images).

- **Framework**: Expo SDK 57 + Expo Router (file-based routes), TypeScript (strict)
- **Platforms**: iOS and Android only — no web build

## Getting started

```bash
npm install
npx expo run:ios       # first run / after adding native code: builds the dev build (or run:android)
npm start              # later runs: start the bundler for the installed dev build
npm run typecheck      # tsc --noEmit
```

The app uses MMKV (native code), so it runs as a **development build**, not in Expo Go.
Storage decision and data rules: [APP-SPEC.md](./APP-SPEC.md).

Add packages with `npx expo install <pkg>` (not `npm install <pkg>`) so versions match the SDK.

## Project structure

```
compare-prices/
├── app.json · package.json · tsconfig.json   # @/* → src/*
├── assets/                    # app icon, splash, fonts
├── Designer/                  # design export (html + screenshots) — reference only
└── src/
    ├── app/                   # Expo Router — ROUTE FILES ONLY
    │   ├── _layout.tsx        # root Stack + ThemeProvider
    │   ├── (tabs)/            # Tabs with the custom BottomBar (Comparações · + · Ajustes)
    │   │   ├── index.tsx      # Home → screen/home
    │   │   └── settings.tsx   # Ajustes → screen/settings
    │   ├── new-compare-prices.tsx   # modal, opened by the "+" FAB
    │   ├── compare/[id].tsx   # detail / edit, reuses screen/new-compare-prices
    │   └── about.tsx          # Sobre o app
    ├── screen/                # one folder per feature
    │   └── home/
    │       ├── home.container.tsx   # state, store/service calls, handlers
    │       ├── home.scene.tsx       # pure UI, props only
    │       └── home.layout.ts       # StyleSheet for the scene
    ├── components/
    │   ├── atoms/             # Text, Button, Input, Pill, Badge, Toggle, Card…
    │   ├── molecules/         # SearchBar, PriceInput, UnitSelector, SettingRow…
    │   └── organism/          # BottomBar (+FAB), ComparisonCard, PriceRowCard, ResultCard…
    ├── theme/
    │   ├── light.ts           # design tokens (from Designer/html/_ds)
    │   ├── dark.ts            # placeholder, not applied yet
    │   └── useTheme.tsx       # ThemeProvider + useTheme()
    ├── store/                 # shared state (comparisons, settings)
    ├── models/                # TypeScript types: Product, Unit, PriceEntry, Comparison, Settings
    ├── business/
    │   ├── service/           # pure logic: unit conversion, comparison (+ colocated *.test.ts)
    │   └── repository/        # persistence — interfaces + implementations (see APP-SPEC.md)
    │       ├── *.repository.ts      # ComparisonRepository, SettingsRepository interfaces
    │       ├── kv-*.repository.ts   # implementations over KeyValueStorage
    │       ├── storage/             # KeyValueStorage interface, MMKV + memory engines
    │       └── index.ts             # composition root: import repositories from here
    ├── i18n/                  # pt-BR (default), en-US
    └── utils/                 # helpers: format currency, parse "4,59" → 4.59
```

### Conventions

- **`src/app/` holds routes only.** Every file there becomes a route, so a route file only reads
  params and renders `screen/<feature>/<feature>.container`.
- **Screens use three files:** the *container* holds logic, the *scene* is presentational and
  never imports `store/` or `business/`, and the *layout* holds the `StyleSheet`.
- **Data flows one way:** `app` → `screen container` → `store` ↔ `business/repository`
  (+ `business/service`) → `scene` → `components` → `theme`.
- **Components** use colors and sizes from `useTheme()` only — no hardcoded colors.
- **Files**: components and screens in PascalCase exports; feature files named `{feature}.{role}.ts(x)`.

### Routes

| URL | File | Screen |
|---|---|---|
| `/` | `(tabs)/index.tsx` | Home — Minhas comparações |
| `/settings` | `(tabs)/settings.tsx` | Ajustes |
| `/new-compare-prices` | `new-compare-prices.tsx` (modal) | Nova comparação |
| `/compare/:id` | `compare/[id].tsx` | Detail / edit (reuses Nova comparação) |
| `/about` | `about.tsx` | Sobre o app |

The bottom bar is `components/organism/bottom-bar.tsx`, passed to `Tabs` via `tabBar` — native tabs
can't render the center "+" FAB from the design. Tabs stay mounted, so switching keeps their state.
Deep link for testing: `xcrun simctl openurl booted "exp://127.0.0.1:8081/--/about"`.
