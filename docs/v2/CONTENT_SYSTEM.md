# V2 Content System

**Status:** Draft 0.1  
**Purpose:** Separate product content from app runtime code.

## Goal

V2 should be a native app that consumes validated content bundles. The bundle is the
contract between editorial/product work and the SwiftUI client.

The current Expo app stores content in TypeScript objects with `require()` media bindings.
That was appropriate for the MVP, but it makes content, asset wiring, and UI assumptions
too tightly coupled for a premium rebuild.

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
- learning blocks
- citations
- reflection prompts
- phrase templates
- related concept ids
- pathway ordering
- media manifest entries

It should not include:

- private user notes
- generated asset prompts
- implementation-specific SwiftUI layout details
- Expo `require()` paths
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

## Migration Approach

1. Hand-author the golden path bundle from v1 content.
2. Build a validator and run it in CI.
3. Convert the remaining 17 concepts.
4. Build a content preview tool.
5. Only then let the SwiftUI app depend on the full content set.
