# Image Pilot Batch (Phase 1.3)

**Goal:** Run one concept per category family through both generators; pick primary tool per asset type before full batch.

**Status:** In progress (May 19, 2026) — **2/5** ChatGPT pilots on disk; **3/5** use Gemini clinical path (ChatGPT guardrails).

| Category | Concept | Illustration prompt | Thumbnail prompt |
|----------|---------|---------------------|------------------|
| Technique | `angling` | [illustrations/angling.md](./illustrations/angling.md) | [angling-thumb.md](./illustrations/angling-thumb.md) |
| Sensation | `spreading` | [illustrations/spreading.md](./illustrations/spreading.md) | [spreading-thumb.md](./illustrations/spreading-thumb.md) |
| Timing | `warmup-window` | [illustrations/warmup-window.md](./illustrations/warmup-window.md) | [warmup-window-thumb.md](./illustrations/warmup-window-thumb.md) |
| Psychological | `non-concordance` | [illustrations/non-concordance.md](./illustrations/non-concordance.md) | [non-concordance-thumb.md](./illustrations/non-concordance-thumb.md) |
| Anatomy | `clitoral-structure` | [illustrations/clitoral-structure.md](./illustrations/clitoral-structure.md) | [clitoral-structure-thumb.md](./illustrations/clitoral-structure-thumb.md) |

## Procedure

1. Generate **illustration** per concept:
   - **ChatGPT Images 2** for `angling`, `non-concordance` — [`CHATGPT_THINKING_PROMPTS.md`](./CHATGPT_THINKING_PROMPTS.md)
   - **Gemini clinical** for `spreading`, `warmup-window`, `clitoral-structure` — [`GEMINI_CLINICAL_PROMPTS.md`](./GEMINI_CLINICAL_PROMPTS.md) (ChatGPT blocks these)
   - Optional **Nano Banana Pro 2** comparison on any concept
2. Generate **thumbnail** with ChatGPT Images 2 (simplified glyph of winning plate).
3. Save pilots to `assets/_staging/pilot/illustrations/{concept}/{generator}.png` (legacy: `illustrations/pilot/{concept}-{generator}.png`).
4. Run `npm run pilot-compare` — compare production vs pilots; score with rubric in [`ASSET_EVALUATION.md`](../ASSET_EVALUATION.md).
5. After in-app review: `npm run swap-pilot-winner -- {concept} {generator}` → compress → validate.
6. Record winners below; update `pipelines/IMAGE_GENERATION.md` § Tooling.

## Pilot outputs (track per concept)

| Concept | ChatGPT Images 2 | Nano Banana Pro 2 | Gemini | Notes |
|---------|------------------|-------------------|--------|-------|
| angling | ❌ `pilot/angling-chatgpt-images-2.png` (155 KB) | ⬜ | ⬜ | **Rejected:** titles + labels in image. Regen with updated prompt (no text). Production 297 KB |
| spreading | ❌ guardrails | ⬜ | ⬜ **next** | Production 1538 KB — regen required |
| warmup-window | ❌ guardrails | ⬜ | ⬜ **next** | Production 490 KB — use Gemini split-panel |
| non-concordance | ✅ **promoted to production** (221 KB) | ⬜ | ⬜ | Passed §9 QA May 19; backup at `pilot/non-concordance-production-backup.png` |
| clitoral-structure | ❌ guardrails | ⬜ | ⬜ **next** | Production 204 KB — baseline OK; Gemini for comparison |

## Interim size findings (`npm run pilot-review`)

| Concept | Production | Pilot | Verdict |
|---------|------------|-------|---------|
| angling | 297 KB | 155 KB | **Rejected** — in-image text; regen required |
| non-concordance | 221 KB (prod) | 221 KB | **Approved** — promoted May 19 |
| spreading | 1538 KB | — | P0 regen via Gemini |
| warmup-window | 490 KB | — | Regen via Gemini |
| clitoral-structure | 204 KB | — | Optional Gemini comparison |

## Results (fill after review board)

| Asset type | Primary tool | Notes |
|------------|--------------|-------|
| Illustrations | _TBD_ | Likely **split**: ChatGPT for technique/psych; Gemini clinical for anatomy/sensation timing |
| Thumbnails | _TBD_ | Likely ChatGPT Images 2 (glyph simplification) |

## Global prefix (all pilots)

From `design/STYLE_BIBLE.md`: Scientific Warmth, cream canvas `#F9F5F1`, bioluminescent emphasis, fine etching line work, no in-image text, non-judgmental tone, no stock poses or clinical cold white.

**Negative:** text, labels, watermarks, gore, hyper-realism, cold blue-white backgrounds, alarm red.
