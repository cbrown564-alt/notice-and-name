# Video & Motion Pipeline

**Goal:** Repeatable abstract loops for sensation/psychology concepts; MP4-only in app; ≤1.5 MB per file.

See also: `visual_content_strategy.md`, `design/STYLE_BIBLE.md` §7, `veo3.1_best_practices.md` (detailed Veo reference).

---

## When to use video

```
Physical mechanics with variables?  → Interactive Skia (not video)
Temporal / rhythmic / emotional flow? → Abstract motion video
Anatomical structure or comparison? → Rich static illustration
```

**P0 video candidates:** Building, Spreading, Pulsing  
**P1:** Responsive Desire, Spontaneous Desire, Embodied Presence  
**Deprioritize:** Angling, Shallowing, Pairing, Plateauing, charts (static)

**Rocking:** Skia diagram is primary; `rocking.mov` is deprecated.

---

## Tooling

| Stage | Tool | Output |
|-------|------|--------|
| Generation | Veo 3.1 (or successor) | 8 s abstract loop |
| Pickup | Runway / After Effects | Concepts Veo mishandles |
| Transcode | `scripts/transcode-video.sh` | H.264 MP4, no audio |
| QA | Device via `IllustrateSlide` | Loop smooth, muted default |

Store prompts in `docs/pipelines/prompts/videos/{concept-id}.md` (create per concept).

---

## Transcode (required before commit)

```bash
# Single file
./scripts/transcode-video.sh assets/videos/originals/building.mov assets/videos/building.mp4

# Defaults: strip audio, scale to 720p, CRF 28, faststart
```

**Target spec**

| Property | Value |
|----------|-------|
| Codec | H.264 (libx264) |
| Resolution | ≤1280×720 |
| Duration | 8–12 s loop |
| Audio | None (`-an`) |
| Max size | 1.5 MB |

If over budget, raise CRF to 30 or trim in ffmpeg.

---

## Prompt template (abstract sensation)

```
[STYLE BIBLE motion section: warm cream void, bioluminescent glow, no text, no bodies]

Subject: {concept metaphor — e.g. ink diffusing in warm water, radiating rings}

Camera: static or slow push; 24fps cinematic

Motion: seamless loop, {duration}s, gentle acceleration/deceleration

Negative: anatomical realism, faces, text overlays, harsh cuts, clinical white
```

---

## Per-video workflow

1. Write prompt → `pipelines/prompts/videos/{id}.md`
2. Generate 3 variants (different seeds)
3. Select best → transcode to `assets/videos/{id}.mp4`
4. Wire `illustrationVideo` on **illustrate** slide only in `data/vocabulary.ts`
5. Update `ASSET_MANIFEST.md`
6. Test in Expo Go + one release build
7. Delete or move `.mov` originals out of tracked `assets/videos/`

---

## Current inventory (May 2026)

| File | Wired | Action |
|------|-------|--------|
| `spreading.mp4` | ✅ | Review against style bible |
| `building.mov` | ✅ | Transcode → `.mp4`, update require |
| `responsive-desire.mov` | ✅ | Transcode → `.mp4` |
| `rocking.mov` | ❌ removed | Archive / delete |
| `shallowing.mov` | ❌ | Unused (Skia); remove from repo |

---

## Engineering backlog

- [ ] Migrate `expo-av` → `expo-video` (optional)
- [ ] Poster frame from thumbnail while loading
- [ ] Reduced-motion static fallback in `IllustrateSlide`
