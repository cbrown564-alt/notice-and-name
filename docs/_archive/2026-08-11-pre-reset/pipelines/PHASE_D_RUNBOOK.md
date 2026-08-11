# Phase D Runbook — Asset Track (Visual Coherence)

**Started:** May 21, 2026  
**Source:** `docs/reports/UI_REVIEW_AND_CREATIVE_PLAN.md` § Phase D · `IMPLEMENTATION_PLAN.md` §8a

Phase D resumes batch asset production now that engineering track (§8b) and style ratification (5/5 reference renders) are complete.

---

## Scope

| Track | Work | Exit |
|-------|------|------|
| **D1** Illustrations + thumbnails | 22 concepts in category batches | All plates ≤400 KB, thumbs ≤80 KB, coherent style |
| **D2** Video loops | P0: pulsing, clitoral-structure, nerve-density; P1: spontaneous-desire, embodied-presence | Wired via `wire-concept-video.js` |
| **D3** Shell | Pathways, explainers, deck slides, empty states | Matches STYLE_BIBLE v1.0 |
| **D4** Compress + manifest | After each batch | `validate-manifest` clean |

---

## Daily workflow

```bash
# 1. See what needs work
npm run batch-asset-queue

# 2. Generate (manual — Flow / ChatGPT / Gemini per prompt file)
#    Save to path in prompt header

# 3. Post-process
npm run compress-assets
node scripts/wire-concept-video.js <concept-id>   # videos only
npm run sync-registry
npm run validate-manifest
npm test

# 4. In-app spot check (QA_CHECKLIST.md delta section)
```

---

## D1 — Illustration batch order

Use prompts in `docs/pipelines/prompts/illustrations/{id}.md`.

| Batch | Concepts | Notes |
|-------|----------|-------|
| Techniques | angling, rocking, shallowing, pairing | **Keep** angling reference unless over budget; native diagram concepts still need poster plates |
| Sensations | building, plateauing, edging, spreading, pulsing | **Keep** spreading reference; building/pulsing need regen (oversized) |
| Timing | warmup-window, responsive-desire, spontaneous-desire, golden-trio | **Keep** warmup-window reference |
| Psychological | spectatoring, embodied-presence, non-concordance, sexual-self-esteem, body-appreciation | **Keep** non-concordance reference |
| Anatomy | clitoral-structure, nerve-density, clitourethrovaginal, internal-stimulation | **Keep** clitoral-structure reference |

**Thumbnails:** Derive simplified glyph from winning plate (`{id}-thumb.md`). ChatGPT Images 2.

**Do not commit** assets that fail STYLE_BIBLE §9 (text in image, wrong palette, over budget after compress).

---

## D2 — Video priority

| Priority | Concept | Prompt | Profile |
|----------|---------|--------|---------|
| P0 | pulsing | `prompts/videos/pulsing.md` | abstract-loop |
| P0 | clitoral-structure | `prompts/videos/clitoral-structure.md` | scientific-journey |
| P0 | nerve-density | `prompts/videos/nerve-density.md` | scientific-journey |
| P1 | spontaneous-desire | `prompts/videos/spontaneous-desire.md` | embodied-presence |
| P1 | embodied-presence | `prompts/videos/embodied-presence.md` | embodied-presence |

Full catalog: `VIDEO_CONCEPT_CATALOG.md`.

**Building** MP4 exists (256 KB) — optional style regen, not blocking.

**Spreading** MP4 exists (1.6 MB) — optional re-transcode after P0 complete.

---

## D3 — Shell batch

Prompts: `docs/pipelines/prompts/shell/SHELL_BATCH.md`

Regenerate for **visual coherence** with new plates — even if files exist on disk.

---

## Automation scripts

| Script | Purpose |
|--------|---------|
| `npm run batch-asset-queue` | Work queue with sizes and actions |
| `npm run asset-dashboard` | Progress summary |
| `npm run compress-assets` | PNG optimization |
| `npm run swap-pilot-winner` | Promote staging pilots |
| `npm run wire-concept-video` | Wire MP4 in vocabulary.ts |

---

## When Phase D is done

- [ ] `npm run asset-dashboard` — 0 over-budget (or documented exceptions)
- [ ] Videos: all P0 + P1 wired; manifest updated
- [ ] `PROJECT_STATUS_REPORT.md` — Phase 3 complete
- [ ] Delta device QA on changed concepts only
