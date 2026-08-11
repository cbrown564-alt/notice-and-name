# spontaneous-desire — Video (embodied-presence, P1)

**Profile:** embodied-presence (soft loop)  
**Category:** timing  
**Asset:** `assets/videos/spontaneous-desire.mp4` (**not yet generated**)  
**Poster / reduce motion:** `assets/images/concepts/illustrations/spontaneous-desire.png`  
**Wired:** Add `illustrationVideo` on illustrate slide after transcode  
**Generator:** Gemini Omni Flash (Google Flow)

## Deck alignment

| Field | Copy |
|-------|------|
| Definition | Sexual interest that arises on its own, without an external trigger. |
| Illustrate caption | Internal arousal signals rising independently |

Motion must read as **internal spark** — desire igniting from within, not a response to external touch.

## Global prefix

Warm cream void `#F9F5F1`, bioluminescent coral accents, soft grain, no text, no bodies in sexualized framing. Seamless **10 s** soft loop, static or slow push camera.

**Negative:** explicit anatomy, faces, text overlays, alarm red, strobe, clinical white, partner-touch narrative.

Attach **`illustrations/spontaneous-desire.png`** as `image-0` for palette continuity.

## Concept body

**Spontaneous desire** as an **inner signal** that appears without obvious cause — a small ember or pulse that **rises from the core** of the silhouette (abstract, non-explicit). Distinct from **Responsive Desire** (external context → response) and **Building** (gradual intensity over time).

## Gemini Omni — starter variants

### Variant A — core ember
```
Warm cream atmospheric void. A soft abstract feminine torso silhouette (non-explicit, cropped, no face).
A small bioluminescent coral ember at the solar plexus / lower belly slowly brightens and sends gentle pulses outward over 10 seconds—internal spark, no external touch, seamless loop.
Scientific Warmth palette, film grain, static camera, no text.
```

### Variant B — ascending warmth
```
Warm cream void. Abstract internal channel of light rises from pelvis upward like warmth gathering on its own—coral bioluminescence, organic edges, 10 second seamless loop.
No sex act, no partner, no text. Educational editorial mood, static camera.
```

### Variant C — from plate
```
Using image-0 as reference, animate a 10 second seamless loop: internal arousal signals intensify independently—coral glow pulses from center outward, cream canvas, no text, documentary grain.
```

## Pipeline

```bash
./scripts/transcode-video.sh path/to/spontaneous-desire-source.mp4 assets/videos/spontaneous-desire.mp4
node scripts/wire-concept-video.js spontaneous-desire
npm run validate-manifest
```

Target: **≤2.0 MB**, H.264 MP4, no audio.

## QA checklist

- [ ] Reads as *internal* ignition, not responsive to external stimulus
- [ ] Distinct from Responsive Desire and Building loops
- [ ] Loop seamless; mute default; poster when reduce motion
- [ ] ≤2.0 MB post-transcode
- [ ] Update `ASSET_MANIFEST.md` + `VIDEO_PILOT_BATCH.md`
