/**
 * Regenerate docs/content/CONCEPT_AUDIT.md from data/vocabulary.ts and filesystem checks.
 * Run: node scripts/generate-concept-audit.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const VOCAB_PATH = path.join(ROOT, 'data/vocabulary.ts');
const PATHWAYS_PATH = path.join(ROOT, 'data/pathways.ts');
const OUT_PATH = path.join(ROOT, 'docs/content/CONCEPT_AUDIT.md');

const FORMAT_BY_ID = {
  angling: 'interactive',
  rocking: 'interactive',
  shallowing: 'interactive',
  pairing: 'interactive',
  building: 'video',
  plateauing: 'static',
  edging: 'interactive (planned)',
  spreading: 'video',
  pulsing: 'video',
  'warmup-window': 'static',
  'responsive-desire': 'video',
  'spontaneous-desire': 'video',
  'golden-trio': 'static',
  spectatoring: 'interactive (planned)',
  'embodied-presence': 'video',
  'non-concordance': 'static',
  'sexual-self-esteem': 'static',
  'body-appreciation': 'static',
  'clitoral-structure': 'static',
  'nerve-density': 'static',
  clitourethrovaginal: 'static',
  'internal-stimulation': 'static',
};

function fileExists(rel) {
  return fs.existsSync(path.join(ROOT, rel));
}

function parseConcepts(source) {
  const concepts = [];
  // Match concept closing `  },` only (2 spaces), not slide `      },`
  const blockRe = /\{\s*\n\s*id: '([^']+)'([\s\S]*?)\n  \},(?=\s*\n\s*(?:\/\/|{|\]))/g;
  let m;
  const body = source.slice(source.indexOf('export const concepts'));
  while ((m = blockRe.exec(body)) !== null) {
    const id = m[1];
    const block = m[2];
    const category = (block.match(/category: '([^']+)'/) || [])[1] || '';
    const diagramType = (block.match(/diagramType: '([^']+)'/) || [])[1] || '';
    const hasThumb = /thumbnails\/[^']+\.png/.test(block);
    const illMatch = block.match(/illustrations\/([^']+)\.png/);
    const thumbIllMatch = block.match(/thumbnails\/([^']+)\.png/);
    const videoMatch = block.match(/videos\/([^']+)\.(mov|mp4)/);
    const slideTypes = [...block.matchAll(/type: '([^']+)'/g)].map((x) => x[1]);
    const related = (block.match(/relatedConcepts: \[([^\]]*)\]/) || [])[1] || '';
    concepts.push({
      id,
      category,
      diagramType,
      hasThumb,
      illustrationId: illMatch ? illMatch[1] : thumbIllMatch ? thumbIllMatch[1] : null,
      videoFile: videoMatch ? `${videoMatch[1]}.${videoMatch[2]}` : null,
      slideTypes,
      related,
    });
  }
  return concepts;
}

function parsePathwayMembership(pathwaysSource) {
  const map = {};
  const pathwayRe = /id: '([^']+)'[\s\S]*?conceptIds: \[([^\]]+)\]/g;
  let m;
  while ((m = pathwayRe.exec(pathwaysSource)) !== null) {
    const pathwayId = m[1];
    const ids = [...m[2].matchAll(/'([^']+)'/g)].map((x) => x[1]);
    for (const id of ids) {
      if (!map[id]) map[id] = [];
      map[id].push(pathwayId);
    }
  }
  return map;
}

function assetStatus(concept) {
  const thumbPath = `assets/images/concepts/thumbnails/${concept.id}.png`;
  const illPath = concept.illustrationId
    ? `assets/images/concepts/illustrations/${concept.illustrationId}.png`
    : `assets/images/concepts/illustrations/${concept.id}.png`;
  const thumb = fileExists(thumbPath) ? '✅' : '🔴 missing';
  const ill = fileExists(illPath) ? '✅' : concept.illustrationId === concept.id && !fileExists(illPath) ? '🔴 missing' : '⚠️ thumb only';
  let rich = '—';
  if (concept.diagramType && concept.diagramType !== 'none') {
    rich = `interactive (${concept.diagramType})`;
  } else if (concept.videoFile) {
    const vp = `assets/videos/${concept.videoFile}`;
    rich = fileExists(vp) ? `video ✅ ${concept.videoFile}` : `video 🔴 ${concept.videoFile}`;
  } else {
    rich = 'static only';
  }
  return { thumb, ill, rich };
}

function main() {
  const vocab = fs.readFileSync(VOCAB_PATH, 'utf8');
  const pathways = fs.readFileSync(PATHWAYS_PATH, 'utf8');
  const concepts = parseConcepts(vocab);
  const pathwayMap = parsePathwayMembership(pathways);
  const allIds = new Set(concepts.map((c) => c.id));

  const lines = [
    '# Concept Audit (Master Tracker)',
    '',
    `**Generated:** ${new Date().toISOString().slice(0, 10)}`,
    '**Regenerate:** `node scripts/generate-concept-audit.js`',
    '',
    'One row per concept. Update `format_choice` and QA columns as Phase 1–4 progress.',
    '',
    '| id | category | format_choice | thumbnail | illustration | rich_media | slides | pathways | copy_reviewed | qa_passed |',
    '|----|----------|---------------|-----------|--------------|------------|--------|----------|---------------|-----------|',
  ];

  for (const c of concepts) {
    const { thumb, ill, rich } = assetStatus(c);
    const slides =
      c.slideTypes.length >= 5
        ? c.slideTypes.join(', ')
        : `⚠️ ${c.slideTypes.length}/5 (${c.slideTypes.join(', ')})`;
    const pw = pathwayMap[c.id];
    const pathwaysCol = pw?.length ? pw.join(', ') : '🔴 none';
    const format = FORMAT_BY_ID[c.id] || 'TBD';

  // Validate related concept ids
    const relatedIds = [...c.related.matchAll(/'([^']+)'/g)].map((x) => x[1]);
    const dangling = relatedIds.filter((rid) => !allIds.has(rid));
    const relatedNote = dangling.length ? ` ⚠️ dangling: ${dangling.join(', ')}` : '';

    lines.push(
      `| ${c.id} | ${c.category} | ${format} | ${thumb} | ${ill} | ${rich} | ${slides} | ${pathwaysCol} | ☐ | ☐ |${relatedNote ? '' : ''}`
    );
    if (relatedNote) {
      lines[lines.length - 1] += ` <!--${relatedNote}-->`;
    }
  }

  lines.push('', '## Notes', '');
  lines.push('- **Pathways gap:** `spontaneous-desire`, `clitourethrovaginal`, `internal-stimulation` are not in any pathway yet.');
  lines.push('- **Rocking:** Skia diagram is primary; `rocking.mov` deprecated (remove after batch transcode).');
  lines.push('- **Spreading:** `spreading.mp4` wired; dedicated illustration PNG still needed.');

  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, lines.join('\n') + '\n');
  console.log(`Wrote ${OUT_PATH} (${concepts.length} concepts)`);
}

main();
