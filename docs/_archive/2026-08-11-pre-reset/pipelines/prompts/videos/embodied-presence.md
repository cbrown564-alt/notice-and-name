# embodied-presence — Video (embodied-presence, P1)

**Profile:** embodied-presence (soft loop)  
**Category:** psychological  
**Asset:** `assets/videos/embodied-presence.mp4` (**not yet generated**)  
**Poster / reduce motion:** `assets/images/concepts/illustrations/embodied-presence.png`  
**Wired:** Add `illustrationVideo` on illustrate slide after transcode  
**Generator:** Gemini Omni Flash (Google Flow)

## Deck alignment

| Field | Copy |
|-------|------|
| Definition | Focused attention on bodily sensations during intimacy — being fully in your body rather than in your head. |
| Illustrate caption | Sensation filling the body outline |

Motion must read as **attention returning to the body** — warmth spreading into form, mind-chatter fading (opposite of Spectatoring).

## Global prefix

Warm cream void `#F9F5F1`, bioluminescent coral + soft sage accents, film grain, no text. Seamless **10 s** loop, slow breathing pace (~4 s inhale feel).

**Negative:** split-screen anxiety UI, faces judging performance, text, strobe, cold clinical blue, explicit sex acts.

Attach **`illustrations/embodied-presence.png`** as `image-0`.

## Concept body

**Embodied presence**: sensation **fills** a dignified body outline from feet upward (or from periphery inward) — like returning home to the body. Cool detached accents (if any) **fade** as coral warmth **grows**. Pair visually with Spectatoring (split attention) but do not copy that plate.

## Gemini Omni — starter variants

### Variant A — fill outline
```
Warm cream void. A soft translucent human body outline (non-explicit, gender-neutral-feminine).
Bioluminescent coral light slowly fills the outline from feet to head over 10 seconds—breathing pace, seamless loop.
Any cool grey edge glow fades as warmth arrives. Scientific Warmth, static camera, no text, no faces.
```

### Variant B — periphery inward
```
Warm cream void. Gentle coral bioluminescence flows inward from the edges of a soft body silhouette until the whole form glows evenly—10 second seamless loop, meditative, no text.
```

### Variant C — from plate
```
Using image-0 as reference, animate sensation filling the body: coral warmth expands through the illustrated outline over 10 seconds, seamless loop, cream canvas, documentary grain, no text.
```

## Pipeline

```bash
./scripts/transcode-video.sh path/to/embodied-presence-source.mp4 assets/videos/embodied-presence.mp4
node scripts/wire-concept-video.js embodied-presence
npm run validate-manifest
```

Target: **≤2.0 MB**, H.264 MP4, no audio.

## QA checklist

- [ ] Feels like *returning to sensation*, not performance monitoring
- [ ] Distinct from Spectatoring (presence vs split attention)
- [ ] Loop seamless; poster fallback; ≤2.0 MB
- [ ] Update `ASSET_MANIFEST.md`
