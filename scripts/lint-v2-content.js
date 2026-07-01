#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const defaultBundle = path.join(root, 'content/v2/bundles/v2-full.bundle.json');
const bundlePath = path.resolve(process.cwd(), process.argv[2] || defaultBundle);
const reviewPath = path.join(root, 'content/v2/editorial-review.json');

const REQUIRED_USE_CASES = [
  'self-understanding',
  'partner-request',
  'boundary',
  'curiosity',
  'reassurance',
];
const PRIVATE_NOTE_PATTERNS = [
  /\bfield note\b/i,
  /\bjournal\b/i,
  /\bprivate note\b/i,
  /\bmy notes?\b/i,
  /\bexport\b/i,
  /\bdelete all data\b/i,
];
const UNQUALIFIED_CLAIM_PATTERNS = [
  /\bproves?\b/i,
  /\bguarantees?\b/i,
  /\bwill always\b/i,
  /\beveryone\b/i,
  /\bcure(?:s)?\b/i,
];

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function listMissing(expected, actual) {
  const actualSet = new Set(actual);
  return expected.filter((item) => !actualSet.has(item));
}

function lintBundle(bundle, editorialReview) {
  const errors = [];
  const warnings = [];
  const mediaById = new Map((bundle.media || []).map((item) => [item.id, item]));
  const reviewByConcept = editorialReview.concepts || {};

  for (const concept of bundle.concepts || []) {
    const review = reviewByConcept[concept.id];
    if (!review) {
      errors.push(`${concept.id} is missing editorial review metadata`);
      continue;
    }
    if (concept.reviewStatus !== 'approved') {
      errors.push(`${concept.id}.reviewStatus must be approved before shipping`);
    }
    if (review.reviewStatus !== concept.reviewStatus) {
      errors.push(`${concept.id}.reviewStatus does not match editorial-review.json`);
    }
    if (review.citationAudit !== 'approved') {
      errors.push(`${concept.id} citation audit must be approved`);
    }
    if (!Array.isArray(concept.citations) || concept.citations.length === 0) {
      errors.push(`${concept.id} must include at least one citation`);
    }

    const mechanismBlocks = (concept.blocks || []).filter((block) => block.type === 'mechanism');
    if (mechanismBlocks.length === 0) {
      errors.push(`${concept.id} must include a mechanism block`);
    }
    for (const block of mechanismBlocks) {
      if (!Array.isArray(block.citationIds) || block.citationIds.length === 0) {
        errors.push(`${concept.id}.${block.id} must cite at least one source`);
      }
      for (const pattern of UNQUALIFIED_CLAIM_PATTERNS) {
        if (pattern.test(block.body)) {
          errors.push(`${concept.id}.${block.id} contains an over-strong claim: ${pattern}`);
        }
      }
    }

    for (const block of concept.blocks || []) {
      if (block.type === 'reflection' && block.privateByDefault !== true) {
        errors.push(`${concept.id}.${block.id} reflection block must be privateByDefault`);
      }
      if (block.type === 'phrase') {
        for (const pattern of PRIVATE_NOTE_PATTERNS) {
          if (pattern.test(block.body)) {
            errors.push(`${concept.id}.${block.id} phrase leaks private-note language: ${pattern}`);
          }
        }
      }
    }

    const phrases = concept.phraseTemplates || [];
    const missingUseCases = listMissing(REQUIRED_USE_CASES, phrases.map((phrase) => phrase.useCase));
    if (missingUseCases.length > 0) {
      errors.push(`${concept.id}.phraseTemplates missing use cases: ${missingUseCases.join(', ')}`);
    }
    for (const phrase of phrases) {
      for (const pattern of PRIVATE_NOTE_PATTERNS) {
        if (pattern.test(phrase.body)) {
          errors.push(`${concept.id}.${phrase.id} leaks private-note language: ${pattern}`);
        }
      }
      if (phrase.useCase === 'boundary' && !/\b(pause|stop|slow|different|boundary|uncomfortable)\b/i.test(phrase.body)) {
        warnings.push(`${concept.id}.${phrase.id} boundary phrase may be too vague`);
      }
    }

    const mediaPolicy = review.mediaPolicy;
    if (!mediaPolicy || !Array.isArray(mediaPolicy.requiredKinds)) {
      errors.push(`${concept.id} is missing media policy requiredKinds`);
    } else {
      const actualKinds = (concept.mediaIds || [])
        .map((mediaId) => mediaById.get(mediaId)?.kind)
        .filter(Boolean);
      const missingKinds = listMissing(mediaPolicy.requiredKinds, actualKinds);
      if (missingKinds.length > 0) {
        errors.push(`${concept.id} missing required media kinds: ${missingKinds.join(', ')}`);
      }
    }
  }

  const bundleIds = new Set((bundle.concepts || []).map((concept) => concept.id));
  for (const conceptId of Object.keys(reviewByConcept)) {
    if (!bundleIds.has(conceptId)) {
      errors.push(`editorial-review.json references missing concept: ${conceptId}`);
    }
  }

  return { errors, warnings };
}

const bundle = readJson(bundlePath);
const editorialReview = readJson(reviewPath);
const { errors, warnings } = lintBundle(bundle, editorialReview);

if (warnings.length > 0) {
  console.warn(`V2 content lint warnings for ${path.relative(root, bundlePath)}:`);
  for (const warning of warnings) console.warn(`- ${warning}`);
}

if (errors.length > 0) {
  console.error(`V2 content lint failed for ${path.relative(root, bundlePath)}:`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(
  `V2 content lint ok: ${path.relative(root, bundlePath)} ` +
    `(${bundle.concepts.length} concepts, ${bundle.pathways.length} pathways)`
);
