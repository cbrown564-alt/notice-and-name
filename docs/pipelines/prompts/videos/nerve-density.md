# nerve-density — Video (scientific-journey, P0)

**Profile:** scientific-journey (micro zoom)  
**Category:** anatomy  
**Asset:** `assets/videos/nerve-density.mp4` (**not yet generated**)  
**Poster / reduce motion:** `assets/images/concepts/illustrations/nerve-density.png`  
**Generator:** Gemini Omni Flash (Google Flow)

## Deck alignment

| Field | Copy |
|-------|------|
| Definition | The clitoral glans contains over 8,000 nerve endings — approximately equal to the entire penis, in a much smaller area. |
| Illustrate caption | Dense neural network in the glans |
| Citation anchor | O'Connell et al. — nerve ending density |

Motion must convey **density and sensitivity**, not horror or clinical gore.

## Global prefix

Warm cream void, coral bioluminescent nerves, continuous **push-in** or **micro-zoom**, 10 s.  
Abstract sculptural glans — not photoreal explicit close-up.

Attach **`illustrations/nerve-density.png`** as `image-0`.

## Journey beats

1. **Meso** — Stylized glans form, matte grain, editorial light.
2. **Micro** — Zoom reveals exponentially denser nerve lattice; light points multiply (constellation metaphor).

## Gemini Omni — starter variants

### Variant A — constellation zoom
```
Continuous micro-zoom into a sculptural bioluminescent clitoral glans on warm cream void.
As the camera pushes in, coral nerve filaments multiply into an impossibly dense living constellation —
conveying ~8000 nerve endings through light density, not numbers on screen.
Soft film grain, scientific warmth, no text, no explicit anatomy photo, 10 seconds, smooth motion.
```

### Variant B — from plate
```
Using image-0 style, animate a slow seamless zoom into the nerve network already suggested in the illustration.
Increase glow density and filament count as we approach micro scale; preserve cream canvas and etching aesthetic.
No labels, no strobe, 10s loop-friendly ending matching start frame energy.
```

### Variant C — sensitivity wave
```
Begin on calm glans surface; zoom reveals pulsing nerve lattice where each pulse is a subtle light ripple (not cardiac monitor).
Density increases toward center. Abstract only. 10s seamless loop.
```

## Iteration prompts

- “Make the micro layer denser but softer — no sharp needles, no pain imagery.”
- “Match image-0 coral exactly; reduce saturation elsewhere.”
- “End frame matches start for seamless loop.”

## Pipeline

```bash
./scripts/transcode-video.sh path/to/nerve-density-source.mp4 assets/videos/nerve-density.mp4
npm run wire-concept-video -- nerve-density
npm run validate-manifest
```

Target: **≤2.5 MB**, H.264, no audio.

## QA checklist

- [ ] Reads as “dense sensitivity” not injury/gore
- [ ] Distinct from **Clitoral Structure** (micro density vs full organ map)
- [ ] No in-image text or body count claims on screen
- [ ] ≤2.5 MB post-transcode
