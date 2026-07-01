# Media Regeneration Plan — Gemini Handoff

**Status:** Ready for external generation  
**Review completed:** 2026-07-01  
**Source of truth:** `data/media-regen-queue.json`, `data/media-review-decisions.json`  
**Style authority:** `docs/design/STYLE_BIBLE.md` (v1.0 ratified — **Scientific Warmth**)

---

## 1. Mission

Regenerate concept visuals so all 22 concepts feel like **one coherent style system**. A Jul 2026 review found production plates drifted between two lanes:

- **Scientific-anatomical** — Da Vinci–style cross-sections, etching, bioluminescent nerves (desired for technique/anatomy; acceptable metaphor elsewhere)
- **Ethereal-abstract** — moody, soft, less anatomical (currently overused on psychological/sensation concepts)

**Goal:** Every **plate** (illustration) and **thumbnail** should read as Scientific Warmth: cream canvas, bioluminescent emphasis, anatomical respect where relevant, **no in-image text**. Psychological concepts may use more abstract metaphor, but must share the same palette, canvas, line quality, and glow language as approved plates — not a separate “wellness stock art” look.

**Out of scope for this batch:** shell UI, pathway art, explainers, videos (except noting which concepts already have wired MP4s), native Skia/SwiftUI diagrams.

---

## 2. Do not regenerate (approved — use as visual anchors)

These seven production plates passed review. **Use them as reference images** when generating other concepts in the same category family:

| Concept | Category | Illustration path |
|---------|----------|-------------------|
| building | sensation | `assets/images/concepts/illustrations/building.png` |
| clitoral-structure | anatomy | `assets/images/concepts/illustrations/clitoral-structure.png` |
| edging | sensation | `assets/images/concepts/illustrations/edging.png` |
| internal-stimulation | anatomy | `assets/images/concepts/illustrations/internal-stimulation.png` |
| non-concordance | psychological | `assets/images/concepts/illustrations/non-concordance.png` |
| pairing | technique | `assets/images/concepts/illustrations/pairing.png` |
| responsive-desire | timing | `assets/images/concepts/illustrations/responsive-desire.png` |

**Family → anchor mapping for Gemini:**

| Category family | Anchor plate |
|-----------------|--------------|
| Technique | `pairing.png` (or `edging.png` for motion cues) |
| Sensation | `building.png` |
| Timing | `responsive-desire.png` |
| Psychological | `non-concordance.png` |
| Anatomy | `clitoral-structure.png` |

Per-concept prompt files (copy + modifiers): `docs/pipelines/prompts/illustrations/{concept-id}.md` and `{concept-id}-thumb.md`.

---

## 3. Work batches

### Batch A — Thumbnail only (3 concepts)

Plates are **keep**. Regenerate thumbnails so each reads as a **simplified glyph of its plate** — abstract, matte grain, no literal anatomy, recognizable at library card size.

| Concept | Category | Output path | Spec |
|---------|----------|-------------|------|
| angling | technique | `assets/images/concepts/thumbnails/angling.png` | 512×512 PNG, ≤80 KB |
| body-appreciation | psychological | `assets/images/concepts/thumbnails/body-appreciation.png` | 512×512 PNG, ≤80 KB |
| clitourethrovaginal | anatomy | `assets/images/concepts/thumbnails/clitourethrovaginal.png` | 512×512 PNG, ≤80 KB |

**Thumbnail rules (Style Bible §6):**

- Abstract bio-fluid / geometric forms; subtle glow accent in `#E8603C` / `#FFC5B5`
- No literal cross-sections; no text
- Must visually relate to the existing plate (same concept, simpler icon)
- See `docs/pipelines/prompts/illustrations/angling-thumb.md` for tone example

**Suggested order:** angling → clitourethrovaginal → body-appreciation

---

### Batch B — Full plate regeneration (12 concepts)

Replace illustration PNGs. Thumbnails should be regenerated **after** each new plate (glyph derived from plate), even though review marked “plate only” — thumbnails likely need updating for coherence once the plate changes.

| Concept | Category | Output path | Notes |
|---------|----------|-------------|-------|
| embodied-presence | psychological | `assets/images/concepts/illustrations/embodied-presence.png` | Anchor: `non-concordance.png` |
| golden-trio | timing | `assets/images/concepts/illustrations/golden-trio.png` | Anchor: `responsive-desire.png` |
| nerve-density | anatomy | `assets/images/concepts/illustrations/nerve-density.png` | Anchor: `clitoral-structure.png` |
| plateauing | sensation | `assets/images/concepts/illustrations/plateauing.png` | Anchor: `building.png` |
| pulsing | sensation | `assets/images/concepts/illustrations/pulsing.png` | Anchor: `building.png` |
| rocking | technique | `assets/images/concepts/illustrations/rocking.png` | Has native diagram; plate is fallback/poster |
| sexual-self-esteem | psychological | `assets/images/concepts/illustrations/sexual-self-esteem.png` | Anchor: `non-concordance.png` |
| shallowing | technique | `assets/images/concepts/illustrations/shallowing.png` | Has native diagram; plate is fallback |
| spectatoring | psychological | `assets/images/concepts/illustrations/spectatoring.png` | Anchor: `non-concordance.png` |
| spontaneous-desire | timing | `assets/images/concepts/illustrations/spontaneous-desire.png` | Anchor: `responsive-desire.png` |
| spreading | sensation | `assets/images/concepts/illustrations/spreading.png` | Has wired video; plate is reduce-motion fallback |
| warmup-window | timing | `assets/images/concepts/illustrations/warmup-window.png` | Anchor: `responsive-desire.png` |

**Plate spec (Style Bible §5):**

- 1024×1024 or 3:4 @2x PNG
- Canvas `#F9F5F1` (warm cream — not white)
- Fine etching / cross-hatch for structure; bioluminescent glow for nerves/arousal
- **No text, labels, watermarks, or UI chrome in the image**
- Anatomically respectful; non-explicit; non-gore
- Target ≤400 KB after lossless-friendly compression (integrator runs `npm run compress-assets`)

**Suggested generation order (by category, anchors first in group):**

1. **Anatomy:** nerve-density  
2. **Technique:** rocking, shallowing  
3. **Sensation:** plateauing, pulsing, spreading  
4. **Timing:** warmup-window, golden-trio, spontaneous-desire  
5. **Psychological:** embodied-presence, sexual-self-esteem, spectatoring  

---

## 4. Global prompt prefix (every image)

Include in every generation prompt:

```
Scientific Warmth / Medical Luxury educational illustration.
Warm cream canvas #F9F5F1, soft global illumination, pearlescent tissue sheen.
Bioluminescent coral-gold glow (#E8603C, #FFC5B5) for nerves, arousal, and sensation — never alarm red.
Fine etching and cross-hatch line work for anatomical structure where relevant.
Calm, authoritative, non-judgmental tone. Anatomically respectful, non-explicit.
NO text, labels, watermarks, or typography in the image.
```

**Negative prompt (always):**

```
text, letters, numbers, watermark, logo, gore, blood, clinical cold white background,
stock photo, 3D render plastic skin, alarm red, warning icons, explicit pornography,
busy background, dark moody wellness aesthetic unrelated to cream canvas
```

---

## 5. Category modifiers

Apply in addition to the global prefix:

**Technique** — Directional motion, contact geometry, clear cause-and-effect (pressure, tilt, rhythm). Cross-section acceptable.

**Sensation** — Temporal or radiating metaphors (waves, build, spread, pulse). Body may be simplified; emphasize glow propagation.

**Timing** — Time axis, curves, thresholds, before/after or progression without chart junk. Split-panel OK if seamless.

**Psychological** — Mind/body relationship, attention, self-worth. May be more abstract than anatomy plates but **same canvas, palette, and glow language** as `non-concordance.png`. Cool accent `#7A7AFF` sparingly for “mind elsewhere” — not dominant.

**Anatomy** — Structure, cross-section, nerve pathways. Highest anatomical clarity; wing/river metaphors OK if accurate (see `clitoral-structure.png`).

---

## 6. Concepts with other media (do not break)

| Concept | Also ships | Regen note |
|---------|------------|------------|
| angling, rocking, shallowing, pairing | Native interactive diagram | Plate is poster / reduce-motion fallback; must harmonize with diagram palette (`#E8603C`, `#FFC5B5`, `#DCD8D3`) |
| building, spreading, responsive-desire | MP4 video | New plate must work as static fallback when Reduce Motion is on |
| angling, body-appreciation, clitourethrovaginal | Thumbnail-only regen | Plate unchanged |

---

## 7. Delivery format for Gemini

For each asset, deliver:

```
{concept-id}/
  illustration.png   (Batch B only)
  thumbnail.png      (Batch A, or paired with each Batch B plate)
  prompt.txt         (final prompt used)
  notes.txt          (1–2 sentences: how it matches anchor + checklist)
```

Naming on delivery is flexible; integrator renames to repo paths in §3.

**Reference files to attach in Gemini session:**

- This plan
- `docs/design/STYLE_BIBLE.md`
- Relevant `docs/pipelines/prompts/illustrations/{concept}.md`
- PNG anchors from §2 (family-matched)

---

## 8. Acceptance checklist (per asset)

Before handoff back to engineering:

- [ ] Cream canvas `#F9F5F1` — no pure white or dark gray mood board
- [ ] No embedded text or watermarks
- [ ] Matches category family cue (§5)
- [ ] Glow reads as sensation/neural, not injury or fire
- [ ] Coherent with family anchor plate (§2)
- [ ] Thumbnail is simplified glyph of plate (not unrelated abstract)
- [ ] Anatomically respectful; non-explicit
- [ ] Illustration ≤400 KB target post-compress; thumbnail ≤80 KB (integrator verifies)

---

## 9. What engineering does after delivery

Not Gemini’s job, documented for context:

1. Replace files at paths in §3  
2. Run `npm run compress-assets`  
3. Run `npm run sync-ios-media` (copies to iOS bundle)  
4. Run `npm run validate-manifest`  
5. Update `data/asset-registry.json` / run `npm run sync-registry`  
6. Device QA on concept deck (library card + illustrate slide)

---

## 10. Explicit non-goals

- Do **not** regenerate the seven “keep” plates in §2  
- Do **not** use botanical/sketchbook alternative styles (`docs/design/ALTERNATIVE_STYLES.md` — rejected)  
- Do **not** promote any `_staging/` files — folder is empty/archived  
- Do **not** generate videos in this batch (video masters for building/responsive-desire/shallowing are retained separately)  
- Do **not** add in-image titles, “Figure 1”, or anatomical labels — all copy lives in app UI

---

## 11. Summary counts

| Action | Count |
|--------|------:|
| Keep plate (reference only) | 7 |
| Regen plate | 12 |
| Regen thumbnail (plate unchanged) | 3 |
| Regen thumbnail (paired with new plate) | 12 |
| **Total PNG deliverables** | **12 illustrations + 15 thumbnails** |

---

*Questions about concept meaning or citations: see `data/vocabulary.ts` and `docs/pipelines/prompts/illustrations/`.*
