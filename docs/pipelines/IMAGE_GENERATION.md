# Image Generation Pipeline

**Goal:** Regenerate thumbnails, illustrations, and shell assets in one coherent batch with reviewed prompts.

See: `design/STYLE_BIBLE.md`, `asset_generation_prompts.md` (January prompts — migrate to per-concept files).

---

## Tooling (May 2026 — evaluate in pilot)

| Tool | Role |
|------|------|
| **Nano Banana Pro 2** (or successor) | Primary **illustrations** — anatomy consistency |
| **ChatGPT Images 2** | Thumbnails, UI accents, iteration variants |
| **sharp** + `npm run compress-assets` | Post-process all PNGs |

**Phase 1.3 pilot:** Run 5 concepts (one per category) through both tools; record winner per asset type here.

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
3. **Concept body** — from `asset_generation_prompts.md`, rewritten where under-specified.
4. **Negative prompt** — gore, text, stock poses, cold clinical white.

Store per concept:

```
docs/pipelines/prompts/illustrations/{concept-id}.md
docs/pipelines/prompts/illustrations/{concept-id}-thumb.md
```

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
