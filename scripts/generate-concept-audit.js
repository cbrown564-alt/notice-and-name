/**
 * Regenerate docs/content/CONCEPT_AUDIT.md from data/vocabulary.ts and filesystem checks.
 * Run: node scripts/generate-concept-audit.js
 */

const fs = require('fs');
const path = require('path');
const {
  ROOT,
  fileExists,
  loadConcepts,
  loadVisualFormats,
  loadCopyReviewedIds,
  loadQaPassedIds,
} = require('./lib/vocab-parse');

const PATHWAYS_PATH = path.join(ROOT, 'data/pathways.ts');
const OUT_PATH = path.join(ROOT, 'docs/content/CONCEPT_AUDIT.md');

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

function citationsOk(block) {
  const hasResearch = /researchBasis:\s*\n\s*'/.test(block);
  const hasSource = /source: '[^']+'/.test(block);
  const hasUnderstand = /type: 'understand'/.test(block);
  return hasResearch && hasSource && hasUnderstand;
}

function wiredCol(exists, wired) {
  if (!exists) return '🔴 missing';
  return wired ? '✅' : '⚠️ disk only';
}

function main() {
  const { formats: FORMAT_BY_ID } = loadVisualFormats();
  const pathways = fs.readFileSync(PATHWAYS_PATH, 'utf8');
  const concepts = loadConcepts();
  const pathwayMap = parsePathwayMembership(pathways);
  const allIds = new Set(concepts.map((c) => c.id));
  const copyReviewed = loadCopyReviewedIds();
  const qaPassed = loadQaPassedIds();

  const lines = [
    '# Concept Audit (Master Tracker)',
    '',
    `**Generated:** ${new Date().toISOString().slice(0, 10)}`,
    '**Regenerate:** `npm run generate-concept-audit`',
    '**Registry:** `data/asset-registry.json` (`npm run sync-registry`)',
    '',
    'One row per concept. `format_choice` locked in `data/visual-formats.json`. `thumb_wired` / `video_wired` reflect `vocabulary.ts` require() bindings.',
    '',
    '| id | category | format_choice | thumbnail | thumb_wired | illustration | rich_media | video_wired | slides | pathways | copy_reviewed | citations_ok | qa_passed |',
    '|----|----------|---------------|-----------|-------------|--------------|------------|-------------|--------|----------|---------------|--------------|-----------|',
  ];

  for (const c of concepts) {
    const { thumb, ill, rich } = assetStatus(c);
    const thumbPath = `assets/images/concepts/thumbnails/${c.id}.png`;
    const thumbExists = fileExists(thumbPath);
    const thumbWired = wiredCol(thumbExists, c.conceptLevelThumb);
    const format = FORMAT_BY_ID[c.id] || 'TBD';
    const videoWired =
      format === 'video' || c.videoFile ? (c.videoFile ? '✅' : '☐') : '—';
    const slides =
      c.slideTypes.length >= 5
        ? c.slideTypes.join(', ')
        : `⚠️ ${c.slideTypes.length}/5 (${c.slideTypes.join(', ')})`;
    const pw = pathwayMap[c.id];
    const pathwaysCol = pw?.length ? pw.join(', ') : '🔴 none';

    const relatedIds = [...c.related.matchAll(/'([^']+)'/g)].map((x) => x[1]);
    const dangling = relatedIds.filter((rid) => !allIds.has(rid));
    const relatedNote = dangling.length ? ` ⚠️ dangling: ${dangling.join(', ')}` : '';

    const copyCol = copyReviewed.has(c.id) ? '✅' : '☐';
    const citationsCol = citationsOk(c.block) ? '✅' : '☐';
    const qaCol = qaPassed.has(c.id) ? '✅' : '☐';
    lines.push(
      `| ${c.id} | ${c.category} | ${format} | ${thumb} | ${thumbWired} | ${ill} | ${rich} | ${videoWired} | ${slides} | ${pathwaysCol} | ${copyCol} | ${citationsCol} | ${qaCol} |`
    );
    if (relatedNote) {
      lines[lines.length - 1] += ` <!--${relatedNote}-->`;
    }
  }

  lines.push('', '## Notes', '');
  lines.push('- **Videos:** App bundle uses H.264 MP4 only (`building.mp4`, `responsive-desire.mp4`, `spreading.mp4`). ProRes/MOV sources live in `assets/videos/originals/`.');
  lines.push('- **Rocking:** Skia diagram only; no video in repo.');
  lines.push('- **Spreading:** `spreading.mp4` wired; illustration at `illustrations/spreading.png`.');
  const orphanPathways = concepts.filter((c) => !pathwayMap[c.id]);
  if (orphanPathways.length) {
    lines.push(`- **Pathways gap:** ${orphanPathways.map((c) => `\`${c.id}\``).join(', ')} not in any pathway.`);
  } else {
    lines.push('- **Pathways:** All 22 concepts appear in ≥1 pathway.');
  }

  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, lines.join('\n') + '\n');
  console.log(`Wrote ${OUT_PATH} (${concepts.length} concepts)`);
}

main();
