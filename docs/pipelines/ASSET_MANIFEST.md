# Asset Manifest

**Living inventory** — update same day as any asset batch merge.  
**Regenerate audit rows:** `node scripts/generate-concept-audit.js`  
**Detailed tracker:** `content/CONCEPT_AUDIT.md`

---

## Concept entries (May 2026)

| concept_id | thumbnail | illustration | rich_media | notes |
|------------|-----------|--------------|------------|-------|
| angling | ✅ thumbnails/angling.png | ✅ illustrations/angling.png | interactive (Skia) | Complete |
| rocking | ✅ | ✅ | interactive (Skia) | Video removed; Skia only |
| shallowing | ✅ | ✅ | interactive (Skia) | Complete |
| pairing | ✅ | ✅ | interactive (PairingDiagram) | Wired Phase 0 |
| building | ✅ | ⚠️ thumb reuse | video building.mov | Transcode → mp4 |
| spreading | ✅ | 🔴 missing dedicated | video spreading.mp4 | Wired Phase 0 |
| responsive-desire | ✅ | ✅ | video responsive-desire.mov | Transcode → mp4 |
| plateauing | ✅ | ✅ | static | Regen chart plate |
| pulsing | ✅ | ⚠️ placeholder | video TBD | P0 gen |
| spontaneous-desire | ✅ | ✅ | video TBD | P1 gen |

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
    generator: veo-3.1
    duration_sec: 10
    bytes: 1682298
    wired: data/vocabulary.ts#slides[illustrate]
    status: review
```

---

## Video files on disk

| path | wired | next step |
|------|-------|-----------|
| assets/videos/spreading.mp4 | ✅ | Style review |
| assets/videos/building.mov | ✅ | `./scripts/transcode-video.sh` → building.mp4 |
| assets/videos/responsive-desire.mov | ✅ | transcode |
| assets/videos/rocking.mov | ❌ | delete after backup |
| assets/videos/shallowing.mov | ❌ | delete (unused) |

---

## Shell assets

See legacy table in `asset_inventory.md` (UI, pathways, explainers) — migrate row-by-row as batches land.

**Future:** `scripts/validate-manifest.js` — fail CI if manifest ≠ filesystem ≠ `require()` paths.
