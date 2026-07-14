# Video Pilot Batch (Phase 2.5 — dual track)

**Goal:** Validate **both** Omni profiles before full video batch: abstract sensation loops **and** scientific scale-traversal.

| Track | Concept | Prompt | Profile | Action |
|-------|---------|--------|---------|--------|
| Sensation | `building` | [videos/building.md](./videos/building.md) | abstract-loop | Regen in Flow → transcode |
| Sensation | `pulsing` | [videos/pulsing.md](./videos/pulsing.md) | abstract-loop | Generate → wire |
| **Anatomy** | `clitoral-structure` | [videos/clitoral-structure.md](./videos/clitoral-structure.md) | **scientific-journey** | **Flagship zoom pilot** |
| **Anatomy** | `nerve-density` | [videos/nerve-density.md](./videos/nerve-density.md) | **scientific-journey** | Micro-zoom nerve lattice |

**Reference:** [`VIDEO_CONCEPT_CATALOG.md`](../VIDEO_CONCEPT_CATALOG.md) · [`gemini_omni_best_practices.md`](../../gemini_omni_best_practices.md)

## Procedure

1. Open [Google Flow](https://flow.google/). Attach `assets/images/concepts/illustrations/{id}.png` as **image-0** for all four.
2. Run starter variant A for each concept; iterate 3–6 turns (pace, loop seam, anatomy legibility, remove text).
3. `./scripts/transcode-video.sh` → `assets/videos/{id}.mp4`
4. `npm run wire-concept-video -- <id>` where not wired
5. Device QA on the native concept See page + Reduce Motion poster check
6. `npm run validate-manifest` (journey tier may warn until budget script updated)

## Results (fill after review)

| Concept | Profile | Approved | Bytes | Notes |
|---------|---------|----------|-------|-------|
| building | abstract-loop | ☐ | 256 KB placeholder | Regen |
| pulsing | abstract-loop | ☐ | — | — |
| clitoral-structure | scientific-journey | ☐ | — | Scale traversal QA |
| nerve-density | scientific-journey | ☐ | — | Density readable on phone? |

## P1 presence track (after P0)

| Concept | Prompt | Profile |
|---------|--------|---------|
| spontaneous-desire | [videos/spontaneous-desire.md](./videos/spontaneous-desire.md) | embodied-presence |
| embodied-presence | [videos/embodied-presence.md](./videos/embodied-presence.md) | embodied-presence |
