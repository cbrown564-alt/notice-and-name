# Batch B — Plate + Thumbnail Prompts (Gemini Handoff)

**Status:** Ready for generation  
**Scope:** 12 illustration regens + 12 paired thumbnails  
**Style authority:** `docs/design/STYLE_BIBLE.md` (Scientific Warmth)  
**Plan:** `docs/pipelines/MEDIA_REGEN_PLAN.md` §3 Batch B

---

## Before you start

1. Attach this doc + `STYLE_BIBLE.md` + the **family anchor plate** for each concept (see table below).
2. Generate **plate first**, approve it, then generate **thumbnail as a simplified glyph of that plate** (Batch A pattern).
3. **No in-image text** — prior QA failures included labels, titles, and chart numbers.
4. Harmonize technique plates with diagram palette: `#E8603C`, `#FFC5B5`, `#DCD8D3` where a native Skia diagram exists.

### Global prefix (every plate + thumb)

```
Scientific Warmth / Medical Luxury educational illustration.
Warm cream canvas #F9F5F1, soft global illumination, pearlescent tissue sheen.
Bioluminescent coral-gold glow (#E8603C, #FFC5B5) for nerves, arousal, and sensation — never alarm red.
Fine etching and cross-hatch line work for anatomical structure where relevant.
Calm, authoritative, non-judgmental tone. Anatomically respectful, non-explicit.
NO text, labels, watermarks, or typography in the image.
```

### Global negative (every plate + thumb)

```
text, letters, numbers, watermark, logo, gore, blood, clinical cold white background,
stock photo, 3D render plastic skin, alarm red, warning icons, explicit pornography,
busy background, dark moody wellness aesthetic unrelated to cream canvas,
botanical sketchbook style, sepia-only without coral glow
```

### Thumbnail suffix (after each approved plate)

```
512×512 concept library thumbnail. Simplify the attached approved plate into a library-card glyph.
Same cream canvas #F9F5F1, matte grain, coral bioluminescent accent on ONE focal element.
Abstract and dignified — no literal cross-sections, no explicit anatomy, no text.
Must be recognizable as the same concept as the plate at ~64px width.
```

---

## Generation order

| # | Concept | Category | Anchor plate | Also ships |
|---|---------|----------|--------------|------------|
| 1 | nerve-density | anatomy | `clitoral-structure.png` | — |
| 2 | rocking | technique | `pairing.png` | Skia diagram |
| 3 | shallowing | technique | `pairing.png` | Skia diagram |
| 4 | plateauing | sensation | `building.png` | — |
| 5 | pulsing | sensation | `building.png` | — |
| 6 | spreading | sensation | `building.png` | MP4 video (static fallback) |
| 7 | warmup-window | timing | `responsive-desire.png` | — |
| 8 | golden-trio | timing | `responsive-desire.png` | — |
| 9 | spontaneous-desire | timing | `responsive-desire.png` | — |
| 10 | embodied-presence | psychological | `non-concordance.png` | — |
| 11 | sexual-self-esteem | psychological | `non-concordance.png` | — |
| 12 | spectatoring | psychological | `non-concordance.png` | — |

---

## 1. nerve-density

**Output:** `assets/images/concepts/illustrations/nerve-density.png`  
**Caption:** Dense neural network in the glans  
**Anchor:** `clitoral-structure.png`

### Plate prompt

```
[Global prefix]

Anatomy family — structure and nerve density. Match clitoral-structure anchor: fine etching,
cream #F9F5F1, dignified wing/bulb metaphor acceptable.

Gallery medical illustration: ZOOMED view of the clitoral glans (external bulb only).
Inside the glans tissue, show an extraordinarily DENSE bioluminescent coral-gold nerve plexus —
thousands of fine glowing filaments packed tight, like a biological sensor array.
High contrast: pale pearlescent tissue shell vs intense internal neural glow.
Teach "8,000 nerve endings in a small area" through density of glow, not numbers or labels.
Cross-section or translucent cutaway OK. Anatomically respectful, non-explicit.
```

### Thumbnail glyph

```
Minimal glans bulb silhouette with interior filled by tight coral nerve filaments (starburst/dense web).
Abstract, no explicit genital realism at card size. Cream #F9F5F1, matte grain.
```

### Pitfalls

- Avoid empty/generic nerve tree floating on cream (ethereal-abstract drift).
- Do not label "8,000" or use infographic counters.

---

## 2. rocking

**Output:** `assets/images/concepts/illustrations/rocking.png`  
**Caption:** Compression and friction at the pubic mound  
**Anchor:** `pairing.png` (technique family)

### Plate prompt

```
[Global prefix]

Technique family — directional motion, contact geometry. Abstract phantoms, not explicit sex acts.

Side or 3/4 cross-section focusing on PUBIC MOUND and external clitoral region where bodies meet.
Show two contact surfaces pressed together with STEADY COMPRESSION (not separation gap of thrusting).
Curved motion lines indicate GRINDING / CIRCULAR / rocking path — continuous contact maintained.
Coral bioluminescent glow at the friction/compression zone on external tissue.
Contrast with thrusting: no in-out depth arrows; emphasize parallel bodies and wave-like hip motion.
Harmonize palette with interactive diagram: #E8603C active glow, #DCD8D3 passive tissue.
```

### Thumbnail glyph

```
Abstract two-surface compression shape + small circular arrow loop + single coral glow at contact point.
No cross-section at thumb scale.
```

### Pitfalls

- Do not depict explicit intercourse or faces.
- Must read differently from angling (tilt) — rocking = circular grind at pubic contact.

---

## 3. shallowing

**Output:** `assets/images/concepts/illustrations/shallowing.png`  
**Caption:** Nerve-rich tissue at the introitus  
**Anchor:** `pairing.png`

### Plate prompt

```
[Global prefix]

Technique family — contact geometry at a specific depth zone.

Detailed zoom: vulvar vestibule and first 1–2 inches of canal ONLY.
Dense coral-gold bioluminescent glow on the ENTRANCE / introitus nerve ring.
Deeper canal shown pale and quiet — contrast teaches "destination is the entrance."
Abstract rounded phantom tip or touch arc lingering in entrance zone (not explicit penetration scene).
Fine etching on tissue; warm cream canvas. Respectful anatomy.
```

### Thumbnail glyph

```
Glowing coral ring at a shallow arc opening; minimal depth line fading inward. (See shallowing-thumb.md.)
```

### Pitfalls

- Avoid deep-penetration framing — shallow depth is the story.
- Must harmonize with ShallowingDiagram (entrance emphasis).

---

## 4. plateauing

**Output:** `assets/images/concepts/illustrations/plateauing.png`  
**Caption:** Sustained activation without a new peak  
**Anchor:** `building.png`

### Plate prompt

```
[Global prefix]

Sensation family — temporal metaphor. Match building anchor: pelvic nerve network, etching + glow.

Frontal or simplified pelvic view with clitoral/pudendal nerve pathways as branching coral-gold lines.
Visualize PLATEAU: left third shows glow INTENSITY RISING (like building); middle/right holds
the SAME brightness level in a flat horizontal band — sustained charge, neither climbing nor fading.
Optional subtle horizontal "hold" band across the nerve network (no axis labels, no chart junk).
Metaphor: hovering at altitude, not a battery or capacitor with text.
```

### Thumbnail glyph

```
Rising coral curve that flattens into a horizontal plateau line — single stroke, minimal, matte grain.
Distinct from building thumb (which rises) and edging thumb (peak then drop).
```

### Pitfalls

- Do not use literal graphs with numbers or axis labels.
- Must differ from building (still climbing) and edging (peak + retreat).

---

## 5. pulsing

**Output:** `assets/images/concepts/illustrations/pulsing.png`  
**Caption:** Concentric contraction waves in pelvic floor tissue  
**Anchor:** `building.png`

### Plate prompt

```
[Global prefix]

Sensation family — rhythmic temporal metaphor.

Pelvic floor / perineal region in fine etching cross-section or simplified anatomical view.
Show CONCENTRIC RIPPLE WAVES of coral-gold bioluminescence emanating from a central point —
like sonar rings or heartbeat echoes through soft tissue.
3–4 rings at decreasing opacity suggest contract/release rhythm (~0.8s orgasm pulse metaphor).
Tissue structure visible beneath; glow reads as sensation, not injury shockwave.
```

### Thumbnail glyph

```
3 concentric coral rings from a central dot — rhythmic pulse icon. Cream canvas, matte grain.
```

### Pitfalls

- Distinguish from spreading (radiating outward through whole body) — pulsing is local rhythmic rings.
- Avoid EKG/chart overlays with numbers.

---

## 6. spreading

**Output:** `assets/images/concepts/illustrations/spreading.png`  
**Caption:** Neural signals propagating beyond the contact point  
**Anchor:** `building.png`  
**Note:** Static reduce-motion fallback for `spreading.mp4` — must work as a poster.

### Plate prompt

```
[Global prefix]

Sensation family — radiating propagation. Match building's branching pelvic nerve etching style.

Clitoral/pelvic region as ORIGIN POINT of intense coral-gold glow.
Golden neural ripples travel OUTWARD through etched nerve branches into abdomen, thighs, spine —
expansion beyond the contact zone. Elegant, anatomically grounded, not cartoon splash.
Same cream canvas and line quality as building.png. Teach whole-body radiating arousal.
```

### Thumbnail glyph

```
Small central coral dot with 3–4 curved ripple arcs expanding outward (like water ripple).
Matte grain, cream canvas.
```

### Pitfalls

- Must feel coherent with building anchor (not unrelated abstract swirls).
- Poster must communicate motion/radiation without relying on video.

---

## 7. warmup-window

**Output:** `assets/images/concepts/illustrations/warmup-window.png`  
**Caption:** Engorgement and blood flow increasing over time  
**Anchor:** `responsive-desire.png`

### Plate prompt

```
[Global prefix]

Timing family — progression over time without chart junk. Match responsive-desire neural elegance.

Split or seamless before/after of clitoral structure (full wing/bulb internal view OK):
LEFT / BEFORE: pale, smaller, minimal vascular glow — resting state.
RIGHT / AFTER: engorged, richer coral-peach tissue, bright bioluminescent blood-flow glow,
crura and bulbs visibly fuller. Teach ~20-minute warm-up physiology through visual transformation.
NO clock, NO "20 min" text, NO timeline labels. Transformation alone tells the story.
```

### Thumbnail glyph

```
Two side-by-side minimal bulb silhouettes: left pale, right coral-glowing (engorged). Or single shape
with gradient pale→warm left-to-right.
```

### Pitfalls

- Do not use infographic timelines or numeric labels.
- Pair visually with responsive-desire (timing family) not building (sensation climb).

---

## 8. golden-trio

**Output:** `assets/images/concepts/illustrations/golden-trio.png`  
**Caption:** Three stimulation types in one session  
**Anchor:** `responsive-desire.png` / technique ref `pairing.png`

### Plate prompt

```
[Global prefix]

Timing family — combination / convergence metaphor. NON-EXPLICIT: abstract stimulation pathways only.

Sagittal or simplified pelvic cross-section. THREE distinct coral-gold stimulation pathways
converging on the clitoral complex in the same session:
  1. Internal canal contact (subtle phantom arc — not explicit penis)
  2. Manual external contact (abstract finger-curve arcs on hood/shaft)
  3. Oral/external approach (soft curved approach line — no explicit mouth anatomy)
All three glow streams meet at a shared bright focal node on clitoral tissue.
Teach "variety in one encounter" through convergence, not a sex scene.
Style: pairing.png contact geometry + responsive-desire glow language.
```

### Thumbnail glyph

```
Three thin coral lines/arcs converging on one central glow dot (triple-merge icon). Cream canvas.
```

### Pitfalls

- **Highest explicit-content risk in Batch B** — keep all elements abstract phantoms.
- Do not depict faces, mouths, or genitals literally.
- Not the same as pairing (two pathways) — must clearly show THREE.

---

## 9. spontaneous-desire

**Output:** `assets/images/concepts/illustrations/spontaneous-desire.png`  
**Caption:** Internal arousal signals rising independently  
**Anchor:** `responsive-desire.png`

### Plate prompt

```
[Global prefix]

Timing family — internal vs externally triggered desire. MUST differ from responsive-desire plate.

Neural / biological landscape in responsive-desire style (etched neurons, cream canvas).
Show coral-gold glow bubbles or pulses rising SPONTANEOUSLY from DEEP INTERNAL sources —
no external touch, no partner contact, no visible trigger at the image edge.
Upward drifting bioluminescent signals from within the pelvic/neural network.
Metaphor: urge appearing from inside, unprompted. Calm, not chaotic.
```

### Thumbnail glyph

```
2–3 small coral glow bubbles rising from a single base line (internal origin). No external arrow in.
Contrast responsive-desire thumb (external spark → bloom).
```

### Pitfalls

- responsive-desire = external spark then bloom; spontaneous = internal bubbles only.
- Avoid random stock "wellness energy" with no anatomical anchor.

---

## 10. embodied-presence

**Output:** `assets/images/concepts/illustrations/embodied-presence.png`  
**Caption:** Attention filling the outline of the body  
**Anchor:** `non-concordance.png`

### Plate prompt

```
[Global prefix]

Psychological family — same canvas/palette as non-concordance. NO cool split (that is spectatoring/non-concordance).

Transparent or etched torso/pelvis outline (no face detail). Warm coral-gold bioluminescence
FILLS the entire body silhouette uniformly — attention inhabiting every contour.
Grounding downward flow; full inhabitation. No detached observer, no ghost head, no cool #7A7AFF.
Opposite of spectatoring: single unified warm field. Sensate focus, not judgment.
```

### Thumbnail glyph

```
Simple body silhouette filled with even warm coral glow (no split, no second orb). Matte grain.
```

### Pitfalls

- Do not duplicate non-concordance (two-zone split) or spectatoring (observer ghost).
- Avoid ethereal floating figure on dark background.

---

## 11. sexual-self-esteem

**Output:** `assets/images/concepts/illustrations/sexual-self-esteem.png`  
**Caption:** Warm core sense of sexual confidence  
**Anchor:** `non-concordance.png`

### Plate prompt

```
[Global prefix]

Psychological family — self-worth as warm biological core, not magical halo.

Torso view (chest to pelvis, no face). Radiant CORAL-GOLD core at heart/solar plexus —
biological vascular glow expanding outward through etched tissue, like inner confidence
warming the whole trunk. Pearlescent skin, fine etching. Confident, calm, non-sexualized pose.
Not a mirror scene; not performance. Internal source → outward warmth.
```

### Thumbnail glyph

```
Soft torso oval with bright coral core glow at center, faint outward gradient. Cream canvas.
```

### Pitfalls

- Avoid literal heart icon or emoji-like shapes.
- Distinguish from body-appreciation (touch + nerve branches) — this is internal core radiance.

---

## 12. spectatoring

**Output:** `assets/images/concepts/illustrations/spectatoring.png`  
**Caption:** Attention split between body and inner critic  
**Anchor:** `non-concordance.png`

### Plate prompt

```
[Global prefix]

Psychological family — mind/body split. Cool accent #7A7AFF SPARINGLY for detached mind only.

Etched torso/pelvis in warm coral (present body, slightly dimmer — sensation muted).
Above or behind: detached cool-toned (#7A7AFF) ghost orb or abstract "watcher" shape —
analytical, not monstrous. Thin dashed line between watcher and body (non-concordance language).
Teach self-observation pulling attention OUT of sensation. Never pathologize; calm clinical tone.
No face details, no mirror, no text thought bubbles.
```

### Thumbnail glyph

```
Warm body curve below + small cool orb above + thin dashed connector. Match non-concordance-thumb
(two-orbs) language but vertical split (body vs watcher), not horizontal mind/body concordance.
```

### Pitfalls

- non-concordance = genital response vs felt desire; spectatoring = body vs inner critic.
- Do not use harsh/judgmental facial expressions.

---

## Delivery checklist (per concept)

```
{concept-id}/
  illustration.png
  thumbnail.png
  prompt.txt
  notes.txt   ← 1–2 sentences: anchor match + checklist
```

### Acceptance (per asset)

- [ ] Cream canvas `#F9F5F1`
- [ ] No embedded text or watermarks
- [ ] Matches category family cue
- [ ] Glow = sensation/neural, not injury
- [ ] Coherent with family anchor plate
- [ ] Thumbnail is simplified glyph of **this** plate
- [ ] Illustration ≤400 KB post-compress; thumbnail ≤80 KB
- [ ] Technique plates harmonize with Skia diagram palette (rocking, shallowing)

---

## After delivery (engineering)

1. Replace files at paths in `MEDIA_REGEN_PLAN.md` §3  
2. `npm run compress-assets` (if not pre-compressed)  
3. `npm run sync-ios-media`  
4. `npm run validate-manifest`  
5. `npm run sync-registry`  
6. Update `data/media-review-decisions.json` (`regen` → `keep`)  
7. Device QA on library card + illustrate slide

---

*Per-concept files also live at `docs/pipelines/prompts/illustrations/{concept-id}.md` and `{concept-id}-thumb.md`.*
