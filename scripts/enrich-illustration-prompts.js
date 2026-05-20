/**
 * Phase 2.3 — enrich illustration prompt .md files from vocabulary + STYLE_BIBLE template.
 * Preserves existing ## Concept body when present; adds deck alignment and generator refs.
 *
 * Run: node scripts/enrich-illustration-prompts.js
 * Dry run: node scripts/enrich-illustration-prompts.js --dry-run
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const VOCAB_PATH = path.join(ROOT, 'data/vocabulary.ts');
const PROMPT_DIR = path.join(ROOT, 'docs/pipelines/prompts/illustrations');

const GEMINI_CLINICAL = new Set(['spreading', 'warmup-window', 'clitoral-structure']);

const CATEGORY_MODIFIER = {
  technique:
    'Directional motion and contact geometry — show mechanism clearly; abstract phantoms, not explicit sex acts.',
  sensation:
    'Temporal or radiating metaphors — sensation as light, waves, heat, or neural ripples.',
  timing:
    'Time axis, curves, thresholds — resting vs engorged, before/after, or rising intensity.',
  psychological:
    'Mind/body relationship — focus, split, grounding, or self-worth; never pathologize.',
  anatomy:
    'Structure, cross-section, nerve density — anatomically respectful gallery illustration.',
};

function parseConcepts(source) {
  const concepts = [];
  const body = source.slice(source.indexOf('export const concepts'));
  const blockRe = /\{\s*\n\s*id: '([^']+)'([\s\S]*?)\n  \},(?=\s*\n\s*(?:\/\/|{|\]))/g;
  let m;
  while ((m = blockRe.exec(body)) !== null) {
    const id = m[1];
    const block = m[2];
    const category = (block.match(/category: '([^']+)'/) || [])[1] || '';
    const definition = (block.match(/definition:\s*\n?\s*'([^']+)'/) ||
      block.match(/definition:\s*\n?\s*"([^"]+)"/) ||
      [])[1];
    const captionMatch = block.match(
      /type: 'illustrate'[\s\S]*?illustrationCaption: '([^']+)'/
    );
    concepts.push({
      id,
      category,
      definition: definition || '',
      illustrationCaption: captionMatch ? captionMatch[1] : '',
    });
  }
  return concepts;
}

function extractConceptBody(existing) {
  const match = existing.match(/## Concept body\n\n([\s\S]*?)(?=\n## |\n*$)/);
  return match ? match[1].trim() : null;
}

function renderPrompt(concept, existingBody) {
  const { id, category, definition, illustrationCaption } = concept;
  const modifier = CATEGORY_MODIFIER[category] || CATEGORY_MODIFIER.anatomy;
  const generatorNote = GEMINI_CLINICAL.has(id)
    ? '**Primary:** Gemini clinical — [`GEMINI_CLINICAL_PROMPTS.md`](../GEMINI_CLINICAL_PROMPTS.md) (ChatGPT may block). **Alt:** Nano Banana Pro 2 from Concept body below.'
    : '**Primary:** ChatGPT Images 2 — [`CHATGPT_THINKING_PROMPTS.md`](../CHATGPT_THINKING_PROMPTS.md). **Alt:** Nano Banana Pro 2 for anatomy consistency.';

  return `# ${id} — Illustration

**Category:** ${category}  
**Asset:** \`assets/images/concepts/illustrations/${id}.png\`  
**Spec:** 1024×1024 or 3:4 @2x PNG, ≤400 KB post-compress  
**Phase:** 2.3 editorial (enriched from \`data/vocabulary.ts\`)

## Deck alignment

| Field | Copy |
|-------|------|
| Definition | ${definition} |
| Illustrate caption | ${illustrationCaption || '—'} |

The plate should teach the mechanism implied by the caption without duplicating it as in-image text.

## Global prefix

Scientific Warmth: cream canvas \`#F9F5F1\`, bioluminescent coral accents (\`#E8603C\` family), fine etching line work, soft global illumination, pearlescent tissue sheen. **No text, labels, or watermarks in the image.**

**Negative:** text, watermarks, gore, stock-photo poses, cold clinical white, alarm red, explicit sexual acts.

## Category modifier

${modifier}

## Concept body

${existingBody || '_Add composition brief before Phase 3 batch._'}

## Generators

${generatorNote}

Pilot output path: \`assets/images/concepts/illustrations/pilot/${id}-{generator}.png\`

## Review checklist (STYLE_BIBLE §9)

- [ ] Cream canvas, no in-image text
- [ ] Matches category family cue (§2)
- [ ] Glow reads as sensation, not injury
- [ ] Caption mechanism readable without words in image
- [ ] ≤400 KB after \`npm run compress-assets\`
`;
}

function main() {
  const dryRun = process.argv.includes('--dry-run');
  const vocab = fs.readFileSync(VOCAB_PATH, 'utf8');
  const concepts = parseConcepts(vocab);
  let updated = 0;

  for (const concept of concepts) {
    const filePath = path.join(PROMPT_DIR, `${concept.id}.md`);
    if (!fs.existsSync(filePath)) {
      console.warn(`skip (no file): ${concept.id}`);
      continue;
    }
    const existing = fs.readFileSync(filePath, 'utf8');
    const body = extractConceptBody(existing);
    const next = renderPrompt(concept, body);
    if (next === existing) continue;
    if (!dryRun) fs.writeFileSync(filePath, next);
    console.log(`${dryRun ? 'would update' : 'updated'}: ${concept.id}.md`);
    updated++;
  }

  console.log(`\n${updated} illustration prompt(s) ${dryRun ? 'would be' : ''} enriched.`);
}

main();
