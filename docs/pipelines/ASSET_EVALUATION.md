# Asset Evaluation Rubric

**Purpose:** Define what “good enough to ship” means before promoting pilots to production.  
**Registry:** Scores persist in `data/asset-registry.json` (`evaluation` + `pilots[]`).  
**Tools:** `npm run pilot-compare`, `npm run sync-registry`

---

## Three gates

| Gate | When | Tool |
|------|------|------|
| **1. Generation** | After pilot render, before A/B review | `pilot-compare` size + rubric scores |
| **2. Technical** | Before promotion | `validate-manifest`, `compress-assets` |
| **3. Quality** | Before merge to main | Device QA (`qa-passed.json`), in-app review |

**Promotion rule:** A pilot wins only when it passes all three gates.

---

## Scoring scale (1–5)

| Score | Meaning |
|-------|---------|
| **5** | Reference quality — would use in marketing / style bible |
| **4** | Ship-ready — minor polish optional |
| **3** | Acceptable — ship if no better alternative |
| **2** | Below bar — regen or try another generator |
| **1** | Reject — wrong style, inaccurate, or broken |

**Pass threshold:** ≥ **4** on style coherence **and** scientific accuracy, plus all pass/fail checks.

---

## Rubric by asset tier

### Illustration (ConceptDeck static / video poster)

| Criterion | Type | Pass |
|-----------|------|------|
| Style coherence | 1–5 | ≥ 4 — matches `design/STYLE_BIBLE.md` (Scientific Warmth, cream canvas, bioluminescent emphasis) |
| Scientific accuracy | 1–5 | ≥ 4 — mechanism shown correctly; no anatomical errors |
| No embedded text | pass/fail | **pass** — no titles, labels, watermarks in image |
| Size budget | pass/fail | **pass** — ≤ 400 KB after compress |
| Reduce-motion fallback | pass/fail | N/A for static; for video concepts poster must exist |

### Thumbnail (Library grid)

| Criterion | Type | Pass |
|-----------|------|------|
| Style coherence | 1–5 | ≥ 4 — reads as glyph of parent illustration |
| Legibility at 512px | pass/fail | **pass** — recognizable at card size |
| No embedded text | pass/fail | **pass** |
| Size budget | pass/fail | **pass** — ≤ 80 KB after compress |

### Video (Illustrate loop)

| Criterion | Type | Pass |
|-----------|------|------|
| Style coherence | 1–5 | ≥ 4 |
| Scientific accuracy | 1–5 | ≥ 4 |
| Motion clarity | 1–5 | ≥ 4 — loop reads in ≤10 s; mechanism obvious |
| No embedded text | pass/fail | **pass** |
| Poster fallback | pass/fail | **pass** — illustration PNG wired for reduce-motion |
| Size budget | pass/fail | **pass** — tier budget (`abstract-loop` ≤1.5 MB, `scientific-journey` ≤2.5 MB) |

### Interactive (Skia diagram)

| Criterion | Type | Pass |
|-----------|------|------|
| Scientific accuracy | 1–5 | ≥ 4 |
| Interaction clarity | 1–5 | ≥ 4 — user understands what to manipulate |
| Device QA | pass/fail | **pass** — works on iOS + Android |

---

## Promotion workflow

```
Generate → save to assets/_staging/pilot/{type}/{concept}/{generator}.png
         → npm run pilot-compare
         → score each variant (see commands below)
         → pick winner (decide approved)
         → npm run swap-pilot-winner -- {concept} {generator}
         → npm run sync-registry && npm run validate-manifest
         → device QA → mark-qa-batch
```

### Commands

```bash
# List pilots vs production with scores
npm run pilot-compare

# Score a pilot variant
npm run pilot-compare -- score spreading illustration gemini --style 4 --accuracy 5 --no-text pass

# Approve or reject
npm run pilot-compare -- decide angling illustration chatgpt-images-2 rejected --notes "in-image labels"
npm run pilot-compare -- decide non-concordance illustration chatgpt-images-2 approved

# After promotion
npm run swap-pilot-winner -- non-concordance chatgpt-images-2
npm run sync-registry
```

---

## Phase 1.3 pilot batch (current)

| Concept | Status | Notes |
|---------|--------|-------|
| angling | **rejected** | In-image titles — regen with no-text prompt |
| non-concordance | **approved** | Promoted May 19 |
| spreading | pending | Gemini pilot on disk — score in review |
| warmup-window | pending | Gemini pilot on disk |
| clitoral-structure | pending | Gemini pilot on disk — optional comparison |

See [`prompts/PILOT_BATCH.md`](./prompts/PILOT_BATCH.md) for generation procedure.

---

## Style bible reference renders (pre-batch)

Before Phase 3 full regen, ratify **5/5 family references** via [`REFERENCE_RENDERS.md`](./REFERENCE_RENDERS.md) (`npm run reference-renders`). New references require style coherence **≥ 5** (stricter than general pilot promotion).

---

*Scores live in `data/asset-registry.json`. Run `npm run sync-registry` after manual registry edits or promotion.*
