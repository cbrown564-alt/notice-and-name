# Video Concept Catalog (Omni-expanded scope)

**Status:** Draft — Phase 2.5 (May 20, 2026)  
**Generator:** Gemini Omni Flash in [Google Flow](https://flow.google/)  
**Reference:** [`gemini_omni_best_practices.md`](../gemini_omni_best_practices.md) · [`VIDEO_GENERATION.md`](./VIDEO_GENERATION.md)

---

## Why scope expanded

Veo-era strategy limited video to **abstract loops** (no bodies, no anatomy) because motion was unreliable and scientifically misleading.

**Gemini Omni** changes the ceiling:

- **Scale traversal** — continuous zoom from human scale → tissue → cellular/micro structure (community/I/O demos: portrait → eye → capillaries → cells; DeepMind demos: super-zoom through hand “lens”, hippocampus claymation, protein folding).
- **World-knowledge rendering** — biology, physics, and narrative logic without frame-by-frame JSON.
- **Conversational refinement** — fix a wrong layer or pace without regenerating the whole clip.
- **Multi-input** — approved Nano Banana plate as `image-0` + motion reference video.

We still **verify against citations** and ship **visualization, not clinical proof**. Omni is more capable; our editorial bar stays high.

---

## Four video profiles

| Profile | Duration | Loop? | Size budget | Illustrate job |
|---------|----------|-------|-------------|----------------|
| **abstract-loop** | 8–10 s | Yes | ≤1.5 MB | Sensation rhythm (Building, Pulsing) |
| **scientific-journey** | 10 s (one-shot) | Optional | ≤2.5 MB* | Anatomy / mechanism zoom |
| **process-explainer** | 10 s | Rare | ≤2.5 MB* | Timeline, dual-pathway, cause→effect |
| **embodied-presence** | 10 s | Soft loop | ≤2.0 MB* | Attention, desire, mind-body |

\*Tier B/C/D may need `validate-manifest` budget bump or CRF 30–32; track in bundle report.

**Unchanged:** Techniques with Skia (Angling, Rocking, Shallowing, Pairing) — mechanics stay interactive; do not replace diagram with video.

---

## Priority matrix (22 concepts)

| Concept | Profile | Priority | Replaces | Notes |
|---------|---------|----------|----------|-------|
| **Building** | abstract-loop | P0 | placeholder MP4 | Pilot — ember/rings |
| **Pulsing** | abstract-loop | P0 | TBD | Pilot — 0.8s rhythm |
| **Spreading** | abstract-loop | P1 | legacy MP4 | Regen for style + loop |
| **Responsive Desire** | process-explainer | P1 | legacy MP4 | Spark → context → response |
| **Spontaneous Desire** | embodied-presence | P1 | TBD | Internal signal rising |
| **Embodied Presence** | embodied-presence | P1 | TBD | Sensation filling body outline |
| **Clitoral Structure** | scientific-journey | **P0** | static PNG | Macro → cross-section → crura/bulbs |
| **Nerve Density** | scientific-journey | **P0** | static PNG | Surface → micro nerve lattice |
| **CUV Complex** | scientific-journey | P1 | static PNG | Integrated cluster pressure |
| **Internal Clitoral Stimulation** | scientific-journey | P1 | static PNG | Anterior wall → internal crura |
| **Warm-up Window** | process-explainer | P1 | static PNG | Arousal timeline curve |
| **Non-concordance** | process-explainer | P1 | static PNG | Parallel pathways diverge/rejoin |
| **Plateauing** | process-explainer | P2 | static PNG | Sustained plateau band on curve |
| **Spectatoring** | embodied-presence | P2 | static PNG | Split attention (optional video) |
| **Golden Trio** | process-explainer | P2 | static PNG | Three channels lighting in sequence |
| Angling, Rocking, Shallowing, Pairing | — | — | Skia | No video |
| Edging | — | P3 | static | Interactive planned |
| Body Appreciation, Sexual Self-Esteem | — | P3 | static | Metaphor plates sufficient |

---

## Scale traversal pattern (scientific-journey)

Inspired by Omni demos: **continuous camera** moves through scales without hard cuts; each level remains **scientifically legible** and **editorially warm** (cream/coral bioluminescence — not cold OR grey clinical stock).

### Prompt skeleton

```
Cinematic educational visualization, Scientific Warmth palette (warm cream #F9F5F1, bioluminescent coral #E8603C accents, soft film grain).
One continuous shot / oner — no jump cuts.

Journey:
1. {MACRO — e.g. dignified torso silhouette, non-explicit, cropped above knees}
2. {MESO — smooth push into {region}, cross-section reveals {structure}}
3. {MICRO — zoom to {nerve lattice / cell-scale glow / fluid fill in bulbs}}

Motion: slow documentary dolly, 24fps, smooth acceleration between scales.
Accuracy: align with {citation concept — e.g. O'Connell clitoral MRI anatomy}; no invented organs.
Negative: pornographic framing, explicit intercourse, in-image text, watermarks, alarm red, cold hospital lighting.
No voiceover; ambient silence.
10 seconds total.
```

### Iteration turns (typical)

1. “Slow the zoom — spend 3s on cross-section before micro.”
2. “Crura must wrap the canal visibly; bulbs swell subtly with light, not pulse strobe.”
3. “Remove any text labels; keep only light and form.”
4. “Match image-0 color grading exactly.”

---

## Per-concept briefs

### Clitoral Structure (P0 — flagship journey)

**Deck caption:** Crura and bulbs wrapping the vaginal canal  

**Journey beats:** Silhouette or abstract pelvis in profile → translucent cross-section → full 9cm structure (glans, shaft, crura, bulbs) with gentle blood-fill glow on arousal.

**Starter prompt:**

```
One continuous scientific shot on warm cream void. Begin with an elegant, non-explicit 
feminine pelvis silhouette in soft side light (no face, no explicit sex act). 
Camera slowly pushes through tissue to a glowing cross-section revealing the full clitoral organ: 
glans, shaft, crura wrapping the canal, vestibular bulbs illuminating with bioluminescent coral light. 
Anatomically consistent with modern MRI mapping (O'Connell). Editorial, warm, not clinical cold. 
No text. 10 seconds. Smooth motion.
```

**Poster:** Keep current `clitoral-structure.png` for reduce-motion.

---

### Nerve Density (P0)

**Journey beats:** Glans form (stylized, not photoreal) → micro-zoom into dense nerve-ending field (8,000+ as visual density, not numeric overlay).

**Starter prompt:**

```
Continuous zoom into a bioluminescent clitoral glans sculpture on cream void. 
As camera pushes in, reveal an increasingly dense coral nerve-fiber network — 
like a living constellation, not horror gore. 
Convey extreme sensitivity through light density, not labels. 
10s, seamless loop optional at micro scale. No text, no bodies beyond abstract form.
```

---

### CUV Complex (P1)

**Journey:** Front wall of canal in cross-section → three structures (clitoral legs, urethral sponge, anterior wall) compress together under gentle pressure wave.

---

### Internal Clitoral Stimulation (P1)

**Journey:** External glans glow → camera follows “pressure” through anterior wall → internal crura light up.

---

### Warm-up Window (P1 — process)

**Not a zoom** — horizontal **time axis**: body outline fills with warmth left-to-right over ~10s; optional clock metaphor as abstract arc, no digits.

---

### Non-concordance (P1 — process)

**Dual pathway:** Two luminous streams (genital response vs subjective desire) start aligned, diverge, sometimes cross — no moral framing, no text.

---

### Responsive / Spontaneous Desire / Embodied Presence (P1)

Upgrade from generic loops to **narrative micro-stories** (10s): context appearing vs internal spark; or attention particles settling into body outline.

---

## Production order (revised)

1. **P0 pilots:** Building + Pulsing (abstract-loop) *and* Clitoral Structure + Nerve Density (scientific-journey)
2. Regen Spreading, Responsive Desire with Omni profiles
3. Anatomy batch: CUV, Internal Stimulation
4. Psychology/timing: Non-concordance, Warm-up Window, Embodied Presence, Spontaneous Desire
5. P2: Plateauing, Golden Trio, Spectatoring

---

## QA (scientific-journey)

- [ ] Citation spot-check (structures present: crura, bulbs, not fantasy organs)
- [ ] Non-explicit framing (no pornographic camera or activity)
- [ ] No in-image text (labels stay in app copy)
- [ ] Reads at phone size on IllustrateSlide
- [ ] Reduce-motion falls back to static illustration
- [ ] SynthID acceptable; document AI-generated in store metadata if required

---

## File plan

| Concept | Prompt file | Asset |
|---------|-------------|-------|
| clitoral-structure | `prompts/videos/clitoral-structure.md` | `assets/videos/clitoral-structure.mp4` |
| nerve-density | `prompts/videos/nerve-density.md` | `assets/videos/nerve-density.mp4` |
| (others) | Add when batch starts | per catalog above |
