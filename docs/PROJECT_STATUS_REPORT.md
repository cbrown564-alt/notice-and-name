# Pleasure Vocabulary Builder — Project Status Report

**Report date:** May 20, 2026  
**Repository:** `pleasure-vocab` (private)  
**Last committed release point:** January 6, 2026 (`e7bafe1`)  
**Active branch:** `visual-v2-restart` — **engineering track active** (§8b); asset production paused (§8a)

### Phase snapshot (synced with `IMPLEMENTATION_PLAN.md`)

| Phase | Status |
|-------|--------|
| 0 — Reactivation | ✅ Complete |
| 1 — Foundation | 🟡 Partial (engineering ✅; pilots paused) |
| 2 — Copy | ✅ Complete |
| 3 — Asset production | ⏸ Postponed |
| 4 — Integration | 🟡 In progress (asset-free items via §8b) |
| 5 — Release candidate | ⬜ Not started |

---

## Executive summary

Pleasure Vocabulary Builder is a **feature-complete, local-first educational MVP** for learning and articulating sexual pleasure concepts through science-backed micro-lessons. The product went from scaffold to polished prototype in roughly **one week** of intensive development (late December 2025 through early January 2026), then paused. **Resumption (May 2026)** is underway on branch `visual-v2-restart` per `IMPLEMENTATION_PLAN.md` — Phases 0 and 2 complete; **asset generation postponed** while the **engineering track** (QA, UI shell, EAS, share/Lottie) runs on existing media.

The codebase is in **strong architectural health**: repository pattern, schema migrations, Zod validation, React Context, and **198 passing unit tests** on the data layer. Recent work: **Phase 2** (22/22 editorial copy, format lock, 22 illustration prompts, building/pulsing video prompts); **Gemini Omni** replaces Veo for video generation (`gemini_omni_best_practices.md`); **Phase 1 engineering** (H.264 MP4 transcode, all 22 concepts in pathways, theme token audit, validate-manifest, recursive compress-assets ~54 MB saved, IllustrateSlide poster + reduce-motion, CI, pilot workflow scripts).

**Active now (§8b):** device QA + citations, EAS/preview build, UI shell polish, share/Lottie/expo-video, plan hygiene.

**Paused (§8a):** style-bible reference renders (1/5 approved), image/video pilots, full illustration/thumbnail/shell regen, Phase 3 batches.

Five parallel workstreams (see Implementation Plan):

1. **Visual identity** — evolve beyond the January “Medical Luxury” pass into a unified, distinctive system.
2. **Documentation** — audit, consolidate, and establish a single source of truth.
3. **Concept audit** — verify all 22 concepts across every surface (copy, deck, library, pathways, share).
4. **Static asset pipeline** — batch-regenerate illustrations and thumbnails with current-generation tools.
5. **Video & motion pipeline** — replace the ad-hoc January workflow with a repeatable, quality-controlled process.

---

## Product definition

### Purpose

Help users (primarily women and partners) build a **precise vocabulary** and **scientific framework** for pleasure—turning intuitive experiences into named, reproducible concepts (e.g. Angling, Responsive Desire, Non-concordance).

### Differentiation

| Dimension | This app | Typical alternatives |
|-----------|----------|----------------------|
| Format | Named concepts + citations + pathways | Audio erotica (Dipsea), mindfulness (Ferly), video demos (OMGyes) |
| Hook | Language and mastery through naming | Mood, stories, or explicit demonstration |
| Tone | Warm, editorial, evidence-based | Clinical, entertainment, or generic wellness |

See `docs/product/market_analysis.md` for competitive context.

### Core user loop

1. Discover a concept (Home suggestion, Library, or Pathway).
2. Complete the **ConceptDeck** (5 slides): Recognize → Name → Illustrate → Understand → Reflect.
3. Set resonance status: **Tried it** / **Curious** / **Not for me**.
4. See patterns on the **Atelier** profile; optionally journal or share selections.

---

## What exists today

### Screens and features

| Area | Status | Notes |
|------|--------|-------|
| Onboarding | ✅ Complete | Welcome, privacy, goals (tone selection removed) |
| Home | ✅ Complete | Greeting, daily suggestion, resume, stats |
| Library | ✅ Complete | All / Pathways / Research; category filters |
| Concept detail + ConceptDeck | ✅ Complete | 5-slide arc; video, Skia, or static on Illustrate |
| Journal | ✅ Complete | Reflection entries |
| Profile (“Atelier”) | ✅ Complete | Bento stats, pattern insights, collection shelf |
| Communication toolkit | ✅ Complete | Starters, scripts, barriers |
| Share / export | 🟡 Functional | `app/share.tsx` uses native Share API; needs polish |
| Research explainers | ✅ Complete | 4 articles with detail screens |

### Content inventory

| Type | Count | Location |
|------|-------|----------|
| Concepts | 22 | `data/vocabulary.ts` |
| Pathways | 5 | `data/pathways.ts` |
| Explainers | 4 | `data/explainers.ts` |
| Communication scripts | — | `data/communication.ts` |

**Categories:** Techniques (4), Sensations (5), Timing (3), Psychological (6), Anatomy (4).

All content is currently `tier: 'free'`; premium gating is typed but not enforced.

### Rich media (Illustrate slide)

| Mechanism | Concepts | Implementation |
|-----------|----------|----------------|
| Skia interactive diagram | Angling, Rocking, Shallowing, Pairing | `components/diagrams/*` |
| Video loop | Building, Spreading, Responsive Desire | `expo-video` via `IllustrateVideo.tsx` — **MP4 only** in app bundle |
| Static illustration | Most others | PNG in `assets/images/concepts/illustrations/` |
| Thumbnail (library/card) | Most | `assets/images/concepts/thumbnails/` |

**Gaps:** Copy + citations complete; **device QA** still open. **Video scope expanded (May 20):** Omni enables **scientific-journey** videos (scale zoom) for anatomy + process explainers — see `VIDEO_CONCEPT_CATALOG.md`. P0 pilots now include Clitoral Structure + Nerve Density alongside Building/Pulsing. Most journey MP4s not yet generated (static poster fallback OK). See `pipelines/ASSET_MANIFEST.md`.

### Tech stack

- **Expo SDK 54**, React 19, React Native 0.81, Expo Router 6
- **Persistence:** SQLite (native) + AsyncStorage (web); platform adapters behind repository layer
- **Validation:** Zod (`lib/validation.ts`)
- **Animation:** Reanimated; **Skia** for diagrams; **Lottie** (`ResonanceBurst` on Reflect slide)
- **Assets on disk:** ~228 MB under `assets/` (162 image/video files)

### Quality and operations

| Item | Status |
|------|--------|
| Unit tests | ✅ 198 tests, 6 suites (repositories, validation, errors) |
| Component / E2E tests | ❌ None |
| CI/CD | ✅ `test` + `validate-manifest` on push/PR (`.github/workflows/ci.yml`) |
| Store / EAS | 🟡 `eas.json` (dev/preview/prod); preview build not yet cut |
| Error UI | ✅ Toast, full-screen, inline (Jan 6 commit) |

---

## Development history (condensed)

| Period | Milestone |
|--------|-----------|
| Dec 31, 2025 | Expo scaffold |
| Jan 2, 2026 | Phase 1: core screens, DB, first concepts |
| Jan 2–3 | Phase 2: 22 concepts, pathways, explainers, communication |
| Jan 4–5 | Phase 3: UI/UX revamp, ConceptDeck arc, illustrations |
| Jan 5–6 | Backend refactor (8 phases), tests, error UI |

Full chronology: `docs/DEVELOPMENT_TIMELINE.md`.

**Velocity:** 41 commits total; ~90% of meaningful work landed in the first week.

---

## Uncommitted work (as of May 2026)

The working tree contains work **not on `main`** that represents a partial “visual identity v2” effort:

| Change | Description |
|--------|-------------|
| 7 illustration PNGs | Updated (golden-trio, plateauing, non-concordance, pairing, etc.) |
| 5 thumbnails | New/regenerated (angling, clitoral-structure, nerve-density, rocking, shallowing) |
| `spreading.mp4` | Wired in `vocabulary.ts` |
| `building.mp4`, `responsive-desire.mp4` | Transcoded from MOVs (≤1.5 MB budget) |
| Pathways | All 22 concepts now in ≥1 pathway |
| Docs | `STYLE_BIBLE`, `COPY_GUIDELINES`, `architecture/backend.md`, pilot prompts |
| UI tweaks | `ConceptCard.tsx`, `IllustrateSlide.tsx` |
| New docs | `holistic_visual_identity.md`, `app_visual_identity.md`, `asset_visual_identities.md`, `asset_inventory.md`, `veo3.1_best_practices.md` |
| Cleanup | Archive deletions, removed `angling.mov`, `insight-pattern.png` |

**Risk:** Four months of context drift; uncommitted assets may not match current code expectations. First resumption task should be to **commit or consciously discard** this batch.

---

## Documentation health

**Index:** `docs/README.md` — start here.

| Area | Canonical doc |
|------|----------------|
| Status + plan | `PROJECT_STATUS_REPORT.md`, `IMPLEMENTATION_PLAN.md` |
| Visual | `design/STYLE_BIBLE.md` |
| Concepts | `content/CONCEPT_AUDIT.md` (auto-generated), `content/COPY_GUIDELINES.md` |
| Pipelines | `pipelines/IMAGE_GENERATION.md`, `VIDEO_GENERATION.md`, `ASSET_MANIFEST.md` |
| Architecture | `architecture/backend.md` (+ full `backend-refactor-complete.md`) |
| Product | `product/market_analysis.md` |

**Archived:** `GAP_ANALYSIS.md`, `PHASE_3_UI_UX_REVAMP.md` → `_archive/`. Legacy prompts remain in `asset_generation_prompts.md` until migrated to `pipelines/prompts/`.

---

## Architecture assessment

### Strengths

- **Single source of truth** for user data (post-refactor)
- **Testable** repository layer with mock adapters
- **Runtime validation** prevents silent corruption
- **Migrations** support schema evolution
- **Platform abstraction** enables native + web without duplicating business logic

### Layer diagram

```
Screens / Components
        ↓
hooks/useDatabase.ts
        ↓
DataContext (React)
        ↓
Repositories (Concept, Journal, Pathway, Onboarding, Settings)
        ↓
StorageAdapter
   ├── SQLiteAdapter (native)
   └── AsyncStorageAdapter (web)
```

### Remaining technical debt (lower priority)

- Profile pattern insights recalculate on render (memoization partial)
- No analytics/event pipeline beyond scaffolding
- No multi-device sync or export/import UX
- Web parity for Skia/video not recently verified

---

## Asset and media audit summary

### Three-tier visual system (per concept)

1. **Thumbnail** — library grid, cards  
2. **Illustration** — ConceptDeck Illustrate slide (static)  
3. **Rich media** — video loop, Skia diagram, or planned interactive  

### Completion snapshot

| Tier | Rough status |
|------|----------------|
| Illustrations | ~most exist; quality mixed; January batch partially superseded in working tree |
| Thumbnails | Several missing (spectatoring, embodied-presence, non-concordance, body-appreciation) |
| Video | 3 wired (`building`, `spreading`, `responsive-desire`) as MP4; transcode script + `VIDEO_GENERATION.md` |
| Interactive | 4 wired (Angling, Rocking, Shallowing, Pairing) |

Detailed per-concept table: `docs/content/CONCEPT_AUDIT.md` (`npm run generate-concept-audit`).  
Format-by-concept rationale: `docs/product/visual_content_strategy.md`.

### Video pipeline (May 2026)

- **Resolved:** App bundle uses H.264 MP4 only; `scripts/transcode-video.sh` documents ffmpeg settings.
- **Resolved:** Unused `rocking.mov` / `shallowing.mov` removed; ProRes sources in `assets/videos/originals/`.
- **Open (Phase 3 / §8a):** `spreading.mp4` at 1.6 MB (optional re-transcode); Pulsing / Spontaneous Desire / Embodied Presence videos not yet generated.
- **Resolved:** Reduced-motion static fallback in IllustrateSlide (Phase 1).
- **Resolved:** Video prompts for building/pulsing (`pipelines/prompts/videos/`).

---

## Gap analysis (refreshed)

### Done since January

| Item | Status |
|------|--------|
| Backend repository refactor | ✅ |
| Unit tests (data layer) | ✅ |
| Error UI | ✅ |
| ConceptDeck 5-slide flow | ✅ |
| Legacy dual state store | ✅ Removed |

### Still open (prioritized)

**Engineering track (active — no new assets):**

| Priority | Gap | Plan ref |
|----------|-----|----------|
| **P0** | Device QA all 22 concepts; tick `data/qa-passed.json` | §8b Batch 1 |
| **P0** | EAS preview build (`npm run build:preview`) | §8b Batch 2 |
| **P1** | Share smoke test (iOS + Android) | §8b Batch 1 / 4 |
| ~~**P1**~~ | ~~UI shell polish (typography, deck chrome, profile, onboarding)~~ | ✅ §8b Batch 3 |
| ~~**P1**~~ | ~~Share flow polish; Lottie; expo-video; profile memoization~~ | ✅ §8b Batch 4 |

**Asset track (paused — §8a):**

| Priority | Gap | Plan ref |
|----------|-----|----------|
| **P0** | Style bible ratification (1/5 reference renders; pilots pending) | Phase 1.1, 3.0 |
| **P0** | Batch asset regeneration (illustrations, thumbnails, shell images) | Phase 3 |
| **P0** | Video generation (pulsing, spontaneous-desire, embodied-presence) | Phase 3.4 |
| ~~**P1**~~ | ~~Wire orphan assets~~ | ✅ Pairing + spreading wired |
| ~~**P1**~~ | ~~CI (`npm test`)~~ | ✅ test + validate-manifest on PR |
| ~~**P1**~~ | ~~Editorial copy pass~~ | ✅ Phase 2.1 |
| ~~**P1**~~ | ~~Video pipeline docs + transcode~~ | ✅ `VIDEO_GENERATION.md`, MP4 wired |

**Deferred (v1.0 out of scope):** Spaced repetition, search, premium, partner mode.

---

## Risks and dependencies

| Risk | Mitigation |
|------|------------|
| Asset regeneration without style lock produces incoherent library | Approve style bible + 3–5 reference renders before batch (§8a; paused) |
| Engineering polish blocked waiting on art | §8b runs on current assets; delta QA only after Phase 3 |
| Scope creep across 22 concepts × 3 tiers | Phased batches by category; manifest-driven checklist |
| Video cost/time | Reserve video for concepts where motion is essential; prefer diagram/static elsewhere |
| Doc drift recurs | Single `docs/README.md` index; archive superseded files |
| Store rejection (sensitive content) | Clinical tone, no explicit imagery; age gate in onboarding |
| Bundle size | `compress-assets` script + size budget per asset type |

---

## Readiness assessment

| Dimension | Score | Notes |
|-----------|-------|-------|
| Core UX | **8/10** | Coherent flows; needs media consistency |
| Content depth | **7/10** | 22 concepts complete in data; quality uneven |
| Visual polish | **5/10** | Strong shell; asset tier inconsistent |
| Engineering | **8/10** | Solid foundation; needs CI and component tests |
| Ship readiness | **5/10** | CI ✅; EAS config ✅; preview build + device QA still open |

**Overall:** Strong baseline prototype ready for a **focused production pass**, not a rewrite. Current sprint is **engineering-first**; visual batch resumes when §8a restarts.

---

## Recommended immediate actions

**Active — engineering track (`IMPLEMENTATION_PLAN.md` §8b):**

1. **Batch 1:** Device QA all 22 concepts per `QA_CHECKLIST.md`; set ids in `data/qa-passed.json`; `npm run generate-concept-audit`; share smoke test (iOS + Android).
2. **Batch 2:** Run `npm run build:preview` (EAS); install on device; re-spot-check if needed.
3. ~~**Batch 3:** UI shell polish~~ — ✅ deck typography tokens, IllustrateSlide, Profile, onboarding, ConceptCard.
4. **Batch 4:** Lottie on resonance, share polish, `expo-av` → `expo-video`, profile insights memoization.
5. **Batch 5:** Sync this report after each batch; optional video-doc merge.

**When asset track resumes (§8a):**

1. Complete pilots (STYLE_BIBLE renders, `PILOT_BATCH.md`, building/pulsing Veo).
2. Run Phase 3 batches; update `ASSET_MANIFEST.md` same day as commits.
3. Delta QA only on concepts whose assets changed.

**Housekeeping:** Commit `visual-v2-restart` batch when ready (videos, pathways, docs, compressed assets).

---

## Related documents

| Document | Role |
|----------|------|
| `IMPLEMENTATION_PLAN.md` | Phased plan; **§8b** = active engineering track, **§8a** = paused assets |
| `design/STYLE_BIBLE.md` | Canonical visual language (v0.1) |
| `content/CONCEPT_AUDIT.md` | Per-concept tracker (`npm run generate-concept-audit`) |
| `QA_CHECKLIST.md` | Manual device QA script |
| `architecture/backend.md` | Backend quick reference |

---

*This report supersedes `_archive/GAP_ANALYSIS.md`. Sync with `IMPLEMENTATION_PLAN.md` at each phase boundary.*

**Changelog:** May 19, 2026 — Synced with plan resequence: Phase 2 complete, Phase 3 postponed, §8a/§8b tracks, engineering batches as recommended actions.
