# V2 Content System

**Status:** Phase 6 baseline  
**Purpose:** Separate product content from app runtime code.

## Goal

V2 should be a native app that consumes validated content bundles. The bundle is the
contract between editorial/product work and the SwiftUI client.

Editorial sources live in `data/*.ts` (vocabulary, pathways, explainers). The content
pipeline compiles those sources into validated JSON bundles under `content/v2/bundles/`.
The **bundle** is the runtime contract between editorial work and the SwiftUI client.
Sources may migrate fully into `content/v2/` over time; until then, `data/` remains the
authoritative editorial layer and bundles are generated artifacts.

Research explainers are generated from `data/explainers.ts` into the bundle `explainers`
array and rendered in the native Explore tab. The v1 **literacy report** (progress tiers
and streaks) is intentionally **not** ported to native.

## Content Source Shape

Content can remain in this repository at first, but it should move toward source files that
are easy to review:

```
content/v2/
├── concepts/
├── pathways/
├── explainers/
├── scripts/
├── media/
├── schema/
└── bundles/
```

The app should consume files under `bundles/`, not source drafts.

## Bundle Responsibilities

A v2 content bundle should include:

- bundle metadata and semantic version
- concept definitions
- concept review status (`draft`, `reviewed`, `approved`, `retired`)
- learning blocks
- citations
- reflection prompts
- phrase templates by use case
- related concept ids
- pathway ordering by user intent
- media manifest entries
- **research explainers** (long-form science articles with sections, sources, and related concept links)

It should not include:

- private user notes
- generated asset prompts
- implementation-specific SwiftUI layout details
- runtime-specific media binding paths
- research claims without source fields

## Concept Model

Concepts should be flexible learning objects rather than fixed slide decks.

Recommended block types:

| Block | Job |
| --- | --- |
| recognize | Felt experience before the term |
| definition | Name and concise definition |
| mechanism | Evidence and explanatory model |
| media | Optional illustration, motion, or diagram |
| reflection | Private field-note prompt |
| phrase | Partner-safe language template |

This preserves the best of the v1 slide arc without requiring every concept to become the
same five-screen deck.

## Golden Path Bundle

The first hand-authored bundle lives at:

`content/v2/bundles/golden-path.bundle.json`

It is not the final migration. It is a small contract test for the native client and a
place to tune the v2 content shape before building extraction tooling.

## Validation

The JSON Schema lives at:

`content/v2/schema/content-bundle.schema.json`

The first validator is:

`npm run validate-v2-bundle`

It checks:

- unique ids
- related ids exist
- pathway concept ids exist
- block types are known
- required citations are present for mechanism/research blocks
- media ids resolve to manifest entries
- share phrases do not include private-note fields by default

## Phase 6 Editorial Controls

The full v2 bundle is generated from the TypeScript content source plus:

`content/v2/editorial-review.json`

That registry records approved review status, citation-audit notes, and media policy for all
22 launch concepts. The generated bundle carries `reviewStatus` so the native app never
loads concepts with unknown editorial status.

Run the Phase 6 lint pass with:

```sh
npm run lint-v2-content
```

The lint pass checks:

- every concept has approved review metadata
- every mechanism block cites at least one source
- every concept includes all five phrase use cases:
  `self-understanding`, `partner-request`, `boundary`, `curiosity`, `reassurance`
- phrase copy does not reference private notes, journals, exports, or deletion flows
- reflection blocks are private by default
- media policy requirements are met by actual bundle media
- over-strong claims such as guarantees or cures are rejected

Media requirements are documented in:

`docs/v2/MEDIA_POLICY.md`

## Preview Workflow

Generate a local editorial preview with:

```sh
npm run preview-v2-content
```

The preview is written to:

`content/v2/preview/index.html`

It is a static, outside-the-app review surface for concept copy, blocks, citations, phrases,
pathways, review status, and media policy. It should be regenerated after bundle changes.

## Migration Approach

1. Hand-author the golden path bundle from v1 content.
2. Build a validator and run it in CI.
3. Convert the remaining 17 concepts.
4. Maintain editorial review metadata for every concept.
5. Validate, lint, and preview before shipping bundle changes.
