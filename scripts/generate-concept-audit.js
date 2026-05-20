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

const FORMAT_LOCK_PATH = path.join(ROOT, 'data/visual-formats.json');
const COPY_REVIEW_PATH = path.join(ROOT, 'data/copy-review.json');
const QA_PASSED_PATH = path.join(ROOT, 'data/qa-passed.json');

function loadCopyReviewedIds() {
  if (!fs.existsSync(COPY_REVIEW_PATH)) return new Set();
  const raw = JSON.parse(fs.readFileSync(COPY_REVIEW_PATH, 'utf8'));
  return new Set(raw.concepts || []);
}

function loadQaPassedIds() {
  if (!fs.existsSync(QA_PASSED_PATH)) return new Set();
  const raw = JSON.parse(fs.readFileSync(QA_PASSED_PATH, 'utf8'));
  const passed = raw.passed || {};
  return new Set(Object.keys(passed).filter((id) => passed[id] === true));
}

function loadFormatById() {
  const raw = JSON.parse(fs.readFileSync(FORMAT_LOCK_PATH, 'utf8'));
  return raw.formats;
}

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
      block,
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

function citationsOk(block) {
  const hasResearch = /researchBasis:\s*\n\s*'/.test(block);
  const hasSource = /source: '[^']+'/.test(block);
  const hasUnderstand = /type: 'understand'/.test(block);
  return hasResearch && hasSource && hasUnderstand;
}

function main() {
  const FORMAT_BY_ID = loadFormatById();
  const vocab = fs.readFileSync(VOCAB_PATH, 'utf8');
  const pathways = fs.readFileSync(PATHWAYS_PATH, 'utf8');
  const concepts = parseConcepts(vocab);
  const pathwayMap = parsePathwayMembership(pathways);
  const allIds = new Set(concepts.map((c) => c.id));
  const copyReviewed = loadCopyReviewedIds();
  const qaPassed = loadQaPassedIds();

  const lines = [
    '# Concept Audit (Master Tracker)',
    '',
    `**Generated:** ${new Date().toISOString().slice(0, 10)}`,
    '**Regenerate:** `node scripts/generate-concept-audit.js`',
    '',
    'One row per concept. `format_choice` locked in `data/visual-formats.json` (Phase 1.2). Update QA columns as Phase 2–4 progress.',
    '',
    '| id | category | format_choice | thumbnail | illustration | rich_media | slides | pathways | copy_reviewed | citations_ok | qa_passed |',
    '|----|----------|---------------|-----------|--------------|------------|--------|----------|---------------|--------------|-----------|',
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

    const copyCol = copyReviewed.has(c.id) ? '✅' : '☐';
    const citationsCol = citationsOk(c.block) ? '✅' : '☐';
    const qaCol = qaPassed.has(c.id) ? '✅' : '☐';
    lines.push(
      `| ${c.id} | ${c.category} | ${format} | ${thumb} | ${ill} | ${rich} | ${slides} | ${pathwaysCol} | ${copyCol} | ${citationsCol} | ${qaCol} |${relatedNote ? '' : ''}`
    );
    if (relatedNote) {
      lines[lines.length - 1] += ` <!--${relatedNote}-->`;
    }
  }

  lines.push('', '## Notes', '');
  lines.push('- **Videos:** App bundle uses H.264 MP4 only (`building.mp4`, `responsive-desire.mp4`, `spreading.mp4`). ProRes/MOV sources live in `assets/videos/originals/`.');
  lines.push('- **Rocking:** Skia diagram only; no video in repo.');
  lines.push('- **Spreading:** `spreading.mp4` wired; illustration at `illustrations/spreading.png` (compress before ship).');
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
