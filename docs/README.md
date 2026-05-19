# Documentation Index

**Start here** for project context, planning, and visual/asset work.

---

## Primary (current)

| Document | Purpose |
|----------|---------|
| [**PROJECT_STATUS_REPORT.md**](./PROJECT_STATUS_REPORT.md) | Snapshot of product, codebase, assets, gaps, and risks |
| [**IMPLEMENTATION_PLAN.md**](./IMPLEMENTATION_PLAN.md) | Phased plan: identity, docs, audit, pipelines, ship |

---

## Design

| Document | Purpose |
|----------|---------|
| [**design/STYLE_BIBLE.md**](./design/STYLE_BIBLE.md) | **Canonical** visual language (v0.1 draft) |
| [holistic_visual_identity.md](./holistic_visual_identity.md) | Master DNA — merged into style bible |
| [app_visual_identity.md](./app_visual_identity.md) | UI shell — merged into style bible |
| [asset_visual_identities.md](./asset_visual_identities.md) | Concept plates — merged into style bible |

---

## Content

| Document | Purpose |
|----------|---------|
| [**content/CONCEPT_AUDIT.md**](./content/CONCEPT_AUDIT.md) | Per-concept cross-surface tracker (auto-generated) |
| [visual_content_strategy.md](./visual_content_strategy.md) | Format choice: interactive / static / video |

---

## Pipelines

| Document | Purpose |
|----------|---------|
| [pipelines/IMAGE_GENERATION.md](./pipelines/IMAGE_GENERATION.md) | Illustration & thumbnail batch workflow |
| [pipelines/VIDEO_GENERATION.md](./pipelines/VIDEO_GENERATION.md) | Veo + ffmpeg transcode workflow |
| [pipelines/ASSET_MANIFEST.md](./pipelines/ASSET_MANIFEST.md) | File inventory + wiring status |
| [asset_generation_prompts.md](./asset_generation_prompts.md) | January prompts (migrate to `pipelines/prompts/`) |
| [veo3.1_best_practices.md](./veo3.1_best_practices.md) | Deep Veo reference |

---

## Architecture & product

| Document | Purpose |
|----------|---------|
| [backend-refactor-complete.md](./backend-refactor-complete.md) | Repository pattern, migrations, validation |
| [DEVELOPMENT_TIMELINE.md](./DEVELOPMENT_TIMELINE.md) | Chronological git narrative |
| [market_analysis.md](./market_analysis.md) | Positioning and competitive landscape |

---

## Scripts

| Command | Purpose |
|---------|---------|
| `node scripts/generate-concept-audit.js` | Refresh `content/CONCEPT_AUDIT.md` |
| `./scripts/transcode-video.sh <input.mov>` | MP4 for app (≤1.5 MB target) |
| `npm run compress-assets` | PNG compression |

---

## Historical

| Document | Notes |
|----------|-------|
| [_archive/GAP_ANALYSIS.md](./_archive/GAP_ANALYSIS.md) | Superseded by PROJECT_STATUS_REPORT |
| [PHASE_3_UI_UX_REVAMP.md](./PHASE_3_UI_UX_REVAMP.md) | Historical sprint |
| [asset_inventory.md](./asset_inventory.md) | Superseded by ASSET_MANIFEST + CONCEPT_AUDIT |
| [_archive/](./_archive/) | Retired planning docs |

---

## Quick map

| Question | Go to |
|----------|-------|
| Where are we? | `PROJECT_STATUS_REPORT.md` |
| What's the plan? | `IMPLEMENTATION_PLAN.md` |
| What should it look like? | `design/STYLE_BIBLE.md` |
| What does each concept need? | `content/CONCEPT_AUDIT.md` |
| How do I generate images? | `pipelines/IMAGE_GENERATION.md` |
| How do I generate videos? | `pipelines/VIDEO_GENERATION.md` |
| What files exist? | `pipelines/ASSET_MANIFEST.md` |
