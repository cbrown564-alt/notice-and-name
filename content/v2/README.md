# V2 Content Package

This folder contains the early content contract for the premium native rebuild.

The SwiftUI app should consume generated bundles from `bundles/`. Source drafts,
validation schemas, and migration tools can live next to them until the content system
outgrows this repository.

Research explainers (long-form science articles) ship in the v2 bundle under
`explainers` and appear in the native app's Explore tab.

## Current Files

| Path | Purpose |
| --- | --- |
| `schema/content-bundle.schema.json` | JSON Schema for v2 content bundles |
| `bundles/golden-path.bundle.json` | First five-concept prototype bundle |

## Validation

```bash
npm run validate-v2-bundle
```

## Migration Note

`data/explainers.ts` remains the editorial source for research explainers until content
moves fully into `content/v2/`. Regenerate the bundle with `npm run generate-v2-full-bundle`.
Do not delete or rewrite `data/vocabulary.ts` as part of v2 setup.
