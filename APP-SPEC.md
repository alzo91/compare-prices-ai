# Compare Prices — App Spec & Decisions

Product rules and unit table: [AGENTS.md](./AGENTS.md). Folder structure: [README.md](./README.md).

## Decision: Platform (task 1.1) — 2026-09-30

**Mobile app for Android and iOS, built with Expo (React Native).** No web version for now.

### Options compared

| Option | Fits the phone-frame design | One codebase for iOS + Android | Store distribution | Notes |
|---|---|---|---|---|
| **Expo / React Native** | Yes — native screens, tabs, modals | Yes | Yes (EAS Build / Submit) | Chosen |
| PWA (web app) | Partly — browser chrome, weaker native feel | Yes | No (install from browser) | Offline and storage are more limited |
| Native (Swift + Kotlin) | Yes | No — two apps to build and maintain | Yes | Too costly for a small app |

### Why Expo
- The designs are phone screens (bottom bar, "+" FAB, modal form) — a native app matches them best.
- One TypeScript codebase ships to both stores; EAS handles builds, signing and submission.
- Expo SDK 57 + Expo Router give file-based navigation and the native modules we need (MMKV).

### Web
Not part of 1.0: `app.json` targets only `ios` and `android`, and there is no web script.
Web can be revisited later — Expo supports it, but it would need its own storage choice
(MMKV is native-only).

## Decision: Storage (task 1.2) — 2026-09-30

**Local-first, on the device, using MMKV** (`react-native-mmkv` v4). No accounts, no backend for 1.0.

### Why local
- No login in the designs; the app must work offline in the supermarket.
- No server to build, pay for or secure; no personal data leaves the phone.
- Trade-off: data is lost if the app is deleted or the phone changes. Cloud backup/sync is
  revisited after 1.0.

### Why MMKV
- Very fast, synchronous key-value storage; the data set is small (dozens to hundreds of comparisons).
- Consequence: MMKV is a native module that Expo Go doesn't include, so the app runs as a
  **development build** (`npx expo run:ios` / `run:android`, with `expo-dev-client`).

### Designed to be replaced
Screens and stores depend only on interfaces, so the storage engine can change in one place:

```
src/business/repository/
├── comparison.repository.ts     # ComparisonRepository interface (async)
├── settings.repository.ts       # SettingsRepository interface (async)
├── kv-comparison.repository.ts  # implementation over any KeyValueStorage
├── kv-settings.repository.ts
├── storage/
│   ├── key-value-storage.ts     # KeyValueStorage interface
│   ├── mmkv-storage.ts          # MMKV engine (used by the app)
│   └── memory-storage.ts        # in-memory engine (tests)
└── index.ts                     # composition root — the only file that picks implementations
```

- **Another key-value engine:** implement `KeyValueStorage`, swap it in `index.ts`.
- **SQLite or cloud:** implement `ComparisonRepository` / `SettingsRepository`, swap them in
  `index.ts`. The interfaces are already async for this reason.

### Data rules
- Prices are stored as integer **cents** (R$ 24,90 → `2490`), never floats.
- Entries are stored **as typed** (5 kg, 500 g). Price per unit is computed when displayed,
  so the "Mostrar preço por" setting never changes saved data.
- Storage keys carry a version (`comparisons.v1`, `settings.v1`) for future migrations.
- Settings are merged over `DEFAULT_SETTINGS` on read, so new settings get their default.
- Corrupt stored data throws instead of being treated as empty, so it's never overwritten silently.
- "Apagar todos os dados" (S.1) is `clearAllData()`: one call clears everything.
