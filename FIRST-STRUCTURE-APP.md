---
title: Start developing ComparePrices app
description: Use AGENTS.md to learn about this project
---

#### Mobile App

- Using Expo Cli
- This application doesn't work on web
- The layout should be access in ./Designer/images/ folder

```
Samples
- [HOME](./Designer/images/HomeScreen-WithData.png)
- [New-Compare-Prices](./Designer/images/NewComparePriceScreen-empty.png)
- [New-Compare-Prices](./Designer/images/NewComparePriceScreen-fulled.png)
- [ColorsTokens](./Designer/images/ColorsTokens.png)
```

#### Simple Structure

```
./ (current folder)
└── 📊 src (sub-page)
    ├── app
    │   ├── home (using bottomBar as a component)
    │   ├── new-compare-prices
    │   ├── settings
    ├── components
    │   ├── atoms
    │   ├── molecules
    │   ├── organism
    ├── theme
    │   ├── useTheme.tsx
    │   ├── light.ts
    │   ├── dark.ts (not apply in this moment)
    ├── store
    │   ├── share states or something like that
    ├── models
    │   ├── User.ts
    │   ├── Product.ts
    ├── business (logic)
    │   ├── repository
    │   ├── service
    └── screen
    │   ├── {feature-name}.scene.tsx
    │   ├── {feature-name}.container.tsx
    │   ├── {feature-name}.layout.ts
```
