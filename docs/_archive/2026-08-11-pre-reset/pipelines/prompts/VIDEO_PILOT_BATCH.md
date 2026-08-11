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

## Overnight bounded-batch rule

Run one candidate per P0 slot before requesting additional variants. Review the
four-candidate batch using the table below. If at least one candidate advances
and no provider, safety, or shared scientific error affects the batch, retry
correctable failures once and continue. Do not promote anatomy from staging.

| Review area | Advance requirement |
|-------------|---------------------|
| Intended use | The motion teaches the concept named in the deck caption; atmosphere alone does not pass. |
| Process accuracy | Visible structures and sequences match the approved reference and prompt. No invented anatomy, false location, or unsupported cause-and-effect. |
| Safety and tone | Educational, non-explicit, calm, and free of sexual activity or voyeuristic framing. |
| Visual language | Warm cream canvas, restrained coral illumination, soft editorial texture; no cold clinical stock treatment. |
| Technical | File opens; requested duration and aspect ratio are usable; no corruption, embedded text, logo, avoidable watermark, or essential audio. |
| Accessibility | A named static fallback exists and the meaning is not available only through rapid motion or sound. |
| Phone-size read | The educational action and important structures remain legible at concept-page size. |
| Provenance | Prompt, provider/model, source reference, intended slot, timestamp, status, and fallback reason (when used) are recorded. |

Decision labels follow the shared loop: `advance`, `reserve`, `reject`, or
`retry-once`. Abstract or metaphorical output can advance only when the job
records why safe educational-process motion was unavailable; otherwise it is a
reserve candidate.

## Required batch checkpoint

Record jobs attempted, `advance/reserve/reject` counts, any systemic issue, the
next queued batch, and the single decision needing human attention in
`data/media-sprint-jobs.json` under `checkpoints`.

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
