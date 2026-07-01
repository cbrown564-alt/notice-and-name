# Interactive Diagrams — Phased Generation Plan

**Status:** Ready to execute (shift focus from static media regen)  
**Why now:** Technique plates are acceptable but uninspiring; **explorable explanations** are the product differentiator (`animation_journey.md`, UI review § Skia diagrams).  
**Platforms:** iOS native — SwiftUI `Canvas` in `ConceptDiagrams.swift`  
**Style:** Native diagram palette in `ios/Sources/PleasureVocabularyApp/Theme/` · plates remain reduce-motion posters only

---

## 1. Current state

| Concept | RN (`components/diagrams/`) | iOS (`ConceptDiagrams.swift`) | Interaction |
|---------|----------------------------|-------------------------------|-------------|
| Angling | ✅ `AnglingDiagram.tsx` | ✅ auto-loop tilt | **Pan** — drag pelvis, glow at posterior tuck |
| Rocking | ✅ `RockingDiagram.tsx` | ✅ auto-loop approach | **Pan** — partner wedge proximity heat |
| Shallowing | ✅ `ShallowingDiagram.tsx` | ✅ auto-loop probe | **Pan** — depth vs entrance intensity |
| Pairing | ✅ `PairingDiagram.tsx` | ✅ auto-loop pulse | **Tap** — external + internal nodes, bridge glow |
| Edging | ✅ `EdgingDiagram.tsx` | ✅ vertical throttle | **Pan** — drag intensity up; release recedes |
| All others | static / video on Illustrate | illustration or video | — |

**Gaps today**

1. **Parity:** RN diagrams are **user-driven**; iOS diagrams are **passive loops** — same metaphor, different pedagogy.
2. **Palette drift:** Some RN diagrams still use legacy hard-coded colors; iOS uses `AppColor.*`.
3. **`DiagramType` placeholders** in `types/index.ts` (`iceberg`, `nerve-density`, `cuv-complex`, `warmup-window`) are **not wired** in `IllustrateSlide.tsx`.
4. **Poster plates** for technique concepts should harmonize with diagram tokens but are not the teach moment — the diagram is.

---

## 2. Design principles (all new diagrams)

Borrow from completed prototypes (`docs/_archive/animation_journey.md` § III):

| Rule | Implementation |
|------|----------------|
| **Engine** | Skia (RN) · SwiftUI Canvas (iOS) |
| **Canvas** | `conceptCanvas` `#F9F5F1`, 1px `neutral[200]` border, ~300pt height |
| **Strokes** | `diagram.passive` `#DCD8D3` anatomy · `diagram.active` `#E8603C` user/touch |
| **Glow** | `diagram.glow` `#FFC5B5` via blur layer — sensation only |
| **Mind split** | `diagram.detachment` `#7A7AFF` sparingly (spectatoring, non-concordance) |
| **Feedback** | Short label overlay (“Posterior tilt”, “Paired”) — lives in **UI chrome**, not in-image |
| **Reduce Motion** | Static “teaching frame” (sweet-spot pose), not auto-loop |
| **Caption** | Deck `illustrationCaption` below diagram — never burn text into canvas |
| **Mechanic** | One variable, one insight — user should learn in &lt;30s of play |

**Do not build:** multi-step tutorials, explicit anatomy realism, gamified scoring, or diagrams that duplicate video loops without adding manipulation.

---

## 3. Phased rollout

```mermaid
flowchart LR
  P0[Phase 0\nKit + polish 4] --> P1[Phase 1\nEdging]
  P1 --> P2[Phase 2\nAnatomy explorers]
  P2 --> P3[Phase 3\nSensation labs]
  P3 --> P4[Phase 4\nTiming + mind]
```

### Phase 0 — Diagram kit & polish existing four ✅

**Goal:** One shared foundation before new concepts.  
**Status:** Complete (RN `DiagramFrame` + iOS touch parity, token audit, haptics, QA rows)  
**Exit:** All four techniques pass device QA on Illustrate slide (RN + iOS).

**Interaction parity:** **Option A** — iOS uses pan/tap gestures matching RN (auto-loops removed when motion enabled). Reduce Motion shows static teaching frames on both platforms.

| Task | Deliverable |
|------|-------------|
| Extract `DiagramFrame` | ✅ `components/diagrams/DiagramFrame.tsx` — canvas, border, height, reduce-motion hook |
| Token audit | ✅ All paths use `colors.diagram.*` / `AppColor.diagram*` equivalents |
| Interaction parity decision | ✅ Option A — iOS touch where RN has gestures |
| Haptics | ✅ Light impact on angling sweet spot + pairing complete |
| Accessibility | ✅ `accessibilityLabel` from `illustrationCaption`; state changes announced sparingly |
| QA script | ✅ Diagram rows in `docs/QA_CHECKLIST.md` |

**No new concepts.** Polish only.

---

### Phase 1 — Edging (format-locked interactive) ✅

**Goal:** First new diagram; validates the pipeline end-to-end.  
**Status:** Shipped — RN + iOS wired, bundle regenerated  
**Concept:** `edging` · caption: *Intensity rising toward a threshold, then receding*

| Spec | Detail |
|------|--------|
| **Mechanic** | Vertical **throttle** — drag intensity up toward a coral threshold line; release drags back down (approach & retreat cycle) |
| **Visual** | Rising fill / wave height + glow; red-line = high arousal zone (coral, not alarm red); retreat fades glow |
| **Insight** | “Hovering near the edge then backing off” — tachometer metaphor without numeric labels |
| **Reduce motion** | Frozen frame at ~80% threshold with caption context |

**Engineering**

1. `EdgingDiagram.tsx` (Skia + `Gesture.Pan` or vertical slider)  
2. `EdgingDiagramView` in `ConceptDiagrams.swift`  
3. `diagramType: 'edging'` in `vocabulary.ts` + `DiagramType` union  
4. Wire `IllustrateSlide.tsx` + iOS media routing (`native://diagram/edging`)  
5. Update `data/visual-formats.json`: `edging` → `interactive`  
6. Illustration plate remains static fallback for reduce-motion if diagram disabled

**Prompt / spec file:** `docs/pipelines/prompts/diagrams/edging.md` (interaction spec, not image gen)

---

### Phase 2 — Anatomy explorers

**Goal:** Replace uninspiring static anatomy plates with **layered exploration** on Illustrate.  
**Duration:** ~2 weeks  
**Priority order:** clitoral-structure → nerve-density → clitourethrovaginal → internal-stimulation

| Concept | `diagramType` | Mechanic | Teaches |
|---------|-------------|----------|---------|
| **Clitoral Structure** | `iceberg` | **Peel layers:** tap/slide to reveal external glans → bulbs → crura (iceberg cross-section) | Hidden 9cm structure |
| **Nerve Density** | `nerve-density` | **Density dial:** pinch or slider zooms into glans; nerve filaments multiply / brighten | 8k endings in small area |
| **CUV Complex** | `cuv-complex` | **Pressure triad:** three toggles (clitoral / urethral / anterior wall); overlap glow at shared zone | Integrated cluster, not a magic spot |
| **Internal Stimulation** | `internal-stimulation` | **Angle slider:** same pelvis metaphor as angling but focus on anterior-wall contact path | Front-wall ≠ deep |

**Notes**

- Plates + thumbs remain library/reduce-motion assets; diagrams are primary on Illustrate.  
- Consider **deferring** anatomy Omni videos for these four once diagrams ship (video = optional enhancement, not blocker).  
- Reuse angling pelvis math for internal-stimulation where possible.

**Exit:** Four anatomy Illustrate slides feel “alive”; `validate-manifest` updated for `diagramType` wiring.

---

### Phase 3 — Sensation labs

**Goal:** Manipulation beats passive loops for temporal/rhythm concepts.  
**Duration:** ~2 weeks  
**Order:** building → edging already done → plateauing → pulsing → spreading

| Concept | Mechanic | Relationship to video |
|---------|----------|----------------------|
| **Building** | **Hold to charge** — long-press fills reservoir; release leaks slightly | Video loop remains; diagram for engage mode |
| **Plateauing** | **Ridge walk** — drag dot along rising curve onto flat plateau; stays level until user changes | Replaces need for process-explainer video |
| **Pulsing** | **Rhythm tap** — tap in sync with 0.8s pulse rings; rings expand on beat | Video optional; diagram teaches frequency |
| **Spreading** | **Ripple tap** — tap origin, watch rings travel through nerve tree | Keep `spreading.mp4` as reduce-motion / ambient |

**Skip as interactive:** none required in Phase 3 beyond this list.

---

### Phase 4 — Timing & psychological pairs

**Goal:** Mind/body and time concepts users “feel” rather than read.  
**Duration:** ~2 weeks  
**Order:** warmup-window → responsive-desire + spontaneous-desire → spectatoring + embodied-presence → non-concordance

| Concept | Mechanic | Pairing |
|---------|----------|---------|
| **Warm-up Window** | **Slow cooker** — fast drags fill nothing; slow sustained drag fills engorgement bar | `warmup-window` already in `DiagramType` |
| **Responsive Desire** | **Ember rub** — dormant coal; only glows after sustained circular “context” gesture | Contrast ↓ |
| **Spontaneous Desire** | **Wellspring** — bubbles rise on timer without user touch | Contrast ↑ |
| **Spectatoring** | **Focus misalign** — ghost orb off-center; user drags to align with body (cool `#7A7AFF`) | Opposite ↓ |
| **Embodied Presence** | **Fill outline** — drag warmth into body silhouette until fully saturated | Opposite ↑ |
| **Non-concordance** | **Dual meter** — two bars (genital response vs felt desire); sliders uncorrelated | Static plate backup |

**Defer:** golden-trio (three-channel builder = high effort, low unique insight), sexual-self-esteem, body-appreciation (static OK).

---

## 4. Per-diagram delivery checklist

For each new interactive concept:

```
docs/pipelines/prompts/diagrams/{id}.md   ← interaction spec (mechanic, states, a11y)
components/diagrams/{Id}Diagram.tsx       ← RN implementation
ios/.../ConceptDiagrams.swift      ← {Id}DiagramView
types/index.ts                            ← DiagramType union
data/vocabulary.ts                        ← diagramType field
data/visual-formats.json                  ← format: interactive
IllustrateSlide.tsx                       ← switch case
docs/QA_CHECKLIST.md                      ← device test rows
```

**Spec template** (`prompts/diagrams/{id}.md`):

```markdown
# {id} — Interactive diagram

**Caption:** {from vocabulary illustrate slide}
**Category:** {family}
**Mechanic:** {one sentence}
**States:** {idle → … → insight}
**Reduce motion:** {static frame description}
**Tokens:** passive / active / glow / detachment
**Do not:** {explicit content, in-canvas text, …}
```

---

## 5. Recommended execution order (sprints)

| Sprint | Ship | Rationale |
|--------|------|-----------|
| **S0** | Phase 0 polish | Cheap quality lift on existing wow-factor |
| **S1** | Edging | Format-locked; proves pipeline |
| **S2** | Clitoral Structure + Nerve Density | Anatomy is where static plates disappoint most |
| **S3** | CUV + Internal Stimulation | Completes anatomy family |
| **S4** | Building + Plateauing | Sensation pair, distinct mechanics |
| **S5** | Pulsing + Spreading | Rhythm + propagation |
| **S6** | Warm-up Window | Timing flagship |
| **S7** | Responsive + Spontaneous desire pair | Teaches contrast |
| **S8** | Spectatoring + Embodied Presence pair | Psychological flagship |
| **S9** | Non-concordance | Dual-meter capstone |

**Pause Batch B plate regen** at current acceptable state; resume only for concepts that **stay static** after their diagram ships.

---

## 6. Success criteria

| Metric | Target |
|--------|--------|
| Illustrate slide median time | ≥15s on interactive concepts (UI review metric) |
| Mechanic comprehension | User can describe concept in own words after 20s play (qualitative QA) |
| Reduce motion | Every interactive has meaningful static frame |
| Parity | RN + iOS teach same insight (interaction method may differ) |
| Style | Diagram tokens match Style Bible §4; no palette drift vs plates |

---

## 7. Explicit non-goals

- Replace technique Skia with video (locked in `VIDEO_CONCEPT_CATALOG.md`)
- Full 22/22 interactive coverage — ~14 interactives max in this plan
- 3D, Rive, or Lottie diagrams (Skia/Canvas only)
- In-diagram labels, numbers, or citation text
- Blocking ship on golden-trio builder or communication-toolkit interactives

---

## 8. Immediate next steps

1. ~~**Phase 0 kickoff** — diagram kit extraction + token audit on four existing components~~ ✅
2. **Write** `docs/pipelines/prompts/diagrams/edging.md` using § Phase 1 spec  
3. ~~**Decide iOS parity** — touch on iOS vs demo loop (recommend touch for Edging onward)~~ ✅ Option A
4. **Device QA** — run Phase 0 diagram rows in `docs/QA_CHECKLIST.md` on iOS + Android
5. **Pause** Batch B image regen except static-only concepts  

---

*Related: `docs/_archive/animation_journey.md` · `docs/product/visual_content_strategy.md` · `components/diagrams/*` · `ios/.../ConceptDiagrams.swift`*
