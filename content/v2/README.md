# V2 Content Package

This folder contains the early content contract for the premium native rebuild.

The SwiftUI app should consume generated bundles from `bundles/`. Source drafts,
validation schemas, and migration tools can live next to them until the content system
outgrows this repository.

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

The current Expo app remains the source of truth until the v2 bundle is validated and
reviewed. Do not delete or rewrite `data/vocabulary.ts` as part of v2 setup.
