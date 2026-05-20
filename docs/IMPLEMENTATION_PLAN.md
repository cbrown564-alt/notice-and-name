# Implementation Plan: Baseline → Polished Product

**Created:** May 19, 2026  
**Last updated:** May 20, 2026  
**Companion:** [`PROJECT_STATUS_REPORT.md`](./PROJECT_STATUS_REPORT.md)  
**Horizon:** Multi-phase (estimate 6–10 weeks focused effort, adjustable)  
**Active branch:** `visual-v2-restart` (`dfda4b7`)

### Phase status (snapshot)

| Phase | Status | Notes |
|-------|--------|-------|
| **0 — Reactivation** | ✅ Complete | Branch, docs skeleton, audit, style bible v0.1, orphan wiring |
| **1 — Foundation** | 🟡 Partial | Engineering + format lock ✅; **pilots paused** (1.1, 1.3, 1.4 resume with Phase 3) |
| **2 — Copy** | ✅ Complete | 22/22 copy, formats, illustration + video prompts ready for batch |
| **3 — Asset production** | ⏸ Postponed | Resumes after engineering track (§8b); partial January refresh on branch |
| **4 — Integration** | 🟡 In progress | Pulled forward **without assets** — QA, UI shell, EAS, share/Lottie (§8b) |
| **5 — Release candidate** | ⬜ Not started | After Phase 3 + 4 exit criteria |

**Active track:** §8b Engineering track (asset-independent). Asset track (§8a) resumes when generation restarts.

---

## 1. Vision and definition of done

### Vision

A **beautiful, coherent, evidence-grounded** mobile experience where every concept feels intentionally designed—unified visual language, correct media format per idea, copy that rewards close reading, and interactions that make abstract ideas tangible.

The app should feel like a **living journal in a modern laboratory**: warm, safe, precise—not clinical, not generic wellness, not stock “AI art.”

### Definition of done (release candidate)

| Criterion | Measurable target |
|-----------|-------------------|
| **Visual identity** | Style bible approved; 100% of UI and concept assets conform |
| **Concepts** | All 22 audited; every surface shows consistent name, definition, status, and media |
| **Assets** | Full manifest: thumbnail + illustration + rich media per concept; no placeholders |
| **Video/motion** | Pipeline documented; each video ≤ agreed size budget; formats consistent |
| **Documentation** | `docs/README.md` index; no contradictory “sources of truth”; archived superseded docs |
| **Quality** | CI green; manual QA script passed on iOS + one Android device |
| **Distribution** | EAS build; TestFlight (or internal track) installable |

---

## 2. Workstreams (parallel threads)

Five threads run throughout the project. They have dependencies but should not be serialized unnecessarily.

```
┌─────────────────────────────────────────────────────────────────┐
│  A. Visual Identity & Design System                             │
├─────────────────────────────────────────────────────────────────┤
│  B. Documentation Consolidation                                 │
├─────────────────────────────────────────────────────────────────┤
│  C. Concept Audit (cross-surface)                               │
├─────────────────────────────────────────────────────────────────┤
│  D. Static Asset Pipeline (images)                              │
├─────────────────────────────────────────────────────────────────┤
│  E. Video & Motion Pipeline                                     │
└─────────────────────────────────────────────────────────────────┘
         │                    │                    │
         └──────────┬─────────┴─────────┬──────────┘
                    ▼                   ▼
            F. Engineering Polish   G. Ship & QA
```

---

## Workstream A — Visual Identity & Design System

**Goal:** One distinctive, enforceable visual language from app chrome through concept plates.

### A.1 Consolidate identity documents

Merge and reconcile:

- `holistic_visual_identity.md` — master DNA (“Scientific Warmth”)
- `app_visual_identity.md` — UI shell
- `asset_visual_identities.md` — concept plates (“Renaissance / Bioluminescence”)
- `constants/theme.ts` — implemented tokens

**Deliverable:** `docs/design/STYLE_BIBLE.md` (new canonical doc) + update `theme.ts` if tokens drift.

**Status (May 2026):** ✅ `docs/design/STYLE_BIBLE.md` v0.1 drafted (merges identity trio + token table). Source docs retained until ratification. ✅ `theme.ts` token audit — `conceptCanvas`, `diagram.*` tokens added May 19.

### A.2 Identity pillars (drafted — ratify in Phase 1.1)

| Layer | Role | Keywords |
|-------|------|----------|
| **Shell** | Host; never competes with content | Editorial serif, sand paper, coral/sage, generous whitespace |
| **Concept plates** | Teach *what* it is | Anatomical clarity, warm cream canvas `#F9F5F1`, bioluminescent emphasis, no in-image text |
| **Thumbnails** | Recognize at a glance | Simplified glyph of plate; consistent crop, border, glow accent |
| **Motion** | Teach *how it feels* | Abstract loops; no literal bodies where avoidable |
| **Interactive** | Teach *mechanics* | Skia diagrams; restrained palette matching plates |

### A.3 Beyond January “Medical Luxury”

January established a direction; the next pass should:

1. **Tighten** color, lighting, and figure style across all 22 (not just refreshed subsets).
2. **Differentiate** category families (technique vs sensation vs psychology) through subtle visual cues—not different styles.
3. **Upgrade** empty states, tab icons, pathway art, and explainer headers to match plates.
4. **Define** motion and diagram color tokens so Skia/video don’t look like a different app.
5. **Specify** accessibility: contrast ratios, minimum touch targets, reduced-motion fallbacks.

### A.4 UI implementation tasks

| Task | Files / area |
|------|----------------|
| Token audit vs `theme.ts` | `constants/theme.ts`, `constants/Colors.ts` | ✅ May 19 |
| Compress legacy PNGs (recursive) | `scripts/compress-assets.js` | ✅ May 19 — 53 MB saved; many still over budget → Phase 3 regen |
| Manifest size-budget warnings | `scripts/validate-manifest.js` | ✅ May 19 |
| Typography scale consistency | `components/ui/Typography.tsx`, deck slides (`deckPrompt`, `deckLead`) | ✅ May 20 |
| Card / deck slide backgrounds | `assets/images/ui/slide-*.png` → regenerate or CSS |
| ConceptCard thumbnail framing | `components/ConceptCard.tsx` |
| Illustrate slide layout (caption, mute, diagram chrome) | `IllustrateSlide.tsx` |
| Profile Atelier refresh | `app/(tabs)/profile.tsx` |
| Onboarding visual pass | `app/onboarding/*` |

### A.5 Acceptance criteria

- [ ] Style bible signed off with 5 reference renders (one per category family)
- [ ] Figma or pinned reference folder optional but recommended
- [ ] No asset committed without checklist sign-off against bible
- [x] Dark mode decision: **out of scope** for v1.0 RC (documented in `STYLE_BIBLE.md` §8)

---

## Workstream B — Documentation Consolidation

**Goal:** One navigable doc system; no stale contradictions.

### B.1 Target structure

```
docs/
├── README.md                 # Index + “start here”
├── PROJECT_STATUS_REPORT.md  # This report (living)
├── IMPLEMENTATION_PLAN.md    # This plan (living)
├── design/
│   └── STYLE_BIBLE.md
├── architecture/
│   └── backend.md            # From backend-refactor-complete.md
├── content/
│   ├── CONCEPT_AUDIT.md      # Master spreadsheet export
│   └── COPY_GUIDELINES.md
├── pipelines/
│   ├── IMAGE_GENERATION.md
│   ├── VIDEO_GENERATION.md
│   └── ASSET_MANIFEST.md
├── product/
│   ├── market_analysis.md
│   └── visual_content_strategy.md  # Updated
└── _archive/                 # Historical only
```

### B.2 Consolidation tasks

| Action | Source files | Status |
|--------|----------------|--------|
| **Archive** | `GAP_ANALYSIS.md` → superseded by status report | ✅ `docs/_archive/GAP_ANALYSIS.md` |
| **Archive** | `PHASE_3_UI_UX_REVAMP.md` → historical banner only | ✅ `_archive/PHASE_3_UI_UX_REVAMP.md` + stub |
| **Merge** | Identity trio → `design/STYLE_BIBLE.md` | ✅ v0.1 draft |
| **Merge** | `asset_generation_prompts.md` + tool notes → `pipelines/IMAGE_GENERATION.md` | ✅ Illustration prompts in `pipelines/prompts/illustrations/`; Veo JSON still in legacy file |
| **Merge** | `veo3.1_best_practices.md`, `video_interactive_prompts.md`, `animation_journey.md` → `pipelines/VIDEO_GENERATION.md` | ✅ Operational doc + `gemini_omni_best_practices.md` (Veo doc deprecated) |
| **Refresh** | `asset_inventory.md` → `pipelines/ASSET_MANIFEST.md` | ✅ Initial manifest; keep in sync per batch |
| **Trim** | Remove completed TODOs from `backend-refactor-complete.md` | ✅ Historical banner + `architecture/backend.md` pointer |
| **Link** | Root `README.md` → `docs/README.md` | ✅ |
| **Index** | `docs/README.md` lists active docs | ✅ |
| **Living plan** | `IMPLEMENTATION_PLAN.md`, `PROJECT_STATUS_REPORT.md` | ✅ Created |
| **Copy** | `content/COPY_GUIDELINES.md` | ✅ |
| **Architecture** | `architecture/backend.md` | ✅ |
| **Product** | `product/market_analysis.md` | ✅ moved from docs root |

### B.3 Living documents

| Doc | Update trigger |
|-----|----------------|
| `PROJECT_STATUS_REPORT.md` | End of each phase |
| `pipelines/ASSET_MANIFEST.md` | Every asset batch merge |
| `content/CONCEPT_AUDIT.md` | Any vocabulary or slide change |

### B.4 Acceptance criteria

- [x] `docs/README.md` lists every active doc with one-line purpose
- [x] No open P0 task references a deleted or archived file as sole source (`GAP_ANALYSIS` archived)
- [x] README in repo root points to design bible + manifest
- [x] `COPY_GUIDELINES.md`, `architecture/backend.md`, `product/` folder per target structure

---

## Workstream C — Concept Audit (All Surfaces)

**Goal:** Every concept is correct, complete, and consistent everywhere it appears.

### C.1 Surfaces to audit (per concept)

| # | Surface | Location |
|---|---------|----------|
| 1 | Core metadata | `data/vocabulary.ts` — id, name, category, definition, researchBasis, source, tier |
| 2 | Slides (×5) | `slides[]` — recognize, name, illustrate, understand, reflect |
| 3 | Rich media binding | `diagramType`, `illustrationVideo`, `illustrationAsset` |
| 4 | Thumbnail | `assets/images/concepts/thumbnails/{id}.png` |
| 5 | Illustration | `assets/images/concepts/illustrations/{id}.png` |
| 6 | Library card | `ConceptCard` rendering |
| 7 | Concept deck | `ConceptDeck` + slide components |
| 8 | Pathway membership | `data/pathways.ts` |
| 9 | Related concepts | `relatedConcepts[]` links valid |
| 10 | Share export | `app/share.tsx` labels |
| 11 | Communication refs | `data/communication.ts` if mentioned |

### C.2 Audit columns (master tracker)

**Status:** ✅ `docs/content/CONCEPT_AUDIT.md` — 22 rows auto-generated via `npm run generate-concept-audit`. Manual columns (`copy_reviewed`, `qa_passed`) still open.

Create `docs/content/CONCEPT_AUDIT.md` (or Google Sheet) with one row per concept:

| Column | Question |
|--------|----------|
| `id` | Stable slug |
| `category` | Correct enum |
| `copy_reviewed` | Definition + slides proofread |
| `citations_ok` | Sources accurate and formatted |
| `slide_complete` | All 5 slides populated (no fallbacks) |
| `format_choice` | interactive / static / video per `visual_content_strategy` |
| `thumbnail` | path + status |
| `illustration` | path + status |
| `rich_media` | path + type + status |
| `wired_in_code` | require() paths resolve |
| `pathways` | listed in ≥1 pathway |
| `qa_passed` | device screenshot sign-off |

### C.3 Copy review focus

- Definitions: second-person, non-judgmental, concrete
- **Reflect** slides: actionable “try this” without prescriptive partner dynamics
- **Understand** slides: cite studies without overstating evidence
- Align terminology with explainers (e.g. CUV, responsive desire)
- Trim redundancy between Recognize and Name slides

### C.4 Execution order

1. **Inventory** — ✅ `scripts/generate-concept-audit.js` → `CONCEPT_AUDIT.md`
2. **Format assignment** — ✅ Locked in `data/visual-formats.json` + `product/visual_content_strategy.md`
3. **Copy pass** — ✅ editorial read of all 22 (May 19 — `copy-review.json`)
4. **Asset pass** — ⏸ deferred with Phase 3; filesystem columns auto-checked
5. **QA pass** — 🟡 device walkthrough per category batch (§8b Batch 1)

**Known gaps (from audit):**

- ~~3 concepts not in any pathway~~ — **resolved:** added to `foundations` / `partner-communication`
- Spreading lacks dedicated illustration PNG (uses thumbnail on illustrate slide)
- ~~Several concepts missing dedicated thumbnails~~ — ✅ all 22 wired in `vocabulary.ts` (May 20 Phase A)

### C.5 Acceptance criteria

- [x] 22/22 rows exist in audit tracker
- [ ] 22/22 rows complete with no “placeholder” asset or format status
- [x] Zero broken `require()` paths (on `visual-v2-restart`)
- [x] Related concept graph has no dangling ids
- [x] All concepts in ≥1 pathway

---

## Workstream D — Static Asset Pipeline (Images)

**Goal:** Regenerate **all** static assets in one coherent batch using current-generation tools, with reviewed prompts and descriptions.

### D.1 Tooling evaluation (May 2026)

| Tool | Suggested use | Notes |
|------|---------------|-------|
| **Google Nano Banana Pro 2** | Primary concept **illustrations** | Successor to Pro used in January; evaluate anatomy consistency, style adherence |
| **ChatGPT Images 2** | Thumbnails, UI accents, abstract plates, iteration | Strong for refinement loops; use for variants and shell assets |
| **Existing pipeline** | `scripts/compress-assets.js` + Sharp | Post-process all outputs |

**Process:** Run a **pilot of 5 concepts** (one per category) through both tools; pick primary generator per asset type; document in `pipelines/IMAGE_GENERATION.md`.

### D.2 Asset classes and specs

| Asset | Dimensions (draft) | Format | Max size |
|-------|-------------------|--------|----------|
| Illustration | 1024×1024 or 3:4 @2x | PNG | 400 KB post-compress |
| Thumbnail | 512×512 | PNG | 80 KB |
| Pathway hero | 1200×675 | PNG | 200 KB |
| Explainer header | 1200×675 | PNG | 200 KB |
| UI slide bg | 1080×1920 safe area | PNG | 150 KB |

### D.3 Prompt system

1. **Global prefix** — from STYLE_BIBLE (palette, lighting, no text, tone).
2. **Category modifier** — technique / sensation / timing / psychological / anatomy.
3. **Concept body** — migrated from `asset_generation_prompts.md`, **rewritten** where January prompts under-specify composition.
4. **Negative prompt** — explicit anatomy, gore, text, stock-photo poses.

Store prompts in `pipelines/prompts/illustrations/{concept-id}.md` (one file per concept) for reproducibility.

### D.4 Batch workflow

```
Style bible approved
    → Pilot 5 concepts (illustration + thumbnail)
    → Review board (compare side-by-side in app)
    → Revise bible / prompts
    → Batch 1: Techniques (4)
    → Batch 2: Sensations (5)
    → Batch 3: Timing (3)
    → Batch 4: Psychological (6)
    → Batch 5: Anatomy (4)
    → Shell assets (pathways, explainers, UI)
    → compress-assets.js
    → Update ASSET_MANIFEST.md
    → Commit per batch
```

### D.5 Description review

January concept **definitions and illustration captions** should be re-read alongside new art:

- If the image teaches better with a different metaphor, **update copy** not just the prompt.
- Log copy changes in `CONCEPT_AUDIT.md`.

### D.6 Acceptance criteria

- [ ] 22 illustrations + 22 thumbnails + pathway/explainer set regenerated
- [ ] All pass style bible checklist
- [ ] Manifest 100% populated
- [ ] `npm run compress-assets` run on final set

---

## Workstream E — Video & Motion Pipeline

**Goal:** Replace the messy January ad-hoc process with a **defined, repeatable** pipeline; use video only where motion is essential.

### E.1 Problems to fix (from January)

| Problem | Fix |
|---------|-----|
| Mixed `.mov` / `.mp4` | Standardize on **H.264 MP4** for app; keep ProRes originals outside repo |
| 5 MB+ files | Transcode + target **≤ 1.5 MB** per loop (720p, 8–12s) |
| Unwired assets | Manifest requires `vocabulary.ts` field before commit |
| Wrong tool for concept | Apply `visual_content_strategy` — don’t video what a diagram teaches |
| Redundant rocking video + Skia | Pick **one** primary; other as optional fallback or remove |
| Scattered docs | Single `pipelines/VIDEO_GENERATION.md` |

### E.2 When to use video (decision tree)

```
Is the concept about physical mechanics with variables?
  YES → Interactive Skia (not video)
  NO → Is the core insight temporal / rhythmic / emotional flow?
    YES → Abstract motion video (8–15s loop)
    NO → Is it anatomical structure or comparison?
      YES → Rich static illustration
      NO → Re-evaluate format
```

### E.3 Tooling

| Stage | Tool | Output |
|-------|------|--------|
| Generation | **Gemini Omni Flash** (Google Flow) | ~10 s abstract loops; conversational edits |
| Alt / pickup | Runway, Pika, or manual After Effects | Concepts Omni mishandles |
| Transcode | `scripts/transcode-video.sh` | MP4 H.264, no audio, ≤1.5 MB target |
| QA | In-app `IllustrateSlide` on device | Loop smooth, no artifacts, respects reduced motion |

Document prompts in `pipelines/prompts/videos/{concept-id}.md`.

### E.4 Video candidate list (proposed)

Align with `visual_content_strategy.md`:

| Concept | Priority | Rationale |
|---------|----------|-----------|
| Building | P0 | Temporal intensity |
| Spreading | P0 | Radiating motion (mp4 exists—review/regenerate) |
| Pulsing | P0 | Rhythm |
| Responsive Desire | P1 | Causality glow (exists—review) |
| Spontaneous Desire | P1 | Sudden onset |
| Embodied Presence | P2 | Slow grounded motion |
| Rocking | — | ✅ **Resolved:** Skia only; `rocking.mov` unwired (delete from repo after backup) |
| Spreading | P0 | 🟡 `spreading.mp4` wired (~1.6 MB); style review + dedicated illustration |

**Deprioritize video** for: Angling, Shallowing, Pairing, Plateauing, Warm-up Window, Golden Trio, Non-concordance (static/diagram).

**In repo (needs transcode to MP4):** `building.mov`, `responsive-desire.mov` (~5 MB each). **Unused:** `shallowing.mov` (remove).

### E.5 Pipeline steps (per video)

1. Write prompt from template + style bible motion section.
2. Generate 3 variants (different seeds).
3. Select; transcode to spec.
4. Test in Expo Go + one release build.
5. Add to manifest; wire `illustrationVideo` in correct slide only.
6. Delete unused originals from repo (store in cloud backup if needed).

### E.6 Engineering tasks

| Task | Detail | Status |
|------|--------|--------|
| Create `scripts/transcode-video.sh` | ffmpeg: scale 720, crf 28, strip audio | ✅ |
| Transcode `building.mov`, `responsive-desire.mov` | Update `vocabulary.ts` requires to `.mp4` | ✅ 256 KB / 503 KB |
| Remove unused videos | `rocking.mov`, `shallowing.mov`, `angling.mov` (deleted) | ✅ MOVs in `originals/` or removed |
| Standardize player | Consider migrating `expo-av` Video → `expo-video` | ✅ `IllustrateVideo.tsx` |
| `IllustrateSlide` | mp4 support; poster frame from illustration | ✅ |
| Reduced motion | Static fallback when reduce motion enabled | ✅ |

### E.7 Acceptance criteria

- [x] `VIDEO_GENERATION.md` complete with ffmpeg commands
- [x] Wired videos ≤ size budget (`spreading.mp4` 1.6 MB — optional re-transcode)
- [x] No `.mov` in app `assets/videos/` root (sources in `originals/`)
- [x] Every wired video row matches a `require()` in `vocabulary.ts`

---

## Workstream F — Engineering & Interaction Polish

Runs after or in parallel with media work.

### F.1 Media integration

| Task | Priority | Status |
|------|----------|--------|
| Wire `PairingDiagram` in `IllustrateSlide` | P0 | ✅ |
| Wire `spreading.mp4` or replace after regen | P0 | ✅ wired; regen/review in Phase 3 |
| Resolve rocking video vs Skia redundancy | P1 | ✅ Skia primary; video removed from vocabulary |
| `Pairing` in `DiagramType` union | P0 | ✅ (pre-existing) |
| `ConceptCard` uses thumbnail only (not illustrate asset) | P1 | ✅ |
| Poster frames for video loading | P1 | ✅ |

### F.2 Interaction backlog (from visual strategy)

| Concept | Format | Effort |
|---------|--------|--------|
| Edging | Interactive throttle | Medium |
| Spectatoring | Focus-pull metaphor | Medium |
| Plateauing | Static chart (image gen) | Low |
| Warm-up Window | Static infographic | Low |
| Golden Trio | Static infographic | Low |

Prioritize only if static/video pass doesn’t satisfy—avoid blocking ship on new interactives.

### F.3 Resonance feedback

- ✅ Lottie on status change (`ResonanceBurst` on Reflect slide; respects reduce motion)
- Subtle haptic on “Tried it” (optional)

### F.4 Share flow

- ✅ Review `share.tsx` copy and formatting; auto-select on load; preview block
- Test iOS + Android share sheet (manual QA)

### F.5 Performance

- Memoize profile pattern insights
- `expo-image` migration for thumbnails (optional)
- Bundle size report — **✅** `npm run bundle-report` → `docs/reports/BUNDLE_REPORT.md`

### F.6 Testing & CI

| Task | Target |
|------|--------|
| GitHub Action: `npm test` | Every PR |
| Snapshot tests for slide data shape | Optional |
| Manual QA script | `docs/QA_CHECKLIST.md` | ✅ |

### F.7 Ship infrastructure

- Add `eas.json` (development, preview, production)
- TestFlight internal group
- App Store metadata draft (sensitive category considerations)

---

## 3. Phased schedule

Phases overlap; dates are suggestive for a single focused contributor.

### Phase 0 — Reactivation (Week 1) ✅

| ID | Task | Workstream | Status |
|----|------|------------|--------|
| 0.1 | Triage uncommitted work; branch `visual-v2-restart` | A | ✅ `dfda4b7` |
| 0.2 | Run app on device; screenshot current state | C | ⬜ Manual QA |
| 0.3 | Create `docs/README.md` skeleton | B | ✅ |
| 0.4 | Generate `CONCEPT_AUDIT.md` rows from vocabulary | C | ✅ + `generate-concept-audit` script |
| 0.5 | Draft STYLE_BIBLE v0.1 from existing identity docs | A | ✅ |

**Exit:** ✅ Branch strategy clear; audit template exists; core docs and wiring in place.

**Also delivered (stretch):** `pipelines/*` docs, `transcode-video.sh`, refreshed thumbnails/illustrations subset, `PairingDiagram` + `spreading.mp4` wiring.

---

### Phase 1 — Foundation & decisions (Weeks 1–2) 🟡

| ID | Task | Workstream | Status |
|----|------|------------|--------|
| 1.1 | Ratify STYLE_BIBLE (reference renders) | A | 🟡 1/5 approved (non-concordance); angling rejected; 3 Gemini pending |
| 1.2 | Lock format per concept in audit sheet | C | ✅ `data/visual-formats.json` |
| 1.3 | Image tool pilot (5 concepts) | D | 🟡 1 promoted; angling regen; 3 Gemini pilots pending |
| 1.4 | Video tool pilot (2 concepts) | E | 🟡 Prompts ready; building review + pulsing gen → `wire-concept-video` |
| 1.5 | Consolidate docs into target structure (partial) | B | ✅ `PROMPT_INDEX.md`, 22 illustration prompts; Veo JSON migrate optional |
| 1.6 | Fix orphan wiring (Pairing, spreading) | F | ✅ |

**Exit:** Tool choices documented; prompts template ready; no orphan components.

---

### Phase 2 — Content & copy (Weeks 2–3) ✅

| ID | Task | Workstream | Status |
|----|------|------------|--------|
| 2.1 | Editorial pass all 22 definitions + slides | C | ✅ May 19 — `data/copy-review.json` + slide copy in `vocabulary.ts` |
| 2.2 | Update `visual_content_strategy.md` to match decisions | B | ✅ Aligned with `visual-formats.json` (Phase 1.2) |
| 2.3 | Revise illustration prompts per concept | D | ✅ `npm run enrich-illustration-prompts` — 22/22 deck-aligned `.md` files |
| 2.4 | Revise video prompts (candidates only) | E | ✅ `building.md`, `pulsing.md` — 3 Omni starter variants + pipeline steps each |

**Exit:** ✅ Copy and prompts ready; full image batch can start without copy rework.

---

### Phase 3 — Asset production (Weeks 3–6) ⏸ Postponed

**Paused** until engineering track (§8b) completes or generation capacity returns. Resume with Phase 1 pilots (1.1, 1.3, 1.4) then batch below.

| ID | Task | Workstream | Status |
|----|------|------------|--------|
| 3.0 | Complete pilots: 1.1 reference renders, 1.3 image pilot, 1.4 video pilot | A, D, E | ⏸ |
| 3.1 | Image batch: Techniques → Sensations → Timing → Psych → Anatomy | D | ⏸ |
| 3.2 | Thumbnail batch (derived from plates or ChatGPT Images 2) | D | ⏸ |
| 3.3 | Pathway + explainer + UI shell images | D | ⏸ |
| 3.4 | Video batch per candidate list | E | ⏸ |
| 3.5 | Transcode + compress | D, E | ⏸ |
| 3.6 | Update ASSET_MANIFEST after each batch | B | ⏸ |

**Exit:** Manifest 100%; all requires resolve; re-run QA delta only on changed concepts.

**Blocked items (do not schedule on engineering track):** style bible ratification renders, angling regen, 3 Gemini pilots, building/pulsing Veo gen, full illustration/thumbnail regen, shell image regen.

---

### Phase 4 — Integration & polish (Weeks 6–8) 🟡

Asset-independent items run **now** via §8b. Shell image regen stays in Phase 3.

| ID | Task | Workstream | Status |
|----|------|------------|--------|
| 4.1 | UI pass: typography, Deck chrome, Profile, Onboarding | A, F | 🟡 Deck typography ✅; IllustrateSlide, ConceptCard, profile, onboarding ✅ |
| 4.2 | Concept QA on device (category by category) | C | 🟡 §8b Batch 1 |
| 4.3 | Share flow polish | F | 🟡 Auto-select + copy refresh; device smoke test ☐ |
| 4.4 | Lottie on resonance (+ reduced motion already ✅) | F | ✅ `ResonanceBurst` on Reflect slide |
| 4.5 | Performance pass | F | 🟡 Profile memoization ✅; bundle report ☐ |
| 4.6 | CI + EAS setup | F | 🟡 CI ✅; EAS `eas.json` ✅; preview build ☐ |

**Exit:** QA checklist green on **current** assets; CI green; preview build installable. Final visual QA after Phase 3.

---

### Phase 5 — Release candidate (Weeks 8–10)

| ID | Task | Workstream |
|----|------|------------|
| 5.1 | External tester round (3–5 users) | C |
| 5.2 | Fix P0/P1 feedback | All |
| 5.3 | Update PROJECT_STATUS_REPORT | B |
| 5.4 | TestFlight build + install guide | F |
| 5.5 | Archive stale docs; final README | B |

**Exit:** TestFlight live; status report marks RC.

---

## 4. Asset manifest schema

Maintain `docs/pipelines/ASSET_MANIFEST.md` (or JSON in `assets/manifest.json` for scripting):

```yaml
# Example entry
- concept_id: spreading
  thumbnail:
    path: assets/images/concepts/thumbnails/spreading.png
    generator: chatgpt-images-2
    prompt_ref: pipelines/prompts/illustrations/spreading-thumb.md
    status: approved
  illustration:
    path: assets/images/concepts/illustrations/spreading.png
    generator: nano-banana-pro-2
    status: approved
  rich_media:
    type: video
    path: assets/videos/spreading.mp4
    generator: veo-3.1
    duration_sec: 10
    bytes: 1200000
    wired: data/vocabulary.ts#slides[illustrate]
    status: approved
```

Optional: `scripts/validate-manifest.js` fails CI if manifest ≠ filesystem ≠ requires.

---

## 5. Roles and rituals

| Ritual | Frequency | Purpose |
|--------|-----------|---------|
| **Review board** | After each batch of 4–5 assets | Side-by-side in app; approve/reject |
| **Manifest update** | Same day as asset commit | Prevent unwired files |
| **Audit sheet update** | When copy or asset changes | Single concept truth |
| **Status report** | End of phase | Stakeholder sync |

---

## 6. Out of scope (v1.0)

Explicitly defer to avoid blocking polish:

- Spaced repetition
- Global search
- Premium tiers / paywall
- Partner mode (shared accounts)
- Multi-device sync
- Full interactive suite (Edging, Spectatoring) unless time permits in Phase 4
- Android-specific tablet layout polish
- Localization

---

## 7. Success metrics (post-RC)

| Metric | Target |
|--------|--------|
| Concept completion rate | ≥ 40% of opened concepts reach Reflect |
| Deck Illustrate engagement | ≥ 15s median on slide 3 |
| Resonance marking | ≥ 25% of completions set non-default status |
| Share initiated | ≥ 5% of profile visits (if promoted) |
| Crash-free sessions | ≥ 99.5% |

Instrumentation can be Phase 5+ (analytics hook in repositories).

---

## 8. Immediate next steps

### 8a. Asset track ⏸ (resume when generation restarts)

1. **Ratify** STYLE_BIBLE reference renders — **1/5** approved (non-concordance ✅); angling **regen**; Gemini for spreading, warmup-window, clitoral-structure → [`GEMINI_CLINICAL_PROMPTS.md`](./pipelines/prompts/GEMINI_CLINICAL_PROMPTS.md) → `pilot/{id}-gemini.png` → `npm run pilot-review` → `npm run swap-pilot-winner`.
2. **5-concept image pilot** — complete angling + 3 Gemini pilots; promote winners.
3. **2-concept video pilot** — Veo variants for building/pulsing → transcode → `npm run wire-concept-video`.
4. **Phase 3 batches** — illustrations → thumbnails → shell assets → videos → compress → manifest (see §3 Phase 3).
5. **Delta QA** — re-walk only concepts whose assets changed; update `ASSET_MANIFEST.md` same day as commit.

---

### 8b. Engineering track (active — no new assets required)

Run in order; each batch has a clear exit before starting the next.

#### Batch 1 — Verify & close the content loop (~1–2 days)

| # | Task | Deliverable |
|---|------|-------------|
| 1 | Device QA all 22 concepts | [`QA_CHECKLIST.md`](./QA_CHECKLIST.md); category order Techniques → Anatomy |
| 2 | Tick `qa_passed` + `copy_reviewed` | `data/qa-passed.json` → audit regen — **copy ✅ citations ✅** (22/22); qa ☐ pending device |
| 3 | Citations pass (`citations_ok`) | Understand slides + `researchBasis` — **automated in `generate-concept-audit.js`** |
| 4 | Share smoke test | iOS + one Android (QA checklist § Share) |

**Exit:** Audit columns honest for copy/citations; device QA + share smoke still required.

#### Batch 2 — Ship path & automation (~1 day)

| # | Task | Deliverable |
|---|------|-------------|
| 1 | Add `eas.json` | development, preview, production profiles — **✅** |
| 2 | Preview build | Install on device; re-spot-check Batch 1 if needed — **run `eas build --profile preview`** |
| 3 | Confirm CI green | `test` + `validate-manifest` on branch — **✅** |
| 4 | App Store metadata draft | Sensitive-category wording — **✅** [`app-store-metadata.md`](./product/app-store-metadata.md) |

#### Batch 3 — UI shell polish (~2–3 days)

| # | Task | Files |
|---|------|-------|
| 1 | Typography scale consistency | `components/ui/Typography.tsx`, deck slides — **✅** `deckPrompt` / `deckLead` tokens |
| 2 | Illustrate slide chrome | `IllustrateSlide.tsx`, `IllustrateVideo.tsx` — **✅** conceptCanvas, mute, expo-video |
| 3 | Profile Atelier refresh | `app/(tabs)/profile.tsx` — **✅** thumbnails on shelf, memoized resonates |
| 4 | Onboarding visual pass | `app/onboarding/*` — **✅** welcome gradient tokens |
| 5 | ConceptCard thumbnail framing | `ConceptCard.tsx` — **✅** canvas frame + border |

**Defer to Phase 3:** `slide-*.png`, pathway/explainer hero regen.

**Exit:** Shell matches STYLE_BIBLE tokens; deck readable on small phones.

#### Batch 4 — Interaction & media code (~2 days)

| # | Task | Notes |
|---|------|-------|
| 1 | Lottie on resonance status change | F.3 — **✅** `ResonanceBurst` + `resonance-burst.json` |
| 2 | Share flow polish | Copy, formatting, optional preview — **✅** auto-select + copy refresh |
| 3 | `expo-av` → `expo-video` | E.6 — **✅**; removed `expo-av` dep |
| 4 | Memoize profile pattern insights | F.5 — **✅** |
| 5 | Bundle size report | F.5 — **✅** `bundle-report.js` |
| 6 | QA batch helper | Batch 1 — **✅** `mark-qa-batch.js` |
| 7 | *(Optional)* Edging / Spectatoring Skia | F.2 — only if time; not blocking RC |

**Exit:** App feels finished on **current** media; no Veo/Nano required.

#### Batch 5 — Plan hygiene (~half day)

| # | Task |
|---|------|
| 1 | Sync `PROJECT_STATUS_REPORT.md` with phase table |
| 2 | Optional: merge `veo3.1_best_practices.md` into `pipelines/VIDEO_GENERATION.md` |

**Exit:** Docs match branch reality when §8a resumes.

#### Suggested calendar (asset pause)

```
Days 1–2   Batch 1 — Device QA + citations + share
Day 3      Batch 2 — EAS + preview build
Days 4–6   Batch 3 — UI shell
Days 7–8   Batch 4 — Lottie, share, expo-video, perf
Day 9      Batch 5 — Status report sync
           ─── resume §8a asset track ───
```

---

### Completed (reference)

**Phase 0:** branch + commit, docs index, concept audit, style bible v0.1, Pairing/spreading wiring, rocking → Skia-only.

**Phase 1 engineering:** MP4 transcode, pathway gaps, format lock, theme tokens, validate-manifest, IllustrateSlide poster + reduce motion, compress pass, QA checklist, CI.

**Phase 2:** copy pass, 22 illustration prompts, building/pulsing video prompts.

---

## 9. Document map (after consolidation)

| Question | Go to |
|----------|-------|
| Where are we? | `PROJECT_STATUS_REPORT.md` |
| What’s the plan? | `IMPLEMENTATION_PLAN.md` (this file) |
| What can I do without new assets? | §8b Engineering track (this file) |
| When do assets resume? | §8a Asset track (this file) |
| What should it look like? | `design/STYLE_BIBLE.md` |
| What does each concept need? | `content/CONCEPT_AUDIT.md` |
| How do I generate images? | `pipelines/IMAGE_GENERATION.md` |
| How do I generate videos? | `pipelines/VIDEO_GENERATION.md` |
| What files exist? | `pipelines/ASSET_MANIFEST.md` |
| How does the backend work? | `architecture/backend.md` |

---

## 10. Changelog

| Date | Change |
|------|--------|
| May 19, 2026 | Initial plan |
| May 19, 2026 | Phase 0 marked complete; Phase 1 progress, workstream status tables, updated next steps (`dfda4b7`) |
| May 19, 2026 | Phase 1 engineering: MP4 transcode, pathway gaps, pilot prompts, doc consolidation |
| May 19, 2026 | Phase 1: format lock, theme token audit, video pilot prompts, validate-manifest, IllustrateSlide reduced motion + poster |
| May 19, 2026 | Phase 1: recursive compress-assets (~54 MB saved), manifest size budgets, `QA_CHECKLIST.md` |
| May 19, 2026 | Phase 1: migrate 22 illustration prompts, `PROMPT_INDEX.md`, pilot folder + `pilot-review`, GitHub CI (test + validate-manifest) |
| May 19, 2026 | Phase 2.1: editorial pass all 22 concepts (`vocabulary.ts` slides); `data/copy-review.json` |
| May 19, 2026 | Phase 2.3–2.4: enrich 22 illustration prompts; revise building/pulsing video prompts; `swap-pilot-winner` + `enrich-illustration-prompts` scripts |
| May 19, 2026 | Phase 1.3: non-concordance pilot promoted; angling pilot rejected (text); angling prompt regen; `wire-concept-video` script |
| May 19, 2026 | §8b Batches 2–4 engineering: `eas.json`, citations audit column, IllustrateVideo (expo-video), Lottie resonance, share/profile/ConceptCard polish |
| May 20, 2026 | §8b Batch 3: deck typography tokens (`deckPrompt`, `deckLead`); `data/qa-passed.json` + audit script hook for device QA |
| May 20, 2026 | `bundle-report`, `mark-qa-batch` scripts; share/onboarding polish; `docs/reports/BUNDLE_REPORT.md` |

---

*This plan is a living document. Update phase status here at each phase boundary; sync narrative in `PROJECT_STATUS_REPORT.md`.*
