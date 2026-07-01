# Expo Retirement Plan

**Status:** In progress  
**Decision:** iOS-only. The SwiftUI app in `ios-native/` is the sole product client.

The Expo / React Native prototype at the repo root is legacy. This document records what
to remove, what to keep, and the order to do it safely.

## Feature Decisions (Locked)

| v1 Expo feature | Native v2 status | Action |
| --- | --- | --- |
| 22 vocabulary concepts | ✅ In v2 bundle + SwiftUI | Keep content pipeline; remove Expo UI |
| Pathways | ✅ In v2 bundle + SwiftUI | Same |
| Field notes / Journal | ✅ GRDB + SwiftUI | Same |
| Saved phrases | ✅ GRDB + SwiftUI | Same |
| App lock, export, delete-all-data | ✅ Native | Same |
| **Research explainers** (4 articles) | ✅ Migrated to v2 bundle + Explore tab | **Keep** — editorial source: `data/explainers.ts` |
| **Literacy report** (levels, streaks, share) | ❌ Not ported | **Drop** — gamified progress does not fit v2 tone |
| **Communicate screen** | ❌ Replaced by saved phrases + bundle templates | **Drop** |
| Expert explainers library tab (Expo Router) | ✅ Replaced by native Explore → Research Explainers | Remove Expo screens only |
| Android / web / Expo Go | ❌ Out of scope | Remove all targets |

## What Stays After Expo Removal

```
ios-native/          Production iOS app (SwiftUI + GRDB)
data/                Editorial TypeScript (vocabulary, pathways, explainers)
content/v2/          Bundle schema, generated JSON, validation
assets/              Canonical media
scripts/             Bundle generation, lint, media sync, asset tooling
```

The Node toolchain becomes **content + iOS support only** — not a mobile runtime.

## What Gets Deleted

### Config (first)

- `app.json`, `eas.json`, `metro.config.js`, `jest.config.js`

### Application code

- `app/` — Expo Router (19 screens)
- `components/` — React Native UI
- `lib/` — expo-sqlite data layer (includes `literacyReport.ts`, `streaks.ts`)
- `hooks/`, `constants/theme.ts`, `__tests__/`

### Dependencies

All `expo*`, `@expo/*`, `react-native*`, and related packages. See Phase 3 in the
removal sequence below.

## Removal Sequence

### Phase 0 — Pre-flight (done for explainers)

- [x] Confirm native app covers required v1 features
- [x] Migrate research explainers into v2 bundle (`explainers` array, SwiftUI reader)
- [x] Decide literacy report: **do not port**
- [ ] Tag last Expo commit: `git tag expo-v1-final` (optional archive)

### Phase 1 — Decouple tooling

- [ ] Slim `package.json`: remove Expo entry, `expo start`, EAS scripts
- [ ] Replace `tsconfig.json` (drop `expo/tsconfig.base`; scope to `data/`, `scripts/`)
- [ ] Verify pipeline:
  ```bash
  npm run generate-v2-full-bundle
  npm run validate-v2-bundle:full
  npm run lint-v2-content
  npm run sync-ios-media
  cd ios-native && swift test
  ```

### Phase 2 — Delete Expo app layer

- [ ] Remove `app/`, `components/`, `lib/`, `hooks/`, `constants/`, `__tests__/`
- [ ] Remove Expo config files listed above
- [ ] Trim `types/index.ts` to content-only types (drop `RootStackParamList`, etc.)

### Phase 3 — Remove dependencies

- [ ] Uninstall Expo + React Native stack; regenerate `package-lock.json`
- [ ] Drop Jest / `jest-expo` unless script-level tests are added later

### Phase 4 — CI migration

Replace `.github/workflows/ci.yml` baseline:

- `validate-manifest`, `validate-v2-bundle:full`, `lint-v2-content`, `generate-v2-full-bundle`
- `cd ios-native && swift test`
- Optional macOS job: `xcodebuild` smoke build + `sync-ios-media`

Remove: `npm test` (deleted Jest suite tied to `lib/`).

### Phase 5 — Documentation

- [x] This document
- [x] Rewrite root `README.md` for Xcode + TestFlight workflow
- [x] Update `docs/v2/*` to remove “Expo is source of truth” language
- [x] Archive Expo-era docs under `docs/_archive/expo-v1/`

### Phase 6 — Repo hygiene

- [x] Clean `.gitignore` (`.expo/`, `/ios`, `/android`, Metro entries)
- [x] Remove `expo.vscode-expo-tools` from `.vscode/extensions.json`
- [ ] Optional: rename `ios-native/` → `ios/`

## Explainers Pipeline (Post-Migration)

| Step | Command / path |
| --- | --- |
| Edit copy | `data/explainers.ts` |
| Regenerate bundle | `npm run generate-v2-full-bundle` |
| Validate | `npm run validate-v2-bundle:full` |
| Sync hero images | `npm run sync-ios-media` |
| Native UI | Explore → Research Explainers (`ExplainerPages.swift`) |

Bundle field: `explainers[]` in `content/v2/schema/content-bundle.schema.json`.

## Verification Checklist

After full removal:

```bash
rg -i 'expo|react-native|@expo|eas build' --glob '!docs/_archive/**' --glob '!package-lock.json'
npm ci && npm run generate-v2-full-bundle && npm run validate-v2-bundle:full
cd ios-native && swift test
```

## Distribution

Production builds use `ios-native/TESTFLIGHT_RUNBOOK.md` and Xcode — not EAS.
