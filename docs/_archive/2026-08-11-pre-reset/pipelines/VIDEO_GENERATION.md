# Video & Motion Pipeline

**Goal:** Gemini Omni videos for sensation loops, **scientific zoom journeys**, and process explainers; MP4-only in app.

See also: [`VIDEO_CONCEPT_CATALOG.md`](./VIDEO_CONCEPT_CATALOG.md), `visual_content_strategy.md`, `design/STYLE_BIBLE.md` §7, `gemini_omni_best_practices.md`.

---

## When to use video

```
Physical mechanics with variables?     → Interactive native diagram (not video)
Sensation rhythm / radiance?           → video · abstract-loop
Anatomy, nerves, internal structure?   → video · scientific-journey (Omni scale zoom)
Timelines, dual pathways, curves?        → video · process-explainer
Desire / presence / attention?         → video · embodied-presence
Simple metaphor with no motion need?   → Rich static illustration
```

**P0 pilots:** Building, Pulsing (abstract-loop) **and** Clitoral Structure, Nerve Density (scientific-journey)  
**P1:** Spreading, Responsive Desire, anatomy batch, Warm-up Window, Non-concordance, desire/presence  
**Native diagram only:** Angling, Rocking, Shallowing, Pairing

**Rocking:** the native diagram is primary; `rocking.mov` is deprecated.

---

## Tooling

| Stage | Tool | Output |
|-------|------|--------|
| Static reference (optional) | Nano Banana (Gemini image) | Approved illustration PNG |
| Generation + iteration | **Gemini Omni Flash** in [Google Flow](https://flow.google/) | ~10 s clip; multi-turn edits |
| Pickup | Runway / After Effects | Only if Omni cannot hit loop/metaphor |
| Transcode | `scripts/transcode-video.sh` | H.264 MP4, no audio |
| QA | Device via the native concept See page | Loop smooth, muted default |

Store prompts in `docs/pipelines/prompts/videos/{concept-id}.md`.  
**Pilots:** [`prompts/VIDEO_PILOT_BATCH.md`](./prompts/VIDEO_PILOT_BATCH.md) (dual track: sensation + anatomy journey).

---

## Transcode (required before commit)

```bash
# Single file
./scripts/transcode-video.sh assets/videos/originals/building.mov assets/videos/building.mp4

# Defaults: strip audio, scale to 720p, CRF 28, faststart
```

**Target spec (by profile — see `data/visual-formats.json` → `videoProfiles`)**

| Profile | Duration | Loop | Max size |
|---------|----------|------|----------|
| abstract-loop | 8–10 s | Yes | 1.5 MB |
| scientific-journey | ~10 s | Optional | 2.5 MB |
| process-explainer | ~10 s | Rare | 2.5 MB |
| embodied-presence | ~10 s | Soft | 2.0 MB |

| Property | All profiles |
|----------|----------------|
| Codec | H.264 (libx264) |
| Resolution | ≤1280×720 |
| Audio | None (`-an`) |

If over budget, raise CRF to 30–32 or trim in ffmpeg. Journey clips may need higher CRF before rejecting concept.

---

## Prompt templates

See `gemini_omni_best_practices.md` §2 (scale traversal) and per-concept `prompts/videos/{id}.md`.

**Abstract loop:**

```
Using image-0 as style reference: abstract {metaphor} on cream void #F9F5F1, bioluminescent coral glow.
Seamless 10s loop, static camera, no text, no strobe.
```

**Scientific journey:**

```
One continuous 10s shot, Scientific Warmth palette. Journey: {macro} → {cross-section} → {micro detail}.
Accurate to {citation}. Non-explicit, no in-image text. Attach image-0 for palette.
```

---

## Per-video workflow

1. Write prompt → `pipelines/prompts/videos/{id}.md`
2. Generate in Flow (attach illustration as reference when available)
3. Iterate 2–4 turns on best candidate; optionally branch 2–3 initial concepts
4. Select best → transcode to `assets/videos/{id}.mp4`
5. Wire `illustrationVideo` on **illustrate** slide only in `data/vocabulary.ts`
6. Update `ASSET_MANIFEST.md`
7. Test on a phone-sized iOS Simulator and one signed device build
8. Delete or move `.mov` originals out of tracked `assets/videos/`

---

## Current inventory (May 2026)

| File | Wired | Action |
|------|-------|--------|
| `spreading.mp4` | ✅ | Review against style bible |
| `building.mp4` | ✅ | 256 KB — wired |
| `responsive-desire.mp4` | ✅ | 503 KB — wired |
| `spreading.mp4` | ✅ | 1.6 MB — style review optional |
| `rocking.mov` | ❌ | Removed (native diagram only) |
| `shallowing.mov` | ❌ | Removed (native diagram only) |
| `originals/*.mov` | — | ProRes sources; not in app bundle |

---

## Engineering backlog

- [ ] Migrate `expo-av` → `expo-video` (optional)
- [ ] Poster frame from thumbnail while loading
- [ ] Reduce Motion static fallback on the native concept See page
