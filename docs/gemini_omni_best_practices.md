# Gemini Omni — Video Best Practices

**Last updated:** May 20, 2026  
**Status:** Primary generation reference (replaces Veo 3.1)  
**Catalog:** [`pipelines/VIDEO_CONCEPT_CATALOG.md`](./pipelines/VIDEO_CONCEPT_CATALOG.md) — expanded concept scope  
**Access:** [Google Flow](https://flow.google/), Gemini app, YouTube Shorts/Create

**Official:** [Prompt guide](https://deepmind.google/models/gemini-omni/prompt-guide/) · [Introducing Gemini Omni](https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-omni/) · [Model page](https://deepmind.google/models/gemini-omni/)

---

## Executive summary

**Gemini Omni** combines Gemini’s **reasoning and world knowledge** with native video generation and **multi-turn editing**. The first release is **Omni Flash** (~10 s clips; longer formats coming per Google).

### Capability leap vs Veo (why we expanded scope)

| Capability | Veo 3.1 (legacy) | Gemini Omni |
|------------|------------------|---------------|
| Prompting | Exhaustive 5-step / JSON | Intention + optional detail; model infers structure |
| Science / biology | High hallucination risk; abstract-only safe path | **Scale traversal**, explainers, cross-sections with stronger fidelity |
| Camera | Must spell out every move | **Continuous zoom / oner**; iterative camera fixes |
| Editing | Regenerate clip | **Conversation** preserves scene; swap elements, pacing, grade |
| Inputs | Text + ingredients | Image + video + audio + text + storyboard |
| Anatomy education | Avoid motion; static plates only | **Scientific-journey video** when citation-verified |

Early demos (I/O 2026, DeepMind, community) include:

- **Nested zoom** — full figure → region → micro structure (widely shared: portrait → eye → capillaries → cells; same class as DeepMind’s “hand lens super-zoom” demo).
- **Accurate explainers** — protein folding claymation; hippocampus stop-motion with voiceover discipline.
- **Physics** — marble chain-reaction continuous shot.
- **Complex sequences** — A–Z objects with timed lower-thirds; quantum computing visual metaphor with specified art direction.

For **Pleasure Vocabulary Builder**, we now target **four video profiles** — not only abstract loops. Anatomy and mechanism concepts can use **scientific-journey** motion on the Illustrate slide.

---

## 1. Four video profiles (project)

| Profile | Use | Loop? | Budget |
|---------|-----|-------|--------|
| **abstract-loop** | Sensation rhythm (Building, Pulsing, Spreading) | Yes | ≤1.5 MB |
| **scientific-journey** | Anatomy zoom, cross-section, nerve density | Optional | ≤2.5 MB |
| **process-explainer** | Timelines, dual pathways (Warm-up Window, Non-concordance) | Rare | ≤2.5 MB |
| **embodied-presence** | Desire, presence, attention | Soft | ≤2.0 MB |

Full concept list: [`VIDEO_CONCEPT_CATALOG.md`](./pipelines/VIDEO_CONCEPT_CATALOG.md).

**Still Skia, not video:** Angling, Rocking, Shallowing, Pairing (mechanics need interaction).

---

## 2. Scale traversal (scientific-journey)

The highest-value Omni pattern for our **anatomy** deck: **one continuous shot** that changes scale while staying scientifically legible and on-brand.

### Structure

```
MACRO  →  MESO (cross-section)  →  MICRO (nerve lattice / internal organ detail)
```

### Example domains (from public Omni demos + our catalog)

| Demo type | What it shows | PVB application |
|-----------|---------------|-----------------|
| Portrait → eye → vessels → cells | Nested biological zoom, smooth motion | **Inspiration for journey grammar** — adapt to pelvis → cross-section → crura/bulbs |
| Hand “lens” super-zoom | Magnifies ground with sharper detail | Zoom **into** illustration plate |
| Protein folding / hippocampus | Process + accuracy in stylized medium | Warm-up Window, Non-concordance (process profile) |
| Quantum computing explainer | Concept + explicit art direction in one prompt | Pair palette tokens with mechanism description |

### Prompt skeleton

```
Cinematic educational visualization, Scientific Warmth (cream #F9F5F1, bioluminescent coral #E8603C, soft grain).
One continuous shot, 10 seconds, 24fps documentary pace — no jump cuts.

Journey: {MACRO beat} → {MESO cross-section} → {MICRO detail}.
Accuracy: consistent with {citation — e.g. O'Connell clitoral anatomy}; visualization not clinical procedure.
Negative: explicit intercourse, pornographic framing, in-image text, invented organs, cold hospital lighting, strobe.
Silent — no voiceover (we strip audio in transcode).
```

Attach **`image-0`** = approved Nano Banana illustration so Omni inherits palette and composition.

### Iteration (typical)

1. “Slow the push — hold cross-section for 3 seconds.”
2. “Crura must wrap the canal before micro zoom.”
3. “Remove all on-screen text.”
4. “Match image-0 grading; less saturation outside coral glow.”

---

## 3. Prompting philosophy

### Omni-native (less prescriptive than Veo)

1. State **teaching goal** and **metaphor** (“show that the clitoris is mostly internal”).
2. Specify **profile** (journey vs loop vs explainer).
3. Add **non-negotiables** (palette, no text, no explicit sex act, one-shot).
4. Let Omni fill histology, lighting, and secondary motion.
5. **Refine in conversation** — do not restart unless concept is wrong.

### Building blocks

| Block | Examples |
|-------|----------|
| **Shot & motion** | `one continuous shot`, `oner`, `slow dolly push`, `seamless 10s loop`, `static locked-off` |
| **Style** | Scientific Warmth, risograph grain, bioluminescent coral, abstract-anatomical |
| **Scale** | “zoom from silhouette to cross-section to nerve lattice” |
| **Accuracy** | “consistent with O'Connell MRI clitoral mapping” (verification still required) |
| **Negative** | explicit acts, porn framing, labels in frame, clinical cold, strobe |

---

## 4. Conversational editing

Each turn builds on the previous; scene memory persists (Flow / Gemini app).

| Edit | Example |
|------|---------|
| Element | “Change the butterfly to a bee.” |
| Camera | “Over-the-shoulder on the violinist.” |
| Pace | “Slow the zoom between scales by 30%.” |
| Science fix | “Bulbs should swell with light at the base, not pulse like alarm.” |
| Style | “Apply image-0 color grade; keep motion.” |

**Workflow:** Generate journey → 3–6 edit turns → export → transcode → device QA.

---

## 5. Reference inputs

| Pattern | PVB use |
|---------|---------|
| **image-0** = illustration PNG | Lock palette + structure before animating |
| **video-0** = motion reference | Rhythm from Spreading/BUILDING for regen |
| **Storyboard grid** | Multi-beat explainers (Golden Trio, alphabet-style timing) |
| **Drawing → footage** | Skia export as movement guide only |

---

## 6. Verification (still mandatory)

Omni is **more capable**, not **infallible**.

| Risk | Mitigation |
|------|------------|
| Plausible wrong anatomy | Spot-check against `researchBasis` + citations; reject and re-prompt |
| Pornographic framing | Negative prompts + human QA; crop in transcode if needed |
| In-image text | Iterate “remove all text” |
| Overclaiming | App copy says **visualization**; video teaches mechanism, not proof |

**Hybrid workflow (best of both):**

1. Approve **static** plate in Nano Banana (accurate structure).
2. Omni **animates** or **zooms** from that plate — reduces invented geometry.
3. Expert review before `assets/videos/` commit.

**Do not** use Omni for surgical training or procedural medical video.

---

## 7. Profile-specific templates

### Abstract loop (sensation)

```
Using image-0 as style reference: abstract {metaphor} on cream void, bioluminescent coral glow.
Static or near-static camera, seamless 10s loop, ~{period}s rhythm where applicable.
No text, no photoreal bodies, no strobe.
```

### Scientific journey (anatomy)

See §2 skeleton + per-concept files in `pipelines/prompts/videos/`.

### Process explainer (timing / psychology)

```
10 second one-shot: {mechanism narrative — e.g. two luminous pathways diverge and sometimes align}.
Horizontal or radial time metaphor, no clock digits, no text, Scientific Warmth palette.
```

### Embodied presence

```
Attention or desire visualized as light particles settling into a body outline — non-explicit, no face required.
Soft loop, 10s, cream void, coral warmth filling form from within.
```

---

## 8. Audio and delivery

- Omni may generate sync audio — **strip** with `transcode-video.sh` (`-an`).
- Prompt: “silent ambient void” when the UI supports it.
- **SynthID** watermark on all outputs.

---

## 9. Tooling matrix

| Need | Tool |
|------|------|
| Abstract sensation loop | Omni |
| Anatomy / nerve / CUV journey | Omni (scientific-journey) |
| Interactive angle/depth | Skia |
| Pixel mask VFX | Runway / AE (fallback) |
| Procedural medical training | **None** |

---

## 10. QA checklist

- [ ] Correct **profile** for concept (see catalog)
- [ ] Citation spot-check for anatomy journeys
- [ ] Non-explicit, on-brand (STYLE_BIBLE §7)
- [ ] No in-image text
- [ ] Reads on phone (IllustrateSlide)
- [ ] Transcode within tier budget; poster PNG for reduce motion
- [ ] `ASSET_MANIFEST.md` updated

---

## 11. Sources

1. [Gemini Omni prompt guide](https://deepmind.google/models/gemini-omni/prompt-guide/)  
2. [Introducing Gemini Omni](https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-omni/)  
3. [Gemini Omni — DeepMind](https://deepmind.google/models/gemini-omni/) (demos: hippocampus, protein folding, hand super-zoom, mirror transforms)  
4. [The Verge — I/O 2026](https://www.theverge.com/tech/933552/google-gemini-ai-omni-flash-media-video-io-2026) — world knowledge, 10s clips  
5. Project: `VIDEO_GENERATION.md`, `VIDEO_CONCEPT_CATALOG.md`, `STYLE_BIBLE.md`

**Deprecated:** `veo3.1_best_practices.md`
