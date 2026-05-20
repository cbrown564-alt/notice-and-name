/**
 * Migrate January prompts from docs/asset_generation_prompts.md
 * into docs/pipelines/prompts/illustrations/{id}.md (+ thumb stubs).
 *
 * Skips files that already exist. Run: node scripts/migrate-illustration-prompts.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const LEGACY = path.join(ROOT, 'docs/asset_generation_prompts.md');
const OUT_DIR = path.join(ROOT, 'docs/pipelines/prompts/illustrations');

const TITLE_TO_ID = {
  'Golden Trio': 'golden-trio',
  'Warm-up Window': 'warmup-window',
  Plateauing: 'plateauing',
  Pairing: 'pairing',
  Angling: 'angling',
  Rocking: 'rocking',
  Shallowing: 'shallowing',
  'Clitoral Structure': 'clitoral-structure',
  'Nerve Density': 'nerve-density',
  'CUV Complex': 'clitourethrovaginal',
  'Internal Stimulation': 'internal-stimulation',
  'Non-concordance': 'non-concordance',
  Spectatoring: 'spectatoring',
  'Embodied Presence': 'embodied-presence',
  'Body Appreciation': 'body-appreciation',
  'Sexual Self-Esteem': 'sexual-self-esteem',
  Building: 'building',
  Edging: 'edging',
  Spreading: 'spreading',
  Pulsing: 'pulsing',
  'Responsive Desire': 'responsive-desire',
  'Spontaneous Desire': 'spontaneous-desire',
};

const CATEGORY_BY_ID = {
  angling: 'technique',
  rocking: 'technique',
  shallowing: 'technique',
  pairing: 'technique',
  building: 'sensation',
  plateauing: 'sensation',
  edging: 'sensation',
  spreading: 'sensation',
  pulsing: 'sensation',
  'warmup-window': 'timing',
  'responsive-desire': 'timing',
  'spontaneous-desire': 'timing',
  'golden-trio': 'timing',
  spectatoring: 'psychological',
  'embodied-presence': 'psychological',
  'non-concordance': 'psychological',
  'sexual-self-esteem': 'psychological',
  'body-appreciation': 'psychological',
  'clitoral-structure': 'anatomy',
  'nerve-density': 'anatomy',
  clitourethrovaginal: 'anatomy',
  'internal-stimulation': 'anatomy',
};

const CATEGORY_MODIFIER = {
  technique: 'Directional motion and contact geometry — show mechanism, not explicit sex acts.',
  sensation: 'Temporal or radiating metaphors — sensation as light, waves, or heat.',
  timing: 'Time axis, curves, thresholds — before/after or rising intensity.',
  psychological: 'Mind/body relationship — focus, split, grounding, or self-worth (non-alarmist).',
  anatomy: 'Structure, cross-section, nerve density — anatomical clarity and respect.',
};

function parseLegacyPrompts(source) {
  const sections = [];
  const sectionRe = /^### \d+\. (.+?) \([^)]+\)\s*\n([\s\S]*?)(?=^### |\n## 🎥|\n## ⏳|\Z)/gm;
  let m;
  while ((m = sectionRe.exec(source)) !== null) {
    const title = m[1].trim();
    const body = m[2];
    if (body.includes('**JSON Prompt**')) continue;
    const id = TITLE_TO_ID[title];
    if (!id) continue;
    const promptMatch = body.match(/\*\*Prompt\*\*:\s*\n((?:>.*\n?)+)/);
    if (!promptMatch) continue;
    const conceptBody = promptMatch[1]
      .split('\n')
      .map((line) => line.replace(/^>\s?/, ''))
      .join('\n')
      .trim();
    if (!conceptBody) continue;
    sections.push({ id, title, conceptBody });
  }
  return sections;
}

function illustrationMd(id, category, conceptBody) {
  return `# ${id} — Illustration

**Category:** ${category}  
**Asset:** \`assets/images/concepts/illustrations/${id}.png\`  
**Spec:** 1024×1024 or 3:4 @2x PNG, ≤400 KB post-compress  
**Source:** Migrated from \`docs/asset_generation_prompts.md\` (Phase 1.5)

## Global prefix

Scientific Warmth: cream canvas \`#F9F5F1\`, bioluminescent accents, fine etching, soft global illumination, pearlescent tissue sheen. **No text in image.**

**Negative:** text, watermarks, gore, stock poses, cold clinical white, alarm red.

## Category modifier

${CATEGORY_MODIFIER[category] || ''}

## Concept body

${conceptBody}

## Review checklist (STYLE_BIBLE §9)

- [ ] Cream canvas, no in-image text
- [ ] Matches category family cue
- [ ] ≤400 KB after \`npm run compress-assets\`
`;
}

function thumbMd(id, title) {
  return `# ${id} — Thumbnail

**Asset:** \`assets/images/concepts/thumbnails/${id}.png\`  
**Spec:** 512×512 PNG, ≤80 KB

Simplified glyph of **${title}** plate: centered subject, cream \`#F9F5F1\`, coral bioluminescent accent, minimal detail for library card recognition. **No text.**
`;
}

function main() {
  const source = fs.readFileSync(LEGACY, 'utf8');
  const parsed = parseLegacyPrompts(source);
  const seen = new Set();
  let createdIll = 0;
  let createdThumb = 0;
  let skipped = 0;

  for (const { id, title, conceptBody } of parsed) {
    if (seen.has(id)) continue;
    seen.add(id);

    const category = CATEGORY_BY_ID[id] || 'anatomy';
    const illPath = path.join(OUT_DIR, `${id}.md`);
    const thumbPath = path.join(OUT_DIR, `${id}-thumb.md`);

    if (!fs.existsSync(illPath)) {
      fs.writeFileSync(illPath, illustrationMd(id, category, conceptBody));
      createdIll++;
    } else {
      skipped++;
    }

    if (!fs.existsSync(thumbPath)) {
      fs.writeFileSync(thumbPath, thumbMd(id, title));
      createdThumb++;
    }
  }

  console.log(
    `migrate-illustration-prompts: ${parsed.length} legacy sections, ${seen.size} unique concepts`
  );
  console.log(`  created illustrations: ${createdIll}`);
  console.log(`  created thumbnails: ${createdThumb}`);
  console.log(`  skipped existing illustration files: ${skipped}`);
}

main();
