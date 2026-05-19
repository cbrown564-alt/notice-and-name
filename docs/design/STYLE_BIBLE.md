# Style Bible v0.1

**Status:** Draft for ratification (Phase 1.1)  
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
| **Motion** | Teach *how it feels* | Abstract loops; avoid literal bodies where possible | `assets/videos/*.mp4` |
| **Interactive** | Teach *mechanics* | Skia diagrams; restrained palette matching plates | `components/diagrams/*` |

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

From `constants/theme.ts`:

| Token | Hex | Use |
|-------|-----|-----|
| `primary[500]` | `#E8603C` | Active touch, highlights, CTAs |
| `secondary[500]` | `#60846A` | Calm, grounding, success |
| `neutral[50]` | `#FCFAF9` | App background |
| `text.primary` | `#1C1B1A` | Body copy |
| `text.tertiary` | — | Captions on illustrate slide |

**Interactive diagrams:** passive anatomy `neutral[300]`; active/user `primary[500]` with glow (`BlurMask`).

**Detachment / mind:** cool metallic blue (sparingly) vs warm embodiment — see `PairingDiagram`, Non-concordance plates.

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
- **Spec:** 720p max, 8–12 s loop, ≤1.5 MB, muted in app.
- **Transcode:** `./scripts/transcode-video.sh`
- **Reduced motion:** Show static illustration when `AccessibilityInfo.isReduceMotionEnabled` (Phase 4).

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

## 10. Reference renders (Phase 1.1 — pending)

Pin one approved concept per family as north-star comparisons:

1. Technique — Angling or Pairing  
2. Sensation — Spreading  
3. Timing — Warm-up Window  
4. Psychological — Non-concordance  
5. Anatomy — Clitoral Structure  

---

*Supersedes scattered identity docs once ratified. Until then, keep `holistic_visual_identity.md` et al. in sync when this bible changes.*
