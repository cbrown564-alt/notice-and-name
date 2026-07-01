# Manual QA Checklist

**Phase:** 1.7 (device pass) → repeat in Phase 4.2 before RC  
**Companion:** [`content/CONCEPT_AUDIT.md`](./content/CONCEPT_AUDIT.md) — set `"concept-id": true` in `data/qa-passed.json` after sign-off, then `npm run generate-concept-audit`

Run on **iOS** (primary) and spot-check **one Android device**. Use a release or preview build when testing video loops and reduced motion.

---

## Pre-flight

- [ ] `npm test` passes
- [ ] `npm run validate-manifest` — no errors (warnings OK for planned videos / oversized legacy PNGs)
- [ ] App launches without redbox after fresh install

---

## App shell

| Area | Check |
|------|-------|
| Onboarding | Welcome → privacy → goals; no layout overflow on small phone |
| Home | Greeting, daily suggestion, resume card, stats readable |
| Library | All / Pathways / Research tabs; category filters; cards load thumbnails |
| Journal | Empty state; create entry |
| Profile (Atelier) | Bento stats, pattern insights, collection shelf |
| Tab bar | Icons + labels; active state uses coral accent |

---

## Concept deck (per concept)

For each of the 22 concepts, open from Library and walk all five slides:

| Step | Pass criteria |
|------|---------------|
| **Recognize** | Copy readable; no truncation bugs |
| **Name** | Title + definition; typography hierarchy clear |
| **Illustrate** | Static / video / Skia loads; caption visible; mute control on video |
| **Understand** | Sources present; scroll if long |
| **Reflect** | Prompt actionable; resonance buttons work |

After deck: set **Tried it** / **Curious** / **Not for me** — confirm Profile updates.

### Format-specific (Illustrate slide)

| Format | Concepts | Check |
|--------|----------|-------|
| **Interactive (Skia)** | angling, rocking, shallowing, pairing | Gesture works; `colors.diagram.*` tokens; feedback label in UI chrome (not in canvas) |
| **Video** | building, spreading, responsive-desire | Loop smooth, muted, poster before play |
| **Video (pending)** | pulsing, spontaneous-desire, embodied-presence | Static illustration fallback until MP4 wired |
| **Static** | All others | Illustration fills frame; cream canvas tone |

#### Interactive diagram device QA (Phase 0)

Run on **iOS + Android** for each of the four technique diagrams:

| Concept | Gesture | Pass criteria |
|---------|---------|---------------|
| **Angling** | Vertical pan | Pelvis tilts; coral glow at posterior tuck (~−10°); light haptic once at sweet spot; label reads "Posterior Tilt" in chrome |
| **Rocking** | Drag wedge | Warmth builds at pubic contact; label updates Near → Contact |
| **Shallowing** | Horizontal pan | Probe glow peaks at introitus; fades deep |
| **Pairing** | Tap external + internal | Bridge glow when both on; light haptic on pair |

**Tokens:** passive `#DCD8D3`, active `#E8603C`, glow `#FFC5B5` — no legacy hard-coded oranges/plums in diagram paths.

**Accessibility:** VoiceOver label = deck `illustrationCaption`; state announcements sparing (threshold only).

**Reduce motion (diagrams):**

| Concept | Static teaching frame |
|---------|----------------------|
| Angling | Posterior tilt sweet spot |
| Rocking | Full contact / grinding |
| Shallowing | Probe at introitus |
| Pairing | Both routes active, bridge visible |

- [ ] All four diagrams pass the table above on iOS
- [ ] All four diagrams pass the table above on Android (Expo)
- [ ] Reduce Motion shows static frames (no auto-loop, gestures disabled)

### Reduced motion

Enable **Reduce Motion** in system settings:

- [ ] Video concepts show **static illustration** instead of autoplay video
- [ ] Interactive diagrams show **static teaching frame** (no auto-loop; gestures disabled)
- [ ] Deck transitions still usable (no nausea / excessive motion)

---

## Category batches (suggested order)

After each batch, run `npm run mark-qa-batch -- <batch>` (e.g. `techniques`), then `npm run generate-concept-audit`:

```bash
npm run mark-qa-batch -- techniques    # after Techniques QA
npm run mark-qa-batch -- status        # progress summary
npm run mark-qa-batch -- list          # batch → concept ids
```

1. **Techniques** — angling, rocking, shallowing, pairing  
2. **Sensations** — building, plateauing, edging, spreading, pulsing  
3. **Timing** — warmup-window, responsive-desire, spontaneous-desire, golden-trio  
4. **Psychological** — spectatoring, embodied-presence, non-concordance, sexual-self-esteem, body-appreciation  
5. **Anatomy** — clitoral-structure, nerve-density, clitourethrovaginal, internal-stimulation  

---

## Pathways & explainers

- [ ] Each pathway opens; hero image loads; concept list matches `data/pathways.ts`
- [ ] All 22 concepts appear in ≥1 pathway
- [ ] Each explainer detail screen loads header image and body copy

---

## Share & communication

- [ ] Share flow from Profile opens native sheet; text formatting readable
- [ ] Communication toolkit: starters, scripts, barriers screens load

---

## Asset quality (visual pass)

During deck walkthrough, note in CONCEPT_AUDIT or batch review:

- [ ] Thumbnail matches illustration family (style bible §6)
- [ ] No embedded text in generated plates
- [ ] Illustration file size ≤400 KB post-compress (flag oversize for Phase 3 regen)
- [ ] Video ≤1.5 MB; no `.mov` in bundle

---

## Sign-off

| Batch | Tester | Date | Device |
|-------|--------|------|--------|
| Techniques | | | |
| Sensations | | | |
| Timing | | | |
| Psychological | | |
| Anatomy | | | |

**Phase 1 exit:** At least one full pass of all 22 concepts documented; P0 visual/copy issues logged for Phase 2–3.
