# Interactive diagrams — living plan

**Status:** **22/22 ship** — S4 done (Golden Trio + Sexual Self-Esteem + Body Appreciation; S3 Timing/mind + S2 Sensation + S1 Anatomy + S0 Technique done)  
**Owner:** Sensory Success  
**Code:** `ios/Sources/PleasureVocabularyApp/ConceptDiagrams.swift`  
**Product home:** See page (priority: native diagram → video → illustration → placeholder)  
**Archived sketch:** `docs/_archive/2026-08-11-pre-reset/pipelines/INTERACTIVE_DIAGRAMS_PLAN.md`

Conor wants a diagram for **every concept (22/22)**. Approach locked: polish the existing five to a high bar, then expand. No approach picker.

---

## 1. Current state

| Concept | Mechanic | Status |
|---------|----------|--------|
| Angling | Pan — pelvis tilt, glow at posterior tuck | **ship** (S0 polish) |
| Rocking | Pan — partner wedge → pubic contact heat | **ship** (S0 polish) |
| Shallowing | Pan — depth vs entrance intensity | **ship** (S0 polish) |
| Pairing | Tap — external + internal nodes, bridge glow | **ship** (S0 polish) |
| Edging | Pan — intensity throttle; release recedes | **ship** (S0 polish) |
| Clitoral Structure | Tap/drag — iceberg peel glans→bulbs→crura | **ship** (S1) |
| Nerve Density | Pan — zoom densifies filaments | **ship** (S1) |
| CUV Complex | Triple toggle — overlap cluster glow | **ship** (S1) |
| Internal Stimulation | Pan — anterior path vs deep pressure | **ship** (S1) |
| Building | Hold — reservoir fills; release leaks | **ship** (S2) |
| Plateauing | Pan — climb onto flat ridge | **ship** (S2) |
| Pulsing | Tap — concentric pulse rings (~0.8s) | **ship** (S2) |
| Spreading | Tap — ripple through nerve tree | **ship** (S2) |
| Warm-up Window | Slow cooker — tempo-gated engorgement | **ship** (S3) |
| Responsive Desire | Ember rub — context wakes coal | **ship** (S3) |
| Spontaneous Desire | Wellspring — rises on its own | **ship** (S3) |
| Spectatoring | Focus misalign — cool orb → body | **ship** (S3) |
| Embodied Presence | Fill outline — warmth saturates | **ship** (S3) |
| Non-concordance | Dual meter — body vs felt desire | **ship** (S3) |
| Golden Trio | Triple toggle — multi-path glow (≥2) | **ship** (S4) |
| Sexual Self-Esteem | Hold orb — permission glow → silhouette | **ship** (S4) |
| Body Appreciation | Tap zones — felt warmth map | **ship** (S4) |

Shared kit: affordance hint, insight chip, optional idle pulse, insight haptics. Canvas-only. Reduce Motion = static teaching frame.

---

## 2. Quality bar

Every interactive must earn its place on See:

| Rule | Meaning |
|------|---------|
| One variable → one insight | User learns in **&lt;30s** of play |
| Obvious affordance | First-paint chrome hint (“Drag to explore” / “Tap to explore”); fades after first gesture |
| Reduce Motion | Meaningful **static teaching frame**, never auto-loop |
| Haptic on aha | Light impact at the insight moment only |
| Tokens only | `canvas` `#F9F5F1`, `diagram.passive` `#DCD8D3`, `diagram.active` `#E8603C`, `diagram.glow` `#FFC5B5`, `detachment` `#7A7AFF` sparingly |
| No in-canvas junk | Labels live in **UI chrome** (insight chip), never burned into drawing paths |
| Anti-gamification | No scores, streaks, stars, or multi-step tutorials |
| Calm adult instrument | Soft Intimate taste; abstract shapes, not explicit anatomy realism |
| Engine | SwiftUI `Canvas` only — no Rive / Lottie / 3D |

---

## 3. Full table — all 22 concepts

| # | Concept | Mechanic name | One-sentence teach | Interaction | Status |
|---|---------|---------------|--------------------|-------------|--------|
| 1 | Angling | Pelvis tilt | Tilting the pelvis redirects internal pressure along the anterior wall. | pan (vertical) | ship |
| 2 | Rocking | Pubic contact | Steady external contact at the pubic mound during penetration. | pan (free) | ship |
| 3 | Shallowing | Depth probe | Nerve-rich entrance peaks; deep is pressure, not “better.” | pan (horizontal) | ship |
| 4 | Pairing | Dual nodes | External + internal together light the bridge — combination is the insight. | dual tap | ship |
| 5 | Edging | Throttle & release | Rise toward a coral threshold, then ease back — approach and retreat. | pan (vertical) + release | ship |
| 6 | Clitoral Structure | Iceberg peel | Most of the clitoris is internal (~9 cm): glans → bulbs → crura. | tap / slide layers | ship |
| 7 | Nerve Density | Density dial | Extreme endings packed in a small glans area. | pan (vertical zoom) | ship |
| 8 | CUV Complex | Pressure triad | Clitoris, urethra, and front wall form one integrated cluster. | triple toggle | ship |
| 9 | Internal Stimulation | Anterior path | Front-wall pressure reaches internal clitoral tissue — not “deeper = better.” | pan (angle) | ship |
| 10 | Building | Hold to charge | Arousal gathers gradually; hold fills, release leaks slightly. | hold | **ship** (S2) |
| 11 | Plateauing | Ridge walk | Climb then walk a flat ridge — hover without climbing or fading. | pan (along curve) | **ship** (S2) |
| 12 | Pulsing | Rhythm tap | High-arousal throb as a calm pulse the user can match. | tap (tempo) | **ship** (S2) |
| 13 | Spreading | Ripple origin | Pleasure radiates outward from a touch origin through a nerve tree. | tap (origin) | **ship** (S2) |
| 14 | Warm-up Window | Slow cooker | Fast drags do nothing; slow sustained drag fills engorgement. | pan (tempo-gated) | **ship** (S3) |
| 15 | Responsive Desire | Ember rub | Desire wakes after sustained “context” — coal glows only with patience. | pan (circular) | **ship** (S3) |
| 16 | Spontaneous Desire | Wellspring | Wanting rises on its own; bubbles without user charge. | observe / light tap | **ship** (S3) |
| 17 | Spectatoring | Focus misalign | Attention drifts to grading self; drag cool orb back onto the body. | pan (align) | **ship** (S3) |
| 18 | Embodied Presence | Fill outline | Warmth saturates a body silhouette as attention stays in sensation. | pan (fill) | **ship** (S3) |
| 19 | Non-concordance | Dual meter | Genital response and felt desire can move independently. | dual slider | **ship** (S3) |
| 20 | Golden Trio | Soft triad | Intercourse + manual + oral as three gentle channels — variety, not a combo score. | triple toggle (light) | **ship** (S4) |
| 21 | Sexual Self-Esteem | Permission glow | Regard for oneself as allowed to want pleasure — soft fill, no grade. | hold / tap | **ship** (S4) |
| 22 | Body Appreciation | Felt map | Value the body for what it feels now — warm zones, not appearance scores. | tap zones | **ship** (S4) |

---

## 4. Deferred mechanics (now in scope — keep light)

Previously deferred in the archived plan; Conor wants them too. Keep non-gamified:

### Golden Trio
- **Mechanic:** Three soft channel toggles (intercourse / manual / oral). When two or more are on, a calm multi-path glow appears — insight is *variety serves*, not a “combo meter.”
- **Avoid:** Points, “complete the trio” checklists, celebratory confetti.
- **RM frame:** All three channels gently lit with caption context.

### Sexual Self-Esteem
- **Mechanic:** Hold (or slow tap) a soft orb; a warm permission glow expands into a quiet silhouette — “pleasure is something you get to want.”
- **Avoid:** Numeric self-ratings, progress bars that feel like therapy homework.
- **RM frame:** Soft glow already present at mid fill.

### Body Appreciation
- **Mechanic:** Tap abstract body zones; each lights with felt warmth (sensation), never beauty markers.
- **Avoid:** Appearance scoring, “fix your body” quizzes.
- **RM frame:** Several zones softly lit as a felt map.

---

## 5. Execution order

```
S0  Polish shipped 5                       ← done
S1  Anatomy 4: clitoral-structure → nerve-density → clitourethrovaginal → internal-stimulation  ← done
S2  Sensation: building → plateauing → pulsing → spreading  ← done
S3  Timing / mind: warmup-window → responsive-desire + spontaneous-desire → spectatoring + embodied-presence → non-concordance  ← done
S4  Remaining 3: golden-trio → sexual-self-esteem → body-appreciation  ← done
```

Do **not** regenerate media plates as part of diagram work. Plates stay reduce-motion / library backups.

---

## 6. Wire checklist (per new diagram)

```
ios/.../ConceptDiagrams.swift          ← {Id}DiagramView + knownDiagramIds
data/vocabulary.ts                     ← diagramType field
types/index.ts                         ← DiagramType union (if needed)
data/visual-formats.json               ← format: interactive
scripts/generate-v2-full-bundle.js     ← native://diagram/<id> routing
ios/DEVICE_QA.md                       ← gesture / RM / VO / small-screen rows
```

Optional: `docs/pipelines/prompts/diagrams/{id}.md` interaction spec (mechanic, states, a11y).

---

## 7. Success criteria

- See-page median dwell ≥15s on interactive concepts (qualitative ok for beta)
- After ~20s play, user can name the insight in their own words
- Every interactive has a meaningful Reduce Motion teaching frame
- Palette matches Soft Intimate diagram tokens — no drift
- `cd ios && swift test` stays green (9 tests)


---

## 7a. See media priority (S2)

`SeePageBody` prefers **native diagram (if present) → video (if motion allowed) → illustration → placeholder**.

Rationale: the interactive is the product differentiator. Sensation concepts may still ship videos; those remain optional/ambient later, not the primary teaching moment when a `diagramType` is wired.

---

## 7b. See media priority (S3)

Same as S2: **native diagram → video → illustration → placeholder**. Timing/mind concepts now ship `*-diagram` as the See `mediaId`; illustrations remain secondary / RM fallback paths on the media item.

Detachment accent `#7A7AFF` (`AppColor.diagramDetachment`) is reserved for mind-split concepts: spectatoring ghost orb and non-concordance felt-desire track.

---



## 7c. See media priority (S4)

Same as S2/S3: **native diagram → video → illustration → placeholder**. Final three concepts ship `*-diagram` as the See `mediaId`; illustrations remain secondary / RM fallback paths on the media item.

Status: **22/22 ship** (device QA pending).

## 8. Related docs

- Phase B track pointer: [`PLAN.md`](./PLAN.md), [`LAUNCH_GAPS.md`](./LAUNCH_GAPS.md)
- Taste: [`TASTE_SURVEY.md`](./TASTE_SURVEY.md)
- Archived phases 2–4 sketch: `docs/_archive/2026-08-11-pre-reset/pipelines/INTERACTIVE_DIAGRAMS_PLAN.md`
