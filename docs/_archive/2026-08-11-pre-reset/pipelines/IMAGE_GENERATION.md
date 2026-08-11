# Image Generation Pipeline

**Goal:** Regenerate thumbnails, illustrations, and shell assets in one coherent batch with reviewed prompts.

See: `design/STYLE_BIBLE.md`. Per-concept prompts: [`prompts/PROMPT_INDEX.md`](./prompts/PROMPT_INDEX.md) (22/22 migrated May 2026). Veo JSON remains in `asset_generation_prompts.md` until moved to `prompts/videos/`.

---

## Tooling (May 2026 — evaluate in pilot)

| Tool | Role |
|------|------|
| **Nano Banana Pro 2** (or successor) | Primary **illustrations** — anatomy consistency |
| **ChatGPT Images 2** | Thumbnails, UI accents, iteration variants |
| **sharp** + `npm run compress-assets` | Post-process all PNGs |

**Phase 1.3 pilot:** Run 5 concepts (one per category) through both tools; record winner per asset type here.

**Interim (May 19):** ChatGPT succeeded for `angling`, `non-concordance` (pilots under production size). ChatGPT blocks `spreading`, `warmup-window`, `clitoral-structure` — use [`prompts/GEMINI_CLINICAL_PROMPTS.md`](./prompts/GEMINI_CLINICAL_PROMPTS.md). Promote winners: `npm run swap-pilot-winner`.

**Pilot pack:** [`prompts/PILOT_BATCH.md`](./prompts/PILOT_BATCH.md) — prompts in `prompts/illustrations/{concept-id}.md`.  
**Format lock (prerequisite):** [`data/visual-formats.json`](../../data/visual-formats.json).

---

## Specs

| Asset | Size | Format | Max (post-compress) |
|-------|------|--------|---------------------|
| Illustration | 1024×1024 or 3:4 @2x | PNG | 400 KB |
| Thumbnail | 512×512 | PNG | 80 KB |
| Pathway hero | 1200×675 | PNG | 200 KB |
| Explainer header | 1200×675 | PNG | 200 KB |
| UI slide bg | 1080×1920 safe area | PNG | 150 KB |

---

## Prompt system

1. **Global prefix** — STYLE_BIBLE §3–5 (palette, lighting, no text).
2. **Category modifier** — technique / sensation / timing / psychological / anatomy.
3. **Concept body** — from `prompts/illustrations/{concept-id}.md` (Phase 2.3 enriched via `npm run enrich-illustration-prompts`).
4. **Negative prompt** — gore, text, stock poses, cold clinical white.

Store per concept:

```
docs/pipelines/prompts/illustrations/{concept-id}.md
docs/pipelines/prompts/illustrations/{concept-id}-thumb.md
```

**Pilot pack (5 concepts):** see [`prompts/PILOT_BATCH.md`](./prompts/PILOT_BATCH.md). Run `npm run pilot-review` after each generation round.

---

## Batch order

```
Style bible approved
  → Pilot 5 (illustration + thumbnail)
  → Review in app
  → Batch: Techniques (4) → Sensations (5) → Timing (3) → Psych (6) → Anatomy (4)
  → Shell (pathways, explainers, UI)
  → npm run compress-assets
  → Update ASSET_MANIFEST.md
```

---

## Approval

Every asset must pass the checklist in `design/STYLE_BIBLE.md` §9 before commit.
