# V2 Media Policy

**Status:** Phase 6 baseline  
**Registry:** `content/v2/editorial-review.json`

V2 media should clarify vocabulary without making the app feel clinical, performative, or
overexposed. A shipped concept must have a known media decision, even when the decision is
"static image only for launch."

## Requirements

- Every shipped concept needs at least one launch-ready visual reference unless explicitly
  marked as no-media in the editorial registry.
- Technique concepts that describe body positioning or stimulation patterns need a diagram
  plus a softer illustration.
- Motion is required only where the current bundle already has reviewed video and the
  concept meaning benefits from temporal change.
- Optional future video must not block launch if the concept already has a reviewed static
  fallback.
- Video media must include a reduced-motion fallback.
- Media entries must include useful alt text and must not be placeholders.

## Launch Policy By Concept

The authoritative per-concept policy lives in `content/v2/editorial-review.json` under
`mediaPolicy.requiredKinds` and `mediaPolicy.optionalKinds`.

Current Phase 6 launch requirements:

- `angling`, `rocking`, `shallowing`, `pairing`: diagram and image.
- `building`, `spreading`, `responsive-desire`: image and video.
- All other approved concepts: image required; video or diagram optional where noted in the
  registry.

## Enforcement

Run:

```sh
npm run lint-v2-content
```

The linter fails if required media kinds are missing, if a concept lacks editorial media
policy, or if the bundle references missing media assets.
