# clitoral-structure — Video (scientific-journey, P0)

**Profile:** scientific-journey (scale traversal)  
**Category:** anatomy  
**Asset:** `assets/videos/clitoral-structure.mp4` (**not yet generated**)  
**Poster / reduce motion:** `assets/images/concepts/illustrations/clitoral-structure.png`  
**Wired:** Add `illustrationVideo` on illustrate slide; keep `illustrationAsset` as poster fallback  
**Generator:** Gemini Omni Flash (Google Flow)

## Deck alignment

| Field | Copy |
|-------|------|
| Definition | The full clitoral organ is approximately 9cm in size, with internal legs (crura) and bulbs extending inside the body. |
| Illustrate caption | Crura and bulbs wrapping the vaginal canal |
| Citation anchor | O'Connell et al., 2005 — MRI/dissociation mapping |

Motion must teach **scale and internal extent** — not a static plate with shimmer.

## Global prefix

Scientific Warmth: warm cream `#F9F5F1`, bioluminescent coral `#E8603C`, soft grain, **one continuous shot** (~10 s).  
Educational documentary pace — not cold hospital, not explicit pornography.

**Negative:** intercourse depiction, faces in sexualized framing, in-image text, invented organs, alarm red, strobe.

Attach **`illustrations/clitoral-structure.png`** as `image-0` for palette and structural hint.

## Journey beats (single clip)

1. **Macro** — Non-explicit silhouette or abstract pelvis in profile (cropped, dignified).
2. **Meso** — Push through soft tissue to **cross-section**; canal visible.
3. **Micro structure** — Full organ: glans, shaft, **crura wrapping canal**, **bulbs** filling with gentle coral light (arousal metaphor).

## Gemini Omni — starter variants

### Variant A — silhouette push
```
One continuous cinematic educational shot, Scientific Warmth palette (cream void, bioluminescent coral).
Begin with a dignified non-explicit feminine pelvis silhouette in soft side light — no face, no sex act.
Camera slowly pushes through translucent tissue to reveal a cross-section of the full clitoral organ:
glans, internal shaft, crura wrapping the vaginal canal, vestibular bulbs glowing as they fill with light.
Anatomically consistent with modern clitoral MRI research. Warm editorial lighting, soft film grain.
No text, no labels. 10 seconds, smooth dolly only.
```

### Variant B — from approved plate
```
Using image-0 as color and composition reference, animate a seamless 10 second continuous zoom:
start on the illustrated cross-section, gently push deeper to emphasize crura wrapping the canal and bulbs expanding with coral bioluminescent light.
Maintain the exact palette and etching style of image-0; add only smooth camera motion and subtle blood-fill glow.
No new text, no explicit activity, locked-off documentary feel after initial push.
```

### Variant C — scale labels in prompt only (not on screen)
```
Scale traversal explainer: external glans glow → camera travels inward along the shaft → crura branch visibly around the canal → bulbs illuminate at the base.
Abstract-anatomical, not photoreal porn. Cream and coral bioluminescence. One shot, 10s, silent.
```

## Iteration prompts (after first render)

- “Spend more time on the cross-section; crura must clearly wrap the canal before the final zoom.”
- “Bulbs swell slowly with light — no strobe, no pulse alarm.”
- “Remove any text or UI that appeared; keep pure visualization.”
- “Slow the entire dolly by 20%; keep Scientific Warmth grading.”

## Pipeline

```bash
./scripts/transcode-video.sh path/to/clitoral-structure-source.mp4 assets/videos/clitoral-structure.mp4
npm run wire-concept-video -- clitoral-structure
npm run validate-manifest
```

Target: **≤2.5 MB** (scientific-journey tier), H.264, no audio.

## QA checklist

- [ ] Crura + bulbs readable at phone size
- [ ] No explicit sexual act or pornographic framing
- [ ] Matches O'Connell-style internal extent (not “button only” anatomy)
- [ ] No in-image text
- [ ] Poster PNG still works for reduce motion
- [ ] Mark approved in catalog + `ASSET_MANIFEST.md`
