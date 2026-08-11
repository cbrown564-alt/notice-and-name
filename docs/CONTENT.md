# Notice & Name — content pipeline

**Status:** Phase A — v2 bundle is the sole **shipping** truth.  
**Date:** 2026-08-11

This doc freezes how content moves from editorial sources into the native app.
Do not treat archived Expo docs as current.

## Sole shipping truth

The SwiftUI app loads **only**:

`ios/Sources/PleasureVocabularyApp/Resources/v2-full.bundle.json`

via `Bundle.module` (`PleasureVocabularyViewModel`). It does **not** import
`data/*.ts`, Expo modules, or any TypeScript path.

A byte-identical copy lives at:

`content/v2/bundles/v2-full.bundle.json`

CI validates and lints that copy. Both files are **generated** — do not hand-edit.

Media files the app displays are copied from `assets/` into
`ios/Sources/PleasureVocabularyApp/Resources/media/` by the sync-ios-media script
(those media copies are gitignored; regenerate locally / in CI).

## Pipeline (prose)

1. Edit concept/pathway/explainer source in data TS files, plus v2 overrides in
   content/v2/copy/concept-copy.json and review metadata in
   content/v2/editorial-review.json. Place or replace binary media under assets/.
2. Generate with the generate-v2-full-bundle script. It transpiles
   data/vocabulary.ts, data/pathways.ts, and data/explainers.ts, merges
   concept-copy + editorial-review, and writes both bundle JSON paths above.
3. Validate with validate-v2-bundle:full (schema/shape/refs) and
   lint-v2-content (approved review status, citations, phrase coverage).
4. Sync media with sync-ios-media (canonical assets/ to iOS resource bundle).
   CI runs this before swift test.
5. Ship the native app, which reads the SPM-bundled JSON + media only.

ASCII flow:

```
data/vocabulary.ts + data/pathways.ts + data/explainers.ts
content/v2/copy + content/v2/editorial-review.json
        |
        v
generate-v2-full-bundle
        |
        +--> content/v2/bundles/v2-full.bundle.json
        +--> ios/.../Resources/v2-full.bundle.json
                    |
                    v
            SwiftUI ContentBundleLoader

assets/**  -->  sync-ios-media  -->  ios/.../Resources/media/**
```

## What each layer is for

| Path | Role | Edit by hand? |
| --- | --- | --- |
| data/vocabulary.ts | Editorial source: 22 concepts, slides, media wiring | Yes (current edit surface) |
| data/pathways.ts | Editorial source: 5 pathways | Yes |
| data/explainers.ts | Editorial source: 4 research explainers | Yes |
| types/index.ts | TS types for the data TS sources | Yes, when source shape changes |
| content/v2/copy/concept-copy.json | Hand overrides for recognize / reflection / phrases | Yes |
| content/v2/editorial-review.json | Per-concept reviewStatus + citationAudit | Yes |
| content/v2/schema/content-bundle.schema.json | Bundle contract | Rarely |
| content/v2/bundles/v2-full.bundle.json | Generated full shipping bundle (repo canonical) | No -- regenerate |
| content/v2/bundles/golden-path.bundle.json | Small prototype / contract fixture (not app default) | Only if updating the fixture |
| ios/.../Resources/v2-full.bundle.json | Generated copy embedded in the app | No -- regenerate |
| assets/** | Canonical binary media | Yes |
| ios/.../Resources/media/** | Generated media copies | No -- sync-ios-media |

## Scripts CI cares about

| Script | Reads | Writes |
| --- | --- | --- |
| generate-v2-full-bundle | data TS + concept-copy + editorial-review | both v2-full.bundle.json locations |
| validate-v2-bundle:full | content/v2/bundles/v2-full.bundle.json (+ asset path checks) | nothing |
| lint-v2-content | full bundle + editorial-review.json | nothing |
| sync-ios-media | assets concept images/videos + explainers | ios Resources/media |

See .github/workflows/ci.yml: ubuntu job runs generate, validate, lint; macOS job runs generate, sync-ios-media, then swift test.

## Dual-era note (why data TS still exists)

The Expo client is gone. What remains is an Expo-shaped editorial format:
TypeScript modules with require() asset paths. That is intentional until someone
migrates the edit surface into pure JSON under content/v2/ (a larger refactor).

Until then:

- Shipping truth = v2 full bundle (+ synced media) in the iOS app.
- Edit truth for generation = data TS + content/v2/copy + editorial-review.json + assets/.
- Do not delete data/vocabulary.ts, pathways.ts, explainers.ts, or types/; the generator and asset tooling still read them.
- Do not teach iOS to read data/ again.

## How to change shipping copy

1. Edit the relevant source (data TS and/or content/v2/copy/concept-copy.json).
2. Update content/v2/editorial-review.json if review status changes.
3. Run generate-v2-full-bundle.
4. Run validate-v2-bundle:full and lint-v2-content.
5. If media changed: run sync-ios-media.
6. Commit the regenerated bundle JSON(s) with the source edits.
