# Documentation Index

**Start here** for project context, planning, and visual/asset work.

The production client is the **SwiftUI app** in [`../ios/`](../ios/). Editorial content flows from `data/*.ts` through the v2 bundle pipeline into the native app.

---

## Primary (current)

| Document | Purpose |
|----------|---------|
| [**v2/**](./v2/README.md) | Product brief, SwiftUI architecture, content system, and roadmap |
| [**v2/EXPO_RETIREMENT.md**](./v2/EXPO_RETIREMENT.md) | Expo retirement record — iOS-only, explainers kept, literacy report dropped |
| [**../ios/TESTFLIGHT_RUNBOOK.md**](../ios/TESTFLIGHT_RUNBOOK.md) | Xcode archive and TestFlight distribution |
| [**../ios/DEVICE_QA.md**](../ios/DEVICE_QA.md) | On-device QA checklist for the native app |

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
| [**content/COPY_GUIDELINES.md**](./content/COPY_GUIDELINES.md) | Editorial voice and slide copy rules |
| [**product/visual_content_strategy.md**](./product/visual_content_strategy.md) | Locked format per concept (Phase 1.2) |
| [**v2/CONTENT_SYSTEM.md**](./v2/CONTENT_SYSTEM.md) | Bundle model: `data/*.ts` → validated JSON bundles |

---

## Pipelines

| Document | Purpose |
|----------|---------|
| [pipelines/IMAGE_GENERATION.md](./pipelines/IMAGE_GENERATION.md) | Illustration & thumbnail batch workflow |
| [pipelines/prompts/PROMPT_INDEX.md](./pipelines/prompts/PROMPT_INDEX.md) | Per-concept illustration + thumbnail prompts (22/22) |
| [pipelines/prompts/PILOT_BATCH.md](./pipelines/prompts/PILOT_BATCH.md) | Phase 1.3 five-concept image pilot |
| [pipelines/VIDEO_GENERATION.md](./pipelines/VIDEO_GENERATION.md) | Gemini Omni + ffmpeg transcode workflow |
| [pipelines/VIDEO_CONCEPT_CATALOG.md](./pipelines/VIDEO_CONCEPT_CATALOG.md) | Expanded video scope (journeys + explainers) |
| [pipelines/REFERENCE_RENDERS.md](./pipelines/REFERENCE_RENDERS.md) | Style bible reference render workflow (Phase 1.1 gate) |
| [pipelines/ASSET_EVALUATION.md](./pipelines/ASSET_EVALUATION.md) | Rubric + promotion gates for pilots |
| [pipelines/ASSET_MANIFEST.md](./pipelines/ASSET_MANIFEST.md) | File inventory + wiring status |
| [asset_generation_prompts.md](./asset_generation_prompts.md) | January archive + Veo JSON (illustration prompts migrated) |
| [gemini_omni_best_practices.md](./gemini_omni_best_practices.md) | Gemini Omni prompting + editing reference |
| [veo3.1_best_practices.md](./veo3.1_best_practices.md) | Deprecated — redirects to Omni doc |

---

## Architecture & product

| Document | Purpose |
|----------|---------|
| [**architecture/backend.md**](./architecture/backend.md) | Backend quick reference |
| [backend-refactor-complete.md](./backend-refactor-complete.md) | Full refactor narrative |
| [DEVELOPMENT_TIMELINE.md](./DEVELOPMENT_TIMELINE.md) | Chronological git narrative |
| [product/market_analysis.md](./product/market_analysis.md) | Positioning and competitive landscape |

---

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run generate-v2-full-bundle` | Generate full v2 content bundle from `data/*.ts` |
| `npm run validate-v2-bundle:full` | Validate the full bundle against schema |
| `npm run lint-v2-content` | Editorial lint pass for bundle content |
| `npm run preview-v2-content` | Static HTML preview for editorial review |
| `npm run sync-ios-media` | Copy media into `ios/` resources |
| `npm run generate-concept-audit` | Refresh `content/CONCEPT_AUDIT.md` |
| `npm run bundle-report` | Write `reports/BUNDLE_REPORT.md` (asset sizes) |
| `npm run validate-manifest` | Check format lock, wiring, and size budgets |
| `npm run validate-manifest:strict` | Same checks; warnings fail CI (use before asset merges) |
| `npm run sync-registry` | Refresh `data/asset-registry.json` from disk + vocab |
| `npm run reference-renders` | Style bible reference render dashboard (Phase 1.1) |
| `npm run asset-dashboard` | Terminal progress summary (`--write` for markdown report) |
| `npm run pilot-compare` | List/score/decide pilot A/B variants ([rubric](./pipelines/ASSET_EVALUATION.md)) |
| `npm run pilot-review` | Alias for `pilot-compare` |
| `npm run swap-pilot-winner -- <concept> <generator>` | Promote pilot PNG to production + compress |
| `npm run enrich-illustration-prompts` | Phase 2.3 — deck-align all illustration prompt `.md` files |
| `npm run migrate-illustration-prompts` | Re-sync prompts from legacy doc (skips existing) |
| `./scripts/transcode-video.sh <input.mov>` | MP4 for app (≤1.5 MB target) |
| `npm run compress-assets` | PNG compression (recursive: illustrations, thumbnails, UI) |

---

## Historical

| Document | Notes |
|----------|-------|
| [_archive/expo-v1/](./_archive/expo-v1/README.md) | **Archived Expo v1 docs** — status report, implementation plan, QA checklist |
| [_archive/GAP_ANALYSIS.md](./_archive/GAP_ANALYSIS.md) | Superseded by archived PROJECT_STATUS_REPORT |
| [_archive/PHASE_3_UI_UX_REVAMP.md](./_archive/PHASE_3_UI_UX_REVAMP.md) | January 2026 sprint (archived) |
| [asset_inventory.md](./asset_inventory.md) | Redirect → `_archive/`; use CONCEPT_AUDIT + ASSET_MANIFEST |
| [asset_library.md](./asset_library.md) | Redirect → `_archive/`; use STYLE_BIBLE |
| [animation_journey.md](./animation_journey.md) | Redirect → `_archive/`; use VIDEO_GENERATION |
| [video_interactive_prompts.md](./video_interactive_prompts.md) | Redirect → `_archive/`; use prompts/ |
| [_archive/](./_archive/) | Retired planning docs |

---

## Quick map

| Question | Go to |
|----------|-------|
| What is the product? | `v2/PRODUCT_BRIEF.md` |
| How does the native app work? | `v2/NATIVE_ARCHITECTURE.md` |
| How does content reach the app? | `v2/CONTENT_SYSTEM.md` + `npm run generate-v2-full-bundle` |
| What's the build plan? | `v2/ROADMAP.md` |
| Is the visual language locked? | `npm run reference-renders` + `design/STYLE_BIBLE.md` |
| What does each concept need? | `content/CONCEPT_AUDIT.md` |
| How do I write copy? | `content/COPY_GUIDELINES.md` |
| How do I generate images? | `pipelines/IMAGE_GENERATION.md` |
| How do I generate videos? | `pipelines/VIDEO_GENERATION.md` |
| What files exist? | `data/asset-registry.json` + `npm run asset-dashboard` |
| How do I evaluate assets? | `pipelines/ASSET_EVALUATION.md` |
| How do I QA on device? | `../ios/DEVICE_QA.md` |
| How do I ship to TestFlight? | `../ios/TESTFLIGHT_RUNBOOK.md` |
| How does the backend work? | `architecture/backend.md` |
| Where are the old Expo docs? | `_archive/expo-v1/` |
