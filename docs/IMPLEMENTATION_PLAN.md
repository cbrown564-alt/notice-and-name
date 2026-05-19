# Implementation Plan: Baseline → Polished Product

**Created:** May 19, 2026  
**Companion:** [`PROJECT_STATUS_REPORT.md`](./PROJECT_STATUS_REPORT.md)  
**Horizon:** Multi-phase (estimate 6–10 weeks focused effort, adjustable)

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

### A.2 Identity pillars (proposed — to ratify)

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
| Token audit vs `theme.ts` | `constants/theme.ts`, `constants/Colors.ts` |
| Typography scale consistency | `components/ui/Typography.tsx` |
| Card / deck slide backgrounds | `assets/images/ui/slide-*.png` → regenerate or CSS |
| ConceptCard thumbnail framing | `components/ConceptCard.tsx` |
| Illustrate slide layout (caption, mute, diagram chrome) | `IllustrateSlide.tsx` |
| Profile Atelier refresh | `app/(tabs)/profile.tsx` |
| Onboarding visual pass | `app/onboarding/*` |

### A.5 Acceptance criteria

- [ ] Style bible signed off with 5 reference renders (one per category family)
- [ ] Figma or pinned reference folder optional but recommended
- [ ] No asset committed without checklist sign-off against bible
- [ ] Dark mode decision: explicit in or out of scope for v1.0

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

| Action | Source files |
|--------|----------------|
| **Archive** | `GAP_ANALYSIS.md` → superseded by status report |
| **Archive** | `PHASE_3_UI_UX_REVAMP.md` → historical banner only |
| **Merge** | Identity trio → `design/STYLE_BIBLE.md` |
| **Merge** | `asset_generation_prompts.md` + tool notes → `pipelines/IMAGE_GENERATION.md` |
| **Merge** | `veo3.1_best_practices.md`, `video_interactive_prompts.md`, `animation_journey.md` → `pipelines/VIDEO_GENERATION.md` |
| **Refresh** | `asset_inventory.md` → `pipelines/ASSET_MANIFEST.md` (generated or hand-maintained) |
| **Trim** | Remove completed TODOs from `backend-refactor-complete.md` |
| **Link** | Root `README.md` → `docs/README.md` |

### B.3 Living documents

| Doc | Update trigger |
|-----|----------------|
| `PROJECT_STATUS_REPORT.md` | End of each phase |
| `pipelines/ASSET_MANIFEST.md` | Every asset batch merge |
| `content/CONCEPT_AUDIT.md` | Any vocabulary or slide change |

### B.4 Acceptance criteria

- [ ] `docs/README.md` lists every active doc with one-line purpose
- [ ] No open P0 task references a deleted or archived file as sole source
- [ ] README in repo root points to design bible + manifest

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

1. **Inventory** — auto-generate rows from `vocabulary.ts` (script optional).
2. **Format assignment** — lock ideal format per concept (`visual_content_strategy.md`).
3. **Copy pass** — editorial read of all 22.
4. **Asset pass** — fill manifest columns (depends on D + E).
5. **QA pass** — device walkthrough per category batch.

### C.5 Acceptance criteria

- [ ] 22/22 rows complete with no “placeholder” status
- [ ] Zero broken `require()` paths
- [ ] Related concept graph has no dangling ids

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
| Generation | **Veo 3.1** (or successor) | Short abstract loops |
| Alt / pickup | Runway, Pika, or manual After Effects | Concepts Veo mishandles |
| Transcode | `ffmpeg` script in `scripts/transcode-video.sh` (to create) | MP4 H.264, no audio or optional muted |
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
| Rocking | **Review** | Skia may suffice; deprecate video if redundant |
| Building | P1 | Exists—review against new style |

**Deprioritize video** for: Angling, Shallowing, Pairing, Plateauing, Warm-up Window, Golden Trio, Non-concordance (static/diagram).

### E.5 Pipeline steps (per video)

1. Write prompt from template + style bible motion section.
2. Generate 3 variants (different seeds).
3. Select; transcode to spec.
4. Test in Expo Go + one release build.
5. Add to manifest; wire `illustrationVideo` in correct slide only.
6. Delete unused originals from repo (store in cloud backup if needed).

### E.6 Engineering tasks

| Task | Detail |
|------|--------|
| Create `scripts/transcode-video.sh` | ffmpeg: scale 720, crf 28, strip audio optional |
| Standardize player | Consider migrating `expo-av` Video → `expo-video` (already in plugins) |
| `IllustrateSlide` | Support mp4 only; poster frame from thumbnail |
| Reduced motion | Show static illustration when `AccessibilityInfo.isReduceMotionEnabled` |

### E.7 Acceptance criteria

- [ ] `VIDEO_GENERATION.md` complete with ffmpeg commands
- [ ] All video concepts ≤ size budget
- [ ] No `.mov` in committed `assets/videos/`
- [ ] Every video row in manifest matches a `require()` in `vocabulary.ts`

---

## Workstream F — Engineering & Interaction Polish

Runs after or in parallel with media work.

### F.1 Media integration

| Task | Priority |
|------|----------|
| Wire `PairingDiagram` in `IllustrateSlide` | P0 |
| Wire `spreading.mp4` or replace after regen | P0 |
| Resolve rocking video vs Skia redundancy | P1 |
| Add `Pairing` to `DiagramType` union if needed | P0 |
| Poster frames for video loading | P1 |

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

- Implement Lottie on status change (dependency already installed)
- Subtle haptic on “Tried it” (optional)

### F.4 Share flow

- Review `share.tsx` copy and formatting
- Add preview before share
- Test iOS + Android share sheet

### F.5 Performance

- Memoize profile pattern insights
- `expo-image` migration for thumbnails (optional)
- Bundle size report after asset batch

### F.6 Testing & CI

| Task | Target |
|------|--------|
| GitHub Action: `npm test` | Every PR |
| Snapshot tests for slide data shape | Optional |
| Manual QA script | `docs/QA_CHECKLIST.md` |

### F.7 Ship infrastructure

- Add `eas.json` (development, preview, production)
- TestFlight internal group
- App Store metadata draft (sensitive category considerations)

---

## 3. Phased schedule

Phases overlap; dates are suggestive for a single focused contributor.

### Phase 0 — Reactivation (Week 1)

| ID | Task | Workstream |
|----|------|------------|
| 0.1 | Triage uncommitted work; branch `visual-v2-restart` | A |
| 0.2 | Run app on device; screenshot current state | C |
| 0.3 | Create `docs/README.md` skeleton | B |
| 0.4 | Generate `CONCEPT_AUDIT.md` rows from vocabulary | C |
| 0.5 | Draft STYLE_BIBLE v0.1 from existing identity docs | A |

**Exit:** Branch strategy clear; audit template exists; app runs.

---

### Phase 1 — Foundation & decisions (Weeks 1–2)

| ID | Task | Workstream |
|----|------|------------|
| 1.1 | Ratify STYLE_BIBLE (reference renders) | A |
| 1.2 | Lock format per concept in audit sheet | C |
| 1.3 | Image tool pilot (5 concepts) | D |
| 1.4 | Video tool pilot (2 concepts) | E |
| 1.5 | Consolidate docs into target structure (partial) | B |
| 1.6 | Fix orphan wiring (Pairing, spreading) | F |

**Exit:** Tool choices documented; prompts template ready; no orphan components.

---

### Phase 2 — Content & copy (Weeks 2–3)

| ID | Task | Workstream |
|----|------|------------|
| 2.1 | Editorial pass all 22 definitions + slides | C |
| 2.2 | Update `visual_content_strategy.md` to match decisions | B |
| 2.3 | Revise illustration prompts per concept | D |
| 2.4 | Revise video prompts (candidates only) | E |

**Exit:** Copy signed off before full image batch (avoids rework).

---

### Phase 3 — Asset production (Weeks 3–6)

| ID | Task | Workstream |
|----|------|------------|
| 3.1 | Image batch: Techniques → Sensations → Timing → Psych → Anatomy | D |
| 3.2 | Thumbnail batch (derived from plates or ChatGPT Images 2) | D |
| 3.3 | Pathway + explainer + UI shell images | D |
| 3.4 | Video batch per candidate list | E |
| 3.5 | Transcode + compress | D, E |
| 3.6 | Update ASSET_MANIFEST after each batch | B |

**Exit:** Manifest 100%; all requires resolve.

---

### Phase 4 — Integration & polish (Weeks 6–8)

| ID | Task | Workstream |
|----|------|------------|
| 4.1 | UI pass: Home, Library, Deck, Profile, Onboarding | A, F |
| 4.2 | Concept QA on device (category by category) | C |
| 4.3 | Share flow polish | F |
| 4.4 | Lottie + reduced motion | F |
| 4.5 | Performance pass | F |
| 4.6 | CI + EAS setup | F |

**Exit:** QA checklist green; CI green.

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

## 8. Immediate next steps (this week)

1. Read and approve direction in **Workstream A** identity pillars.
2. Commit uncommitted January–May work to `visual-v2-restart` or merge selectively.
3. Create `docs/content/CONCEPT_AUDIT.md` from vocabulary export.
4. Run **5-concept image pilot** (Nano Banana Pro 2 vs ChatGPT Images 2).
5. Run **2-concept video pilot** with transcode script.
6. Wire `PairingDiagram` + decide rocking video fate.
7. Add `docs/README.md` index (Phase 0.3).

---

## 9. Document map (after consolidation)

| Question | Go to |
|----------|-------|
| Where are we? | `PROJECT_STATUS_REPORT.md` |
| What’s the plan? | `IMPLEMENTATION_PLAN.md` (this file) |
| What should it look like? | `design/STYLE_BIBLE.md` |
| What does each concept need? | `content/CONCEPT_AUDIT.md` |
| How do I generate images? | `pipelines/IMAGE_GENERATION.md` |
| How do I generate videos? | `pipelines/VIDEO_GENERATION.md` |
| What files exist? | `pipelines/ASSET_MANIFEST.md` |
| How does the backend work? | `architecture/backend.md` |

---

*This plan is a living document. Update phase status in `PROJECT_STATUS_REPORT.md` at each phase boundary.*
