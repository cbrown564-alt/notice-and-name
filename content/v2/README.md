# V2 Content Package

Native shipping contract for Notice & Name.

The SwiftUI app consumes the generated full bundle only. See docs/CONTENT.md
for the full pipeline, edit surfaces, and what not to hand-edit.

## Current files

| Path | Purpose |
| --- | --- |
| schema/content-bundle.schema.json | JSON Schema for v2 content bundles |
| bundles/v2-full.bundle.json | Generated shipping bundle (also copied into ios Resources) |
| bundles/golden-path.bundle.json | Small prototype / contract fixture |
| copy/concept-copy.json | Hand overrides (recognize / reflection / phrases) |
| editorial-review.json | Per-concept reviewStatus + citationAudit |

## Commands

Use package.json scripts:

- generate-v2-full-bundle
- validate-v2-bundle:full
- lint-v2-content
- sync-ios-media

## Source of truth

- Shipping truth: ios Resources v2-full.bundle.json (+ synced media)
- Edit truth for generation: data TS + content/v2/copy + editorial-review.json + assets/
- Do not delete data/vocabulary.ts, pathways.ts, or explainers.ts; the generator still reads them.
