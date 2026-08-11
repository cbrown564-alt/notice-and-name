# building — Video (abstract-loop pilot)

**Category:** sensation  
**Asset:** `assets/videos/building.mp4`  
**Poster / reduce motion:** `assets/images/concepts/illustrations/building.png`  
**Wired:** `data/vocabulary.ts` → illustrate slide `illustrationVideo`  
**Status:** Transcoded placeholder (256 KB) — **regenerate** for style-bible alignment

## Deck alignment

| Field | Copy |
|-------|------|
| Definition | Arousal that intensifies gradually rather than arriving all at once. |
| Illustrate caption | Vascular and neural intensity rising over time |

Motion must read as **gradual gathering** — not a sudden flash or strobe.

## Global prefix (motion)

Warm cream void `#F9F5F1`, bioluminescent coral glow (`#E8603C` family), soft film grain, no text, no human bodies, no clinical white. Seamless **8–10 s** loop, 24 fps, static or slow push camera. The primary direction is a simplified educational view of vascular filling and neural activation increasing gradually. Use an abstract ember or rings only when a safe depiction of that process is not possible.

**Negative:** anatomical realism, faces, text overlays, harsh cuts, alarm red, stock wellness gradients, strobe/flicker.

## Primary submission prompt — educational process

```
Create a calm 10-second educational visualization of arousal building
gradually in simplified pelvic tissue. Show a non-explicit cutaway with a small
network of vessels and nerves on a warm cream background. Across the clip,
coral illumination and gentle vascular fullness increase progressively from a
low resting state to a clearly higher-intensity state; neural points join in
gradually rather than flashing all at once. Use one stable view and smooth
continuous change so the bodily process reads before the visual atmosphere.
End with a gentle loop-friendly return, not a sudden reset. No external
genitals, penetration, person, labels, numbers, text, logo, watermark, alarm
red, strobe, harsh cuts, or essential audio. Use the attached plate for palette
and composition only.
```

## Safe fallback prompt — metaphorical motion

Use this only if the provider cannot safely render a simplified educational
cutaway without anatomical invention. Record `fallbackReason` in candidate
metadata.

```
Warm cream void. A small coral ember gathers light gradually over 10 seconds;
nearby soft filaments illuminate one by one until the field is visibly warmer
and fuller, then returns gently for a seamless loop. Static camera, restrained
editorial grain. No body, anatomy claim, text, labels, watermark, strobe,
sudden flash, or essential audio.
```

## Additional fallback variants

Abstract **Building**: arousal as slow **gathering** — a soft ember or bioluminescent wave that **intensifies** across the loop. Metaphor options (pick one per fallback variant):

1. **Ember breath** — small coral ember at center slowly brightens and softens, never strobe.
2. **Concentric warmth** — rings grow warmer and slightly larger, then reset.
3. **Vessel fill** — liquid light rises from bottom of frame like filling with energy.

Motion should feel **anticipatory** and end where it began for a perfect loop.

## Gemini Omni prompts (generate 2–3 initial variants, then iterate in Flow)

### Variant A — ember
```
Warm cream atmospheric void. A single bioluminescent coral-orange ember at center frame slowly intensifies across 10 seconds—soft pulses, no flicker strobe. Ethereal film grain, cinematic 24fps, static camera, seamless loop. Scientific warmth, abstract only, no bodies, no text.
```

### Variant B — rings
```
Warm cream void. Three concentric bioluminescent coral rings at center slowly brighten and expand outward over 10 seconds, then fade back to start—seamless loop. Soft organic edges, film grain, static camera, abstract sensation only, no anatomy, no text.
```

### Variant C — rising fill
```
Warm cream void. Soft bioluminescent coral light fills upward from the bottom of frame like warm liquid over 10 seconds, then drains back down—seamless loop. Cinematic grain, static camera, abstract only, no bodies, no text.
```

## Pipeline

```bash
# After selecting source from Flow export (store originals outside repo)
./scripts/transcode-video.sh path/to/building-source.mp4 assets/videos/building.mp4
npm run validate-manifest
```

Target: **≤1.5 MB**, H.264 MP4, no audio.

## QA checklist

- [ ] Loop seamless at cut point (scrub frame-by-frame)
- [ ] Reads as *gradual increase* on the native concept See page (not plateau or pulse)
- [ ] Mute default; poster shows when reduce motion enabled
- [ ] ≤1.5 MB post-transcode
- [ ] Update `ASSET_MANIFEST.md` + mark approved in `VIDEO_PILOT_BATCH.md`
