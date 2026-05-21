# Image Pilot Batch (Phase 1.3) — ✅ Complete

**Status:** Complete (May 20, 2026) — all 5 category reference renders approved in `data/reference-renders.json`.  
**Next:** Phase D full illustration batch — `npm run batch-asset-queue` · [`PHASE_D_RUNBOOK.md`](../PHASE_D_RUNBOOK.md)

| Category | Concept | Winner | Notes |
|----------|---------|--------|-------|
| Technique | `angling` | ChatGPT Images 2 | Reference render approved |
| Sensation | `spreading` | Gemini clinical | Reference render approved |
| Timing | `warmup-window` | Gemini clinical | Reference render approved |
| Psychological | `non-concordance` | ChatGPT Images 2 | In production; reference approved |
| Anatomy | `clitoral-structure` | Gemini clinical | Reference render approved |

## Tooling decision (batch)

| Asset type | Primary tool |
|------------|--------------|
| Illustrations | **Split:** ChatGPT for technique/psych; Gemini clinical for anatomy/sensation/timing when guardrails block |
| Thumbnails | ChatGPT Images 2 (glyph from winning plate) |

## Procedure (for remaining 17 concepts)

1. Use `docs/pipelines/prompts/illustrations/{concept-id}.md`
2. Save to `assets/images/concepts/illustrations/{concept-id}.png`
3. Thumbnail from `{concept-id}-thumb.md`
4. `npm run compress-assets` → validate §9 checklist
5. Do **not** regen reference concepts unless over size budget

See [`IMAGE_GENERATION.md`](../IMAGE_GENERATION.md) batch order.
