# Notice & Name — Media Gaps

**Date:** 2026-08-12

**Scope:** Shipping content in `content/v2/bundles/v2-full.bundle.json` (22 approved concepts).
**Goal:** Rank the worst See-page gaps to fix first — not full video coverage.

Related: [`LAUNCH_GAPS.md`](./LAUNCH_GAPS.md), [`CURRENT_STATE.md`](./CURRENT_STATE.md), archived regen plan at `docs/_archive/2026-08-11-pre-reset/pipelines/MEDIA_REGEN_PLAN.md`.

---

## 1. Summary counts (22 concepts)

| Slot | Bundle | Disk | iOS sync | Notes |
|------|--------|------|----------|-------|
| Illustration | 22 | 22 PNG | 22 | assets/images/concepts/illustrations/<id>.png |
| Thumbnail | 22 | 22 PNG | 22 | loaded by concept id, not separate media IDs |
| Video | 4 | 4 MP4 | 4 | building, spreading, pulsing, responsive-desire |
| Native diagram | 5 | n/a | n/a | angling, rocking, shallowing, pairing, edging |
| Explainer heroes | 4 | 4 PNG | 4 | paths resolve |

Bundle media catalog: 35 items (diagram 5, image 26, video 4).
Broken paths: 0 — all mediaIds and file paths resolve.
sync-ios-media copies illustrations, thumbnails, top-level videos/*.mp4, explainers; currently in sync. Does not copy assets/videos/originals/.

### Effective See page

SeePageBody priority (ConceptPages.swift): video (if present + Reduce Motion off) -> native diagram -> illustration -> MediaPlaceholderCard.

| Effective See | Count | Concepts |
|---------------|------:|----------|
| Native diagram | 5 | angling, rocking, shallowing, pairing, edging |
| Video | 4 | building, spreading, pulsing, responsive-desire |
| Illustration only | 13 | plateauing, warmup-window, spontaneous-desire, golden-trio, spectatoring, embodied-presence, non-concordance, sexual-self-esteem, body-appreciation, clitoral-structure, nerve-density, clitourethrovaginal, internal-stimulation |
| Missing placeholder | 0 | — |

Launch risk is not empty See pages. It is weak or off-brief stills that are the See moment for 13 concepts (and reduce-motion fallbacks for the video set).

---

## 2. How missing media behaves

| Layer | Behavior |
|-------|----------|
| Bundle validation | ContentBundleLoader fails if mediaIds / block mediaId point at unknown catalog ids. |
| Illustration load | BundledMedia.image reads basename from media/illustrations/; load failure -> MediaPlaceholderCard (SF Symbol + caption). Paths never shown. |
| Thumbnail | Library/cover uses media/thumbnails/<conceptId>.png; missing -> UI omits image (no crash). |
| Video | Optional by file presence; if absent, falls through to diagram/illustration. |
| Unknown diagram id | Same framed placeholder as images. |
| Reduce Motion | Skips video; uses diagram or illustration / reducedMotionFallback plate. |

Implication: shipping a bad plate is worse than shipping nothing — the app shows a confusing See image instead of a placeholder.

---

## 3. Editorial / launch notes (media)

- LAUNCH_GAPS / PLAN: Phase B still lists worst media gaps only; full video coverage is later / good-enough.
- MEDIA_POLICY (archived): Technique needs diagram+image; building / spreading / responsive-desire need image+video; else image-required. Current bundle meets required kinds.
- media-review-decisions (2026-07-01): 9 plates marked regen; video masters deleted for angling/rocking (spreading historically delete but wired MP4 still ships); keep-masters for building / responsive-desire / shallowing originals.
- media-regen-queue remaining plate regen: pulsing, spreading (spontaneous-desire + optional thumbs angling / body-appreciation / clitourethrovaginal landed in batch2; still pending taste).
- **Batch 3 style-coherence regen 2026-08-12 (my-generator):** internal-stimulation, angling, rocking, shallowing, clitourethrovaginal, body-appreciation, golden-trio — illustration + thumbnail each, aligned to Scientific Warmth neural lane (anchors: responsive-desire / building / nerve-density). Olds archived under `assets/images/concepts/_archive/2026-08-12-batch3-old/`.
- **Batch 4 unify regen 2026-08-12 (my-generator):** pairing, spreading, building, clitoral-structure, nerve-density, pulsing, non-concordance — illustration + thumbnail each, lush neural-metaphor lane to match batch3. Olds in `_archive/2026-08-12-batch4-old/`.
- **Explainer heroes regen 2026-08-12 (my-generator):** orgasm-gap, anatomy-101, mind-body, communication-science-101 — Scientific Warmth, no burned-in titles; olds in `assets/images/explainers/_archive/2026-08-12-pre-warmth/`.
- **Batch 1 plates generated 2026-08-11 (my-generator):** spectatoring, golden-trio, plateauing, sexual-self-esteem, warmup-window, embodied-presence — illustration + thumbnail each. Synced to iOS. **Pending taste review vs GPT-Image 2**; old PNGs archived under `assets/images/concepts/_archive/2026-08-11-batch1-old/`.
- **Batch 2 landed 2026-08-12:** spontaneous-desire illustration + thumb (my-generator; pending taste vs GPT-Image 2); angling / body-appreciation / clitourethrovaginal thumbs regenerated from kept plates (512 crop). Synced to iOS. Old files under `assets/images/concepts/_archive/2026-08-12-batch2-old/`.
- Angling illustration: registry promotionDecision rejected — in-image titles/labels (See uses native diagram; fallback/poster problem).
- Media sprint (Aug 2026): Gemini video handoff closed; building candidate in staging unpromoted; clitoral-structure + nerve-density video jobs unfulfilled. Staging is not shipping.

Preview set for StoreKit (Responsive Desire, Angling, Non-concordance) is media-healthy. Gaps concentrate in the deeper vocabulary deck.

---

## 4. Ranked gap list

Priority = how much it hurts the See moment (sole visual x wrong metaphor / style drift / policy friction), not missing video.

### P0 — fix first (See = weak still only)

| # | Concept | Missing / weak | Why it hurts |
|---|---------|----------------|--------------|
| 1 | spectatoring | **Generated (my-generator) — pending taste review** (was: ethereal thinker + floating head) | Sole See visual for a core psychological concept; reads as generic introspection, not split between touch and inner commentary. |
| 2 | golden-trio | **Generated (my-generator) — pending taste review** (was: parchment Venn + notebook stains/scribbles) | Sole See visual; does not teach hands / mouth / penetration as layered options. |
| 3 | plateauing | **Generated (my-generator) — pending taste review** (was: male sagittal + battery + chart chrome) | Sole See visual; wrong body context; UI chrome fights no-labels style rule. |
| 4 | sexual-self-esteem | **Generated (my-generator) — pending taste review** (was: glowing heart/lungs torso) | Sole See visual; generic wellness anatomy, not belonging in your own desire. |
| 5 | warmup-window | **Generated (my-generator) — pending taste review** (was: explicit genital engraving) | Sole See visual; concept is timing before touch gets specific, but plate is graphic anatomy — App Store / model-regen friction and off-message. |
| 6 | embodied-presence | **Generated (my-generator) — pending taste review** (was: golden fluid pouring through pelvis) | Sole See visual; muddled vs spectatoring pair; ethereal drift from Scientific Warmth anchors. |
| 7 | spontaneous-desire | **Generated (my-generator) — pending taste review** (was: spore/emergence abstract) | Sole See visual; pretty but weak teaching vs responsive-desire plate/video. |

### P1 — next (cards / fallbacks more than primary See)

| Concept | Gap | Why |
|---------|-----|-----|
| angling | Illustration has embedded labels; **thumb regenerated 2026-08-12** (512 crop from kept plate; was ~24 KB) | See uses native diagram (OK). Plate is still reduce-motion/poster fallback with in-image labels. |
| body-appreciation | **Thumb regenerated 2026-08-12** (512 crop from kept plate; was ~16 KB) | Plate kept; library card gap closed pending device QA. |
| clitourethrovaginal | **Thumb regenerated 2026-08-12** (512 crop from kept plate; was ~17 KB) | Plate kept; anatomy card thumb refreshed pending device QA. |
| pulsing, spreading | Plates marked regen | Primary See is video (OK); plates matter for Reduce Motion + poster. Prefer still regen. |
| clitoral-structure, nerve-density | Optional video missing (Gemini jobs failed) | Kept plates OK; video optional — do not block launch. |
| Orphan videos/originals/shallowing.mp4 | Not synced | Intentional: See uses native diagram. |

### P2 / later (ok for launch)

- Keep plates as style anchors: building, clitoral-structure, edging, internal-stimulation, non-concordance, pairing, responsive-desire (+ rocking / shallowing / nerve-density).
- Full video coverage for the other 18 concepts.
- Explainer / pathway / shell UI art.

---

## 5. Recommended first generation batch (stills)

Prefer stills. Required videos already ship.

**Status 2026-08-12:** Batch 1 **generated** via my-generator (6 plates + thumbs). Batch 2 **landed**: spontaneous-desire plate + thumb (my-generator) and thumbnail-only regen for angling / body-appreciation / clitourethrovaginal (512 crop from kept plates). Assets under `assets/images/concepts/{illustrations,thumbnails}/`; iOS synced (`node scripts/sync-ios-media.js --check` OK). Old batch2 files in `_archive/2026-08-12-batch2-old/`. **Pending Conor taste review vs GPT-Image 2** before treating batch1/batch2 plates as final.

Batch targets (illustration + thumbnail each):

| Order | Asset | Anchor plate | Teaching job |
|------:|-------|--------------|--------------|
| 1 | spectatoring illustration (+ thumb) | non-concordance.png | Split attention: body sensation vs observing/judging mind. |
| 2 | golden-trio illustration (+ thumb) | responsive-desire.png | Three layered touch modes as equal options — not a Venn doodle. |
| 3 | plateauing illustration (+ thumb) | building.png | Arousal holding altitude; glow sustained, not climbing; no chrome icons. |
| 4 | sexual-self-esteem illustration (+ thumb) | non-concordance.png | Belonging / agency in desire; not cardiopulmonary wellness. |
| 5 | warmup-window illustration (+ thumb) | responsive-desire.png | Warmth gathering before touch focuses — abstract timing metaphor. |
| 6 | embodied-presence illustration (+ thumb) | non-concordance.png | Settled fullness / quiet commentary; pair-contrast with new spectatoring. |

Optional 7th/8th: ~~spontaneous-desire plate (+ thumb); then thumbnail-only pass for angling / body-appreciation / clitourethrovaginal~~ — **done in batch2 (2026-08-12)**.

Defer: new anatomy videos; regenerating keep anchors; promoting staging media-sprint.

After delivery: ~~replace illustration/thumbnail PNGs, sync-ios-media~~ (done for batch1 + batch2) — still: compress-assets if needed, registry sync, device QA, taste review vs GPT-Image 2.

---

## 6. Prompt guidance (GPT-Image 2 / Gemini Omni)

Use for every still in the batch. Goal: abstract / educational / policy-safe. No graphic sex acts; no pornographic framing.

### Global positive prefix

```text
Scientific Warmth / Medical Luxury educational illustration for a calm vocabulary app.
Warm cream canvas #F9F5F1, soft global illumination, pearlescent sheen.
Bioluminescent coral-gold glow (#E8603C, #FFC5B5) for nerves, arousal, attention — never alarm red.
Fine etching / cross-hatch for structure where relevant; soft diagrammatic metaphor elsewhere.
Calm, authoritative, non-judgmental. Anatomically respectful, non-explicit.
NO text, labels, numbers, arrows-as-UI, watermarks, logos, or chart chrome in the image.
```

### Hard negatives / policy rails

```text
No sexual acts, penetration in progress, porn posing, or erotic photography.
No graphic close-up genitalia as the hero subject (use silhouette, soft cross-section,
simplified tissue glyphs, nature/texture, or light metaphors instead).
No gore, blood, needles, pain, alarm red, strobe.
No embedded typography, figure labels, watermarks, UI icons, batteries, or chart junk.
No dark moody wellness stock look; no pure clinical cold white; no plastic 3D skin.
```

### Safe metaphor toolbox (preferred)

- Light filling / holding / splitting (presence vs spectatoring)
- Warmth spreading before focus (warmup window)
- Layered touch glyphs without bodies mid-act (golden trio)
- Altitude / plateau of glow (plateauing)
- Mind-body tracks (cool #7A7AFF accent sparingly for mind elsewhere)
- Silhouette, translucent structure, botanical/neural texture when anatomy is sensitive

### Per-slot one-liners (paste after prefix)

1. spectatoring — One calm figure: sensation in the body vs a detached observing mind; cool accent for the commentary track; not a floating portrait collage.
2. golden-trio — Three equal soft glyphs for hand / mouth / penetrative contact as layered options around a warm center; cream canvas; no parchment stains or handwriting.
3. plateauing — Same sensation language as Building, but intensity holding a steady high plateau; no gendered genital hero shot; no battery/graph icons.
4. sexual-self-esteem — Embodied belonging and quiet confidence in desire; warm glow centered in the self; avoid cardiopulmonary wellness poster.
5. warmup-window — Soft whole-body warmth gathering over a short time window before touch becomes specific; abstract timing/atmosphere.
6. embodied-presence — Heat and pressure filling the body, commentary gone quiet; settled inward glow (contrast with spectatoring); no draining liquid exiting the pelvis.

### Attach as style references

- Psychological: assets/images/concepts/illustrations/non-concordance.png
- Sensation: assets/images/concepts/illustrations/building.png
- Timing: assets/images/concepts/illustrations/responsive-desire.png

Archived per-concept prompt drafts: docs/_archive/2026-08-11-pre-reset/pipelines/prompts/illustrations/.

---

## 7. Quick inventory cheat sheet

```
See = DIAGRAM     angling rocking shallowing pairing edging
See = VIDEO       building spreading pulsing responsive-desire
See = ILLUSTRATION (keep)   non-concordance body-appreciation
                            clitoral-structure nerve-density
                            clitourethrovaginal internal-stimulation
See = ILLUSTRATION (batch1 generated, pending taste)  spectatoring golden-trio plateauing
                            sexual-self-esteem warmup-window embodied-presence
See = ILLUSTRATION (batch2 generated, pending taste)  spontaneous-desire
```

