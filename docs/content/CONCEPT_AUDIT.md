# Concept Audit (Master Tracker)

**Generated:** 2026-06-27
**Regenerate:** `npm run generate-concept-audit`
**Registry:** `data/asset-registry.json` (`npm run sync-registry`)

One row per concept. `format_choice` locked in `data/visual-formats.json`. `thumb_wired` / `video_wired` reflect `vocabulary.ts` require() bindings.

| id | category | review_status | media_policy | format_choice | thumbnail | thumb_wired | illustration | rich_media | video_wired | slides | pathways | copy_reviewed | citations_ok | qa_passed |
|----|----------|---------------|--------------|---------------|-----------|-------------|--------------|------------|-------------|--------|----------|---------------|--------------|-----------|
| angling | technique | approved | required: diagram, image | interactive | ✅ | ✅ | ✅ | interactive (angling) | — | recognize, name, illustrate, understand, explore | expanding-repertoire | ✅ | ✅ | ✅ |
| rocking | technique | approved | required: diagram, image | interactive | ✅ | ✅ | ✅ | interactive (rocking) | — | recognize, name, illustrate, understand, explore | expanding-repertoire | ✅ | ✅ | ✅ |
| shallowing | technique | approved | required: diagram, image | interactive | ✅ | ✅ | ✅ | interactive (shallowing) | — | recognize, name, illustrate, understand, explore | expanding-repertoire | ✅ | ✅ | ✅ |
| pairing | technique | approved | required: diagram, image | interactive | ✅ | ✅ | ✅ | interactive (pairing) | — | recognize, name, illustrate, understand, explore | foundations | ✅ | ✅ | ✅ |
| building | sensation | approved | required: image, video | video | ✅ | ✅ | ✅ | video ✅ building.mp4 | ✅ | recognize, name, illustrate, understand, explore | foundations | ✅ | ✅ | ✅ |
| plateauing | sensation | approved | required: image | video | ✅ | ✅ | ✅ | static only | ☐ | recognize, name, illustrate, understand, explore | solo-exploration | ✅ | ✅ | ✅ |
| edging | sensation | approved | required: image | interactive (planned) | ✅ | ✅ | ✅ | static only | — | recognize, name, illustrate, understand, explore | solo-exploration | ✅ | ✅ | ✅ |
| spreading | sensation | approved | required: image, video | video | ✅ | ✅ | ✅ | video ✅ spreading.mp4 | ✅ | recognize, name, illustrate, understand, explore | solo-exploration | ✅ | ✅ | ✅ |
| pulsing | sensation | approved | required: image | video | ✅ | ✅ | ✅ | static only | ☐ | recognize, name, illustrate, understand, explore | solo-exploration | ✅ | ✅ | ✅ |
| warmup-window | timing | approved | required: image | video | ✅ | ✅ | ✅ | static only | ☐ | recognize, name, illustrate, understand, explore | partner-communication | ✅ | ✅ | ✅ |
| responsive-desire | timing | approved | required: image, video | video | ✅ | ✅ | ✅ | video ✅ responsive-desire.mp4 | ✅ | recognize, name, illustrate, understand, explore | partner-communication | ✅ | ✅ | ✅ |
| spontaneous-desire | timing | approved | required: image | video | ✅ | ✅ | ✅ | static only | ☐ | recognize, name, illustrate, understand, explore | partner-communication | ✅ | ✅ | ✅ |
| golden-trio | timing | approved | required: image | video | ✅ | ✅ | ✅ | static only | ☐ | recognize, name, illustrate, understand, explore | expanding-repertoire | ✅ | ✅ | ✅ |
| spectatoring | psychological | approved | required: image | video | ✅ | ✅ | ✅ | static only | ☐ | recognize, name, illustrate, understand, explore | partner-communication, mindful-presence | ✅ | ✅ | ✅ |
| embodied-presence | psychological | approved | required: image | video | ✅ | ✅ | ✅ | static only | ☐ | recognize, name, illustrate, understand, explore | solo-exploration, mindful-presence | ✅ | ✅ | ✅ |
| non-concordance | psychological | approved | required: image | video | ✅ | ✅ | ✅ | static only | ☐ | recognize, name, illustrate, understand, explore | mindful-presence | ✅ | ✅ | ✅ |
| sexual-self-esteem | psychological | approved | required: image | static | ✅ | ✅ | ✅ | static only | — | recognize, name, illustrate, understand, explore | partner-communication | ✅ | ✅ | ✅ |
| body-appreciation | psychological | approved | required: image | static | ✅ | ✅ | ✅ | static only | — | recognize, name, illustrate, understand, explore | mindful-presence | ✅ | ✅ | ✅ |
| clitoral-structure | anatomy | approved | required: image | video | ✅ | ✅ | ✅ | static only | ☐ | recognize, name, illustrate, understand, explore | foundations | ✅ | ✅ | ✅ |
| nerve-density | anatomy | approved | required: image | video | ✅ | ✅ | ✅ | static only | ☐ | recognize, name, illustrate, understand, explore | foundations | ✅ | ✅ | ✅ |
| clitourethrovaginal | anatomy | approved | required: image | video | ✅ | ✅ | ✅ | static only | ☐ | recognize, name, illustrate, understand, explore | foundations | ✅ | ✅ | ✅ |
| internal-stimulation | anatomy | approved | required: image | video | ✅ | ✅ | ✅ | static only | ☐ | recognize, name, illustrate, understand, explore | foundations | ✅ | ✅ | ✅ |

## Notes

- **Videos:** App bundle uses H.264 MP4 only (`building.mp4`, `responsive-desire.mp4`, `spreading.mp4`). ProRes/MOV sources live in `assets/videos/originals/`.
- **Rocking:** Skia diagram only; no video in repo.
- **Spreading:** `spreading.mp4` wired; illustration at `illustrations/spreading.png`.
- **Pathways:** All 22 concepts appear in ≥1 pathway.
