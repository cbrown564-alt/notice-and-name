/**
 * Shared vocabulary / asset parsing for manifest scripts.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '../..');

const PATHS = {
  vocab: path.join(ROOT, 'data/vocabulary.ts'),
  formats: path.join(ROOT, 'data/visual-formats.json'),
  registry: path.join(ROOT, 'data/asset-registry.json'),
  copyReview: path.join(ROOT, 'data/copy-review.json'),
  qaPassed: path.join(ROOT, 'data/qa-passed.json'),
};

const SIZE_BUDGET = {
  illustration: 400 * 1024,
  thumbnail: 80 * 1024,
  videoAbstract: 1.5 * 1024 * 1024,
  videoJourney: 2.5 * 1024 * 1024,
  videoPresence: 2.0 * 1024 * 1024,
};

const VIDEO_TIER_BUDGET = {
  'abstract-loop': SIZE_BUDGET.videoAbstract,
  'scientific-journey': SIZE_BUDGET.videoJourney,
  'process-explainer': SIZE_BUDGET.videoJourney,
  'embodied-presence': SIZE_BUDGET.videoPresence,
};

function fileExists(rel) {
  return fs.existsSync(path.join(ROOT, rel));
}

function fileBytes(rel) {
  const p = path.join(ROOT, rel);
  if (!fs.existsSync(p)) return null;
  return fs.statSync(p).size;
}

function videoBudgetForConcept(conceptId, videoProfiles) {
  const tier = videoProfiles?.[conceptId]?.tier;
  return VIDEO_TIER_BUDGET[tier] || SIZE_BUDGET.videoAbstract;
}

function parseConcepts(source) {
  const concepts = [];
  const blockRe = /\{\s*\n\s*id: '([^']+)'([\s\S]*?)\n  \},(?=\s*\n\s*(?:\/\/|{|\]))/g;
  const body = source.slice(source.indexOf('export const concepts'));
  let m;
  while ((m = blockRe.exec(body)) !== null) {
    const id = m[1];
    const block = m[2];
    const category = (block.match(/category: '([^']+)'/) || [])[1] || '';
    const diagramType = (block.match(/diagramType: '([^']+)'/) || [])[1] || '';
    const conceptLevelThumb = /\n\s*thumbnail: require\('@\/assets\/images\/concepts\/thumbnails\//.test(
      block
    );
    const illMatch = block.match(/illustrations\/([^']+)\.png/);
    const videoMatch = block.match(/videos\/([^']+)\.(mov|mp4)/);
    const slideTypes = [...block.matchAll(/type: '([^']+)'/g)].map((x) => x[1]);
    const related = (block.match(/relatedConcepts: \[([^\]]*)\]/) || [])[1] || '';
    const thumbOnIllustrate = /illustrate[\s\S]*?thumbnails\//.test(block);

    concepts.push({
      id,
      category,
      diagramType,
      conceptLevelThumb,
      illustrationId: illMatch ? illMatch[1] : null,
      videoFile: videoMatch ? `${videoMatch[1]}.${videoMatch[2]}` : null,
      slideTypes,
      related,
      block,
      thumbOnIllustrate,
    });
  }
  return concepts;
}

function loadConcepts() {
  const source = fs.readFileSync(PATHS.vocab, 'utf8');
  return parseConcepts(source);
}

function loadVisualFormats() {
  const raw = JSON.parse(fs.readFileSync(PATHS.formats, 'utf8'));
  return { formats: raw.formats, videoProfiles: raw.videoProfiles || {}, meta: raw._meta || {} };
}

function loadCopyReviewedIds() {
  if (!fs.existsSync(PATHS.copyReview)) return new Set();
  const raw = JSON.parse(fs.readFileSync(PATHS.copyReview, 'utf8'));
  return new Set(raw.concepts || []);
}

function loadQaPassedIds() {
  if (!fs.existsSync(PATHS.qaPassed)) return new Set();
  const raw = JSON.parse(fs.readFileSync(PATHS.qaPassed, 'utf8'));
  const passed = raw.passed || {};
  return new Set(Object.keys(passed).filter((id) => passed[id] === true));
}

function assetPathFor(conceptId, tier) {
  switch (tier) {
    case 'thumbnail':
      return `assets/images/concepts/thumbnails/${conceptId}.png`;
    case 'illustration':
      return `assets/images/concepts/illustrations/${conceptId}.png`;
    case 'video':
      return `assets/videos/${conceptId}.mp4`;
    default:
      return null;
  }
}

function describeAsset(rel, wiredInVocab) {
  const exists = fileExists(rel);
  const bytes = exists ? fileBytes(rel) : null;
  return {
    path: rel,
    exists,
    bytes,
    wiredInVocab: !!wiredInVocab,
    status: exists ? (wiredInVocab ? 'wired' : 'on-disk') : 'missing',
  };
}

module.exports = {
  ROOT,
  PATHS,
  SIZE_BUDGET,
  VIDEO_TIER_BUDGET,
  fileExists,
  fileBytes,
  videoBudgetForConcept,
  parseConcepts,
  loadConcepts,
  loadVisualFormats,
  loadCopyReviewedIds,
  loadQaPassedIds,
  assetPathFor,
  describeAsset,
};
