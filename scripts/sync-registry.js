/**
 * Sync data/asset-registry.json from format lock, vocabulary wiring, and filesystem.
 * Preserves manual evaluation fields and non-auto statuses (approved, rejected, pilot).
 * Run: node scripts/sync-registry.js
 */

const fs = require('fs');
const {
  PATHS,
  loadConcepts,
  loadVisualFormats,
  loadQaPassedIds,
  describeAsset,
  assetPathFor,
} = require('./lib/vocab-parse');
const { listPilotIllustrations } = require('./lib/pilot-paths');

const MANUAL_STATUSES = new Set(['approved', 'rejected', 'pilot', 'review']);

function mergeAsset(prev, next) {
  if (!prev) return next;
  const merged = { ...next, ...prev, path: next.path, exists: next.exists, bytes: next.bytes, wiredInVocab: next.wiredInVocab };
  if (prev.status && MANUAL_STATUSES.has(prev.status)) {
    merged.status = prev.status;
  } else {
    merged.status = next.status;
  }
  if (prev.generator) merged.generator = prev.generator;
  if (prev.promptRef) merged.promptRef = prev.promptRef;
  if (prev.notes) merged.notes = prev.notes;
  return merged;
}

function mergeEvaluation(prevEval, qaPassed) {
  return {
    deviceQA: qaPassed ? true : prevEval.deviceQA || false,
    styleCoherence: prevEval.styleCoherence ?? null,
    scientificAccuracy: prevEval.scientificAccuracy ?? null,
    noEmbeddedText: prevEval.noEmbeddedText ?? null,
    motionClarity: prevEval.motionClarity ?? null,
    promotionDecision: prevEval.promotionDecision || 'pending',
    notes: prevEval.notes || '',
  };
}

function mergePilots(conceptId, prevPilots) {
  const discovered = listPilotIllustrations(conceptId);
  const byGen = Object.fromEntries((prevPilots || []).map((p) => [p.generator, p]));
  return discovered.map((d) => {
    const prev = byGen[d.generator] || {};
    return {
      assetType: 'illustration',
      generator: d.generator,
      path: d.path,
      scores: prev.scores || {},
      decision: prev.decision || 'pending',
      notes: prev.notes || '',
      reviewedAt: prev.reviewedAt || null,
    };
  });
}

function buildConceptEntry(concept, format, videoProfile, prevConcept, qaPassed) {
  const thumbPath = assetPathFor(concept.id, 'thumbnail');
  const illPath = assetPathFor(concept.id, 'illustration');
  const videoPath = assetPathFor(concept.id, 'video');

  const thumb = describeAsset(thumbPath, concept.conceptLevelThumb);
  const illustration = describeAsset(
    illPath,
    !!concept.illustrationId && concept.illustrationId === concept.id
  );

  let video = null;
  if (format === 'video' || concept.videoFile) {
    const vp = concept.videoFile ? `assets/videos/${concept.videoFile}` : videoPath;
    video = describeAsset(vp, !!concept.videoFile);
    if (video.exists && video.wiredInVocab) video.status = 'wired';
  }

  const prevAssets = prevConcept?.assets || {};
  const prevEval = prevConcept?.evaluation || {};

  return {
    format,
    videoProfile: videoProfile || null,
    assets: {
      thumbnail: mergeAsset(prevAssets.thumbnail, thumb),
      illustration: mergeAsset(prevAssets.illustration, {
        ...illustration,
        role: format === 'video' ? 'poster-fallback' : 'primary',
      }),
      ...(video ? { video: mergeAsset(prevAssets.video, video) } : {}),
    },
    evaluation: mergeEvaluation(prevEval, qaPassed.has(concept.id)),
    pilots: mergePilots(concept.id, prevConcept?.pilots),
  };
}

function main() {
  const concepts = loadConcepts();
  const { formats, videoProfiles } = loadVisualFormats();
  const qaPassed = loadQaPassedIds();

  let prev = { concepts: {} };
  if (fs.existsSync(PATHS.registry)) {
    prev = JSON.parse(fs.readFileSync(PATHS.registry, 'utf8'));
  }

  const registry = {
    _meta: {
      version: 1,
      updated: new Date().toISOString().slice(0, 10),
      source: 'npm run sync-registry',
      conceptCount: concepts.length,
    },
    concepts: {},
  };

  for (const c of concepts) {
    const format = formats[c.id] || 'TBD';
    registry.concepts[c.id] = buildConceptEntry(
      c,
      format,
      videoProfiles[c.id] || null,
      prev.concepts?.[c.id],
      qaPassed
    );
  }

  fs.writeFileSync(PATHS.registry, JSON.stringify(registry, null, 2) + '\n');
  console.log(`sync-registry: wrote ${PATHS.registry} (${concepts.length} concepts)`);
}

main();
