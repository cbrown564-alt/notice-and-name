# Visual Content Strategy

**Status:** Revised (Phase 2.5, May 20, 2026) — Omni-expanded video scope  
**Machine-readable:** [`data/visual-formats.json`](../../data/visual-formats.json)  
**Audit column:** `format_choice` in `content/CONCEPT_AUDIT.md`  
**Video catalog:** [`pipelines/VIDEO_CONCEPT_CATALOG.md`](../pipelines/VIDEO_CONCEPT_CATALOG.md)

---

## Framework: four tiers of fidelity

| Format | Purpose | Best for |
|--------|---------|----------|
| **Interactive diagram** | Learning by doing — manipulate variables | Mechanics & techniques |
| **Rich static** | Clarity at a glance — charts, splits, metaphors | Simple comparisons, fallback posters |
| **Abstract motion (video)** | Rhythm & sensation — loops | Building, Pulsing, Spreading |
| **Scientific motion (video)** | **Scale, structure, mechanism** — zoom journeys & explainers | **Anatomy, timing curves, dual pathways** |

**Gemini Omni** makes the fourth tier viable: continuous zoom, cross-sections, and process explainers with far higher scientific and aesthetic fidelity than Veo allowed.

---

## Video profiles (within “video” format)

| Profile | Concepts (priority) |
|---------|---------------------|
| `abstract-loop` | Building (P0), Pulsing (P0), Spreading (P1) |
| `scientific-journey` | **Clitoral Structure (P0)**, **Nerve Density (P0)**, CUV Complex (P1), Internal Stimulation (P1) |
| `process-explainer` | Warm-up Window (P1), Non-concordance (P1), Responsive Desire (P1), Plateauing (P2), Golden Trio (P2) |
| `embodied-presence` | Spontaneous Desire (P1), Embodied Presence (P1), Spectatoring (P2) |

Techniques **stay interactive** (Skia): Angling, Rocking, Shallowing, Pairing.

---

## Locked format per concept (22/22)

| Concept | Format | Video profile | Rich media today | Notes |
|---------|--------|---------------|------------------|-------|
| Angling | interactive | — | Skia | ✅ |
| Rocking | interactive | — | Skia | ✅ |
| Shallowing | interactive | — | Skia | Introitus nerves in diagram |
| Pairing | interactive | — | PairingDiagram | ✅ |
| Building | video | abstract-loop | `building.mp4` | Regen |
| Plateauing | video | process-explainer | illustration | Curve animation |
| Edging | interactive (planned) | — | static placeholder | Phase 4 |
| Spreading | video | abstract-loop | `spreading.mp4` | Regen |
| Pulsing | video | abstract-loop | **TBD** | P0 pilot |
| Warm-up Window | video | process-explainer | illustration → video | Timeline |
| Responsive Desire | video | process-explainer | `responsive-desire.mp4` | Regen |
| Spontaneous Desire | video | embodied-presence | **TBD** | P1 |
| Golden Trio | video | process-explainer | illustration | Three-channel sequence |
| Spectatoring | video | embodied-presence | illustration | P2 |
| Embodied Presence | video | embodied-presence | **TBD** | P1 |
| Non-concordance | video | process-explainer | illustration | Dual pathway |
| Sexual Self-Esteem | static | — | illustration | — |
| Body Appreciation | static | — | illustration | — |
| Clitoral Structure | video | **scientific-journey** | illustration → video | **P0 flagship** |
| Nerve Density | video | **scientific-journey** | illustration → video | **P0** |
| CUV Complex | video | scientific-journey | illustration | P1 |
| Internal Stimulation | video | scientific-journey | illustration | P1 |

**Static-only (no video planned):** Sexual Self-Esteem, Body Appreciation, Edging (until interactive ships).

---

## Production order (Phase 3+)

1. **Dual P0 pilots:** abstract (Building, Pulsing) + journey (Clitoral Structure, Nerve Density) — [`VIDEO_PILOT_BATCH.md`](../pipelines/prompts/VIDEO_PILOT_BATCH.md)
2. Regen legacy sensation/desire MP4s with Omni profiles
3. Anatomy batch: CUV, Internal Stimulation
4. Psychology/timing video batch
5. Image pilot + shell assets (unchanged)

---

*Supersedes May 19 format lock for anatomy and several psychology/timing concepts. Run `npm run generate-concept-audit` after `visual-formats.json` updates.*
