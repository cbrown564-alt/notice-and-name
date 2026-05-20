# pulsing — Video (abstract-loop pilot)

**Category:** sensation  
**Asset:** `assets/videos/pulsing.mp4` (**not yet generated**)  
**Poster / reduce motion:** `assets/images/concepts/illustrations/pulsing.png`  
**Wired:** Add `illustrationVideo` on illustrate slide after transcode  
**Status:** P0 — illustration exists (needs regen); video TBD

## Deck alignment

| Field | Copy |
|-------|------|
| Definition | Rhythmic, throbbing, or wave-like quality of pleasure — especially during orgasm. |
| Illustrate caption | Concentric contraction waves in pelvic floor tissue |

Motion must read as **steady rhythmic beat** (~**0.8 s** period per orgasm research), not frantic strobe.

## Global prefix (motion)

Warm cream void `#F9F5F1`, bioluminescent coral accents, soft grain, no text, no bodies. Seamless **10 s** loop containing multiple pulse cycles, static camera.

**Negative:** literal hearts, EKG UI, text, faces, strobe, clinical white, hyper-real anatomy.

## Concept body

Abstract **Pulsing**: rhythmic **throb** or **wave** — sensation that beats like a heartbeat, not a static target. Metaphor options:

1. **Concentric rings** — bioluminescent rings expand and contract from center (~75 BPM feel).
2. **Tissue breath** — soft velvet orb pulses in and out with organic edges.
3. **Wave train** — horizontal waves pass through a glowing band at steady interval.

Each cycle ~**0.8 seconds**; loop must align so first and last frames match.

## Gemini Omni prompts (generate 2–3 initial variants, then iterate in Flow)

### Variant A — concentric
```
Warm cream void. Bioluminescent coral light pulses rhythmically from center—expand and contract every 0.8 seconds, soft organic edges, seamless 10 second loop. No anatomy, no text, cinematic grain, static camera, abstract sensation only.
```

### Variant B — orb
```
Warm cream void. A single soft bioluminescent coral orb at center breathes in and out every 0.8 seconds—velvet texture, gentle glow, seamless 10 second loop. Abstract only, no bodies, no text, static camera, film grain.
```

### Variant C — wave band
```
Warm cream void. A horizontal band of bioluminescent coral light sends gentle waves left to right every 0.8 seconds—soft peaks, seamless 10 second loop. Abstract sensation, no anatomy, no text, static camera.
```

## Pipeline

```bash
./scripts/transcode-video.sh path/to/pulsing-source.mp4 assets/videos/pulsing.mp4
```

Then wire in `data/vocabulary.ts` illustrate slide:

```typescript
illustrationVideo: require('@/assets/videos/pulsing.mp4'),
```

```bash
npm run validate-manifest
npm test
```

Target: **≤1.5 MB**, H.264 MP4, no audio.

## QA checklist

- [ ] Pulse period feels ~0.8 s, not frantic
- [ ] Loop seamless (≥12 cycles in 10 s)
- [ ] Distinct from **Building** (rhythm vs gradual rise) and **Spreading** (pulse vs radiate)
- [ ] Mute default; static poster when reduce motion enabled
- [ ] ≤1.5 MB post-transcode
- [ ] Update `ASSET_MANIFEST.md` + mark approved in `VIDEO_PILOT_BATCH.md`
