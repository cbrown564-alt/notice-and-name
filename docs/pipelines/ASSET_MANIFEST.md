# Asset Manifest

**Living inventory** — update same day as any asset batch merge.  
**Machine registry:** [`data/asset-registry.json`](../../data/asset-registry.json) — `npm run sync-registry`  
**Progress dashboard:** `npm run asset-dashboard` (add `--write` for `reports/ASSET_DASHBOARD.md`)  
**Regenerate audit rows:** `npm run generate-concept-audit`  
**Detailed tracker:** `content/CONCEPT_AUDIT.md`  
**Video scope (Omni):** [`VIDEO_CONCEPT_CATALOG.md`](./VIDEO_CONCEPT_CATALOG.md) — anatomy concepts target **scientific-journey** MP4s (≤2.5 MB).

---

## Concept entries (May 2026)

| concept_id | thumbnail | illustration | rich_media | notes |
|------------|-----------|--------------|------------|-------|
| angling | ✅ thumbnails/angling.png | ✅ illustrations/angling.png | interactive (native diagram) | Complete |
| rocking | ✅ | ✅ | interactive (native diagram) | Video removed; native diagram only |
| shallowing | ✅ | ✅ | interactive (native diagram) | Complete |
| pairing | ✅ | ✅ | interactive (PairingDiagram) | Wired Phase 0 |
| edging | ✅ | ✅ | interactive (EdgingDiagram) | Wired Phase 1 |
| building | ✅ | ✅ illustrations/building.png | video **building.mp4** (256 KB) | Compress illustration; video pilot regen optional |
| spreading | ✅ | ✅ illustrations/spreading.png | video **spreading.mp4** (1.6 MB) | P0 pilot regen; compress PNGs |
| responsive-desire | ✅ | ✅ | video **responsive-desire.mp4** (503 KB) | Transcoded May 2026 |
| plateauing | ✅ | ✅ | video TBD | P2 process-explainer (curve animation) |
| pulsing | ✅ | ⚠️ placeholder | video TBD | P0 abstract-loop |
| clitoral-structure | ✅ | ✅ | video TBD | **P0 scientific-journey** |
| nerve-density | ✅ | ✅ | video TBD | **P0 scientific-journey** |
| clitourethrovaginal | ✅ | ✅ | video TBD | P1 journey |
| internal-stimulation | ✅ | ✅ | video TBD | P1 journey |
| warmup-window | ✅ | ✅ | video TBD | P1 process-explainer |
| non-concordance | ✅ | ✅ | video TBD | P1 process-explainer |
| spontaneous-desire | ✅ | ✅ | video TBD | P1 embodied-presence |

*Full 22-row status: see `content/CONCEPT_AUDIT.md`.*

---

## Example manifest entry (YAML schema)

```yaml
- concept_id: spreading
  thumbnail:
    path: assets/images/concepts/thumbnails/spreading.png
    generator: chatgpt-images-2
    prompt_ref: pipelines/prompts/illustrations/spreading-thumb.md
    status: approved
  illustration:
    path: assets/images/concepts/illustrations/spreading.png
    generator: nano-banana-pro-2
    status: pending
  rich_media:
    type: video
    path: assets/videos/spreading.mp4
    generator: gemini-omni-flash
    duration_sec: 10
    bytes: 1682298
    wired: data/vocabulary.ts#slides[illustrate]
    status: review
```

---

## Video files on disk

| path | wired | status |
|------|-------|--------|
| assets/videos/building.mp4 | ✅ | 256 KB, H.264 |
| assets/videos/responsive-desire.mp4 | ✅ | 503 KB, H.264 |
| assets/videos/spreading.mp4 | ✅ | 1.6 MB — style review / optional re-transcode |
| assets/videos/originals/*.mov | — | ProRes sources; not bundled in app |

**Removed from repo:** `rocking.mov`, `shallowing.mov` (unused; native diagram concepts).

---

## Shell assets

| area | path pattern | status |
|------|--------------|--------|
| Tab icons | `assets/images/ui/tab-*.png` | ✅ 4 tabs wired |
| Deck chrome | `assets/images/ui/slide-*.png` | ✅ name, understand, explore |
| Home / empty states | `home-welcome`, `daily-discovery`, `empty-journal`, `empty-collection` | ✅ on disk |
| Category fallbacks | `assets/images/ui/category-*.png` | ✅ 5 categories |
| Profile tools | `assets/images/ui/profile/` | ✅ stats + tools |
| Communicate | `assets/images/ui/communicate/` | ✅ 3 screens |
| Pathways | `assets/images/pathways/*.png` | ✅ 5 pathways |
| Explainers | `assets/images/explainers/*.png` | ✅ 4 articles |

**Validation:** `npm run validate-manifest` — format lock, filesystem, wiring checks (warnings for TBD videos).

**iOS bundle sync:** Canonical concept media lives under `assets/`. Before native builds, run `npm run sync-ios-media` (also runs automatically as an Xcode pre-build step). Generated copies land in `ios/Sources/PleasureVocabularyApp/Resources/media/` and are gitignored.

**Staging policy:** Production assets in `assets/images/concepts/` and `assets/videos/` are always canonical. Do not promote `_staging/` candidates over production.

**Review outcomes (Jul 2026):** `data/media-review-decisions.json`, `data/media-regen-queue.json` — 7 keep, 12 regen plate, 3 regen thumbnail.
