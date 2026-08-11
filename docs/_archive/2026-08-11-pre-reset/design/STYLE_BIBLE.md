# Style Bible v1.0

**Status:** v1.0 ratified  
**Canonical after:** Reference renders approved (one per category family)  
**Sources merged:** `holistic_visual_identity.md`, `app_visual_identity.md`, `asset_visual_identities.md`, `constants/theme.ts`


---

## 1. North star

**Scientific Warmth** — a living journal in a modern laboratory. Authoritative and precise, yet organic, safe, and felt. Not clinical, not generic wellness, not stock AI art.

---

## 2. Identity pillars (four layers)

| Layer | Role | Keywords | Implementation |
|-------|------|----------|----------------|
| **Shell** | Host; never competes with content | Editorial serif, sand paper, coral/sage, whitespace | `constants/theme.ts`, tab screens, deck chrome |
| **Concept plates** | Teach *what it is* | Anatomical clarity, cream canvas `#F9F5F1`, bioluminescent emphasis, **no in-image text** | `assets/images/concepts/illustrations/` |
| **Thumbnails** | Recognize at a glance | Simplified glyph of plate; consistent crop, border, glow accent | `assets/images/concepts/thumbnails/`, `ConceptCard` |
| **Motion** | Teach *how it feels* and *how it works* | Abstract loops + **scientific zoom journeys** (Omni); non-explicit | `assets/videos/*.mp4` |
| **Interactive** | Teach *mechanics* | SwiftUI Canvas diagrams; restrained palette matching plates | `ios/Sources/PleasureVocabularyApp/ConceptDiagrams.swift` |

### Category families (subtle cues, one style system)

Use the **same** plate language for all 22 concepts. Differentiate only through:

| Family | Cue | Example concepts |
|--------|-----|------------------|
| Technique | Directional motion, contact geometry | Angling, Rocking, Shallowing, Pairing |
| Sensation | Temporal / radiating metaphors | Building, Spreading, Pulsing |
| Timing | Time axis, curves, thresholds | Warm-up Window, Responsive Desire |
| Psychological | Mind/body split, focus, self-worth | Spectatoring, Non-concordance |
| Anatomy | Structure, cross-section, nerve density | Clitoral Structure, CUV |

---

## 3. Shared constants (immutable)

- **Canvas:** No stark white. Paper backgrounds: `neutral[50]` `#FCFAF9`, `neutral[100]` `#F5F2EF`.
- **Plate canvas:** Warm cream `#F9F5F1` for generated illustrations.
- **Tone:** Non-judgmental; no alarm reds or warning iconography.
- **Metaphor:** Bioluminescence — sensation as light/glow, not gore or hyper-realism.
- **Typography:** Playfair Display (headings), Inter (body). Italic serif for intimate prompts.
- **Shape language:** Soft radii (`borderRadius.lg`–`xl`), generous `spacing`.

---

## 4. Color tokens (implemented)

From `constants/theme.ts` (token audit May 19, 2026):

| Token | Hex | Use |
|-------|-----|-----|
| `primary[500]` | `#E8603C` | Active touch, highlights, CTAs |
| `secondary[500]` | `#60846A` | Calm, grounding, success |
| `neutral[50]` | `#FCFAF9` | App background (`background.primary`) |
| `neutral[100]` | `#F5F2EF` | Secondary surfaces |
| `conceptCanvas` | `#F9F5F1` | Generated illustration plates |
| `text.primary` | `#1C1B1A` | Body copy |
| `diagram.passive` | `#DCD8D3` | Native diagram inactive anatomy |
| `diagram.active` | `#E8603C` | Native diagram user/active stroke |
| `diagram.glow` | `#FFC5B5` | Native diagram emphasis halo |
| `diagram.detachment` | `#7A7AFF` | Mind/split (sparingly) |

**Interactive diagrams:** use `colors.diagram.*` where possible; legacy hard-coded values may remain in older diagrams until Phase 4 polish.

**Detachment / mind:** cool accent vs warm embodiment — see `PairingDiagram`, Non-concordance plates.

---

## 5. Concept plates (illustrations)

- **Line work:** Fine etching / cross-hatch for structure.
- **Light:** Ethereal glow for nerves, arousal, connection.
- **No text in image** — labels live in app copy only.
- **Dimensions:** 1024×1024 or 3:4 @2x PNG; ≤400 KB after `npm run compress-assets`.

---

## 6. Thumbnails

- Abstract bio-fluid forms; matte grain; no literal anatomy.
- 512×512 PNG; ≤80 KB post-compress.
- Framing in `ConceptCard`: consistent border, subtle glow accent on category.

---

## 7. Motion & video

- **Format:** H.264 MP4 only in repo (ProRes/MOV in `assets/videos/originals/` or cloud).
- **Profiles:** `abstract-loop` (≤1.5 MB) · `scientific-journey` / `process-explainer` (≤2.5 MB) — see `pipelines/VIDEO_CONCEPT_CATALOG.md`.
- **Scientific journeys:** Continuous zoom / cross-section; **Scientific Warmth** palette; citation-verified; non-explicit; no in-image text.
- **Transcode:** `./scripts/transcode-video.sh` (strip audio).
- **Reduced motion:** Static illustration poster when `AccessibilityInfo.isReduceMotionEnabled`.
- **Generation:** Gemini Omni Flash in Google Flow — `gemini_omni_best_practices.md`.

---

## 8. Accessibility (v1.0 scope)

| Requirement | Target |
|-------------|--------|
| Body text contrast | ≥4.5:1 on `neutral[50]` |
| Touch targets | ≥44×44 pt (mute, deck controls) |
| Reduced motion | Static fallback for all videos |
| Dark mode | **Out of scope** for v1.0 RC — document explicitly |

---

## 9. Asset approval checklist

Before committing any generated asset:

- [ ] Matches palette and plate canvas color
- [ ] No embedded text or watermarks
- [ ] Anatomically respectful; non-explicit
- [ ] File size within budget (see `pipelines/IMAGE_GENERATION.md` / `VIDEO_GENERATION.md`)
- [ ] Manifest row updated in `pipelines/ASSET_MANIFEST.md`
- [ ] `vocabulary.ts` `require()` path wired if applicable

---

## 10. Reference renders (Phase 1.1)

**Workflow:** [`pipelines/REFERENCE_RENDERS.md`](../pipelines/REFERENCE_RENDERS.md)  
**Tracker:** `data/reference-renders.json` — `npm run reference-renders`  
**Ratification:** 5/5 families approved → bible status **v1.0 ratified** → unblocks Phase 3 batch

Pin one approved concept per family after image pilot review ([`PILOT_BATCH.md`](../pipelines/prompts/PILOT_BATCH.md)):

| Family | Pilot concept | Status | Illustration prompt |
|--------|---------------|--------|---------------------|
| Technique | Angling | ✅ Approved | `pipelines/prompts/illustrations/angling.md` |
| Sensation | Spreading | ✅ Approved | `pipelines/prompts/illustrations/spreading.md` |
| Timing | Warm-up Window | ✅ Approved | `pipelines/prompts/illustrations/warmup-window.md` |
| Psychological | Non-concordance | ✅ Approved — in production (221 KB) | `pipelines/prompts/illustrations/non-concordance.md` |
| Anatomy | Clitoral Structure | ✅ Approved | `pipelines/prompts/illustrations/clitoral-structure.md` |

**Ratification:** All five reference renders passed checklist in-app, status updated to **v1.0 ratified**.


---

*Supersedes scattered identity docs once ratified. Until then, keep `holistic_visual_identity.md` et al. in sync when this bible changes.*

---

## 11. Alternative styles archive

For alternative visual styles explored during Phase 1.3 pilots (such as the Botanical/Coral Metaphor and the Hand-Drawn Sketchbook), see [ALTERNATIVE_STYLES.md](file:///Users/cobro/code/Pleasure%20Vocabulary%20Builder/docs/design/ALTERNATIVE_STYLES.md).
