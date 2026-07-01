#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const defaultBundle = path.join(root, 'content/v2/bundles/golden-path.bundle.json');
const bundlePath = path.resolve(process.cwd(), process.argv[2] || defaultBundle);

const ID_PATTERN = /^[a-z0-9][a-z0-9-]*$/;
const SEMVER_PATTERN = /^\d+\.\d+\.\d+(-[a-z0-9.-]+)?$/;
const KNOWN_CATEGORIES = new Set(['technique', 'sensation', 'timing', 'psychological', 'anatomy']);
const KNOWN_BLOCK_TYPES = new Set(['recognize', 'definition', 'mechanism', 'media', 'reflection', 'phrase']);
const KNOWN_MEDIA_KINDS = new Set(['image', 'video', 'diagram']);
const KNOWN_TONES = new Set(['soft', 'direct', 'curious', 'reassuring']);
const KNOWN_REVIEW_STATUSES = new Set(['draft', 'reviewed', 'approved', 'retired']);
const KNOWN_PHRASE_USE_CASES = new Set([
  'self-understanding',
  'partner-request',
  'boundary',
  'curiosity',
  'reassurance',
]);
const KNOWN_EXPLAINER_BLOCK_TYPES = new Set(['text', 'quote', 'callout']);
const KNOWN_PATHWAY_INTENTS = new Set([
  'understand-body',
  'notice-patterns',
  'communicate',
  'try-something',
  'return-to-presence',
]);

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    throw new Error(`Could not parse JSON at ${filePath}: ${error.message}`);
  }
}

function requireString(value, label, errors) {
  if (typeof value !== 'string' || value.trim() === '') {
    errors.push(`${label} must be a non-empty string`);
  }
}

function requireId(value, label, errors) {
  requireString(value, label, errors);
  if (typeof value === 'string' && !ID_PATTERN.test(value)) {
    errors.push(`${label} must be kebab-case lowercase`);
  }
}

function requireUnique(items, label, errors) {
  const seen = new Set();
  for (const item of items) {
    if (!item || typeof item.id !== 'string') continue;
    if (seen.has(item.id)) errors.push(`Duplicate ${label} id: ${item.id}`);
    seen.add(item.id);
  }
}

function pathExistsIfBundled(assetPath, label, errors) {
  if (typeof assetPath !== 'string') return;
  if (assetPath.startsWith('native://')) return;
  const resolved = path.resolve(root, assetPath);
  if (!fs.existsSync(resolved)) {
    errors.push(`${label} does not exist: ${assetPath}`);
  }
}

function validateBundle(bundle) {
  const errors = [];

  if (bundle.schemaVersion !== 1) errors.push('schemaVersion must be 1');
  requireId(bundle.bundleId, 'bundleId', errors);
  if (typeof bundle.contentVersion !== 'string' || !SEMVER_PATTERN.test(bundle.contentVersion)) {
    errors.push('contentVersion must be semver-like, for example 0.1.0');
  }
  if (Number.isNaN(Date.parse(bundle.generatedAt))) {
    errors.push('generatedAt must be an ISO date-time string');
  }
  if (!Array.isArray(bundle.concepts) || bundle.concepts.length === 0) {
    errors.push('concepts must be a non-empty array');
  }
  if (!Array.isArray(bundle.pathways)) errors.push('pathways must be an array');
  if (!Array.isArray(bundle.media)) errors.push('media must be an array');
  if (bundle.explainers != null && !Array.isArray(bundle.explainers)) {
    errors.push('explainers must be an array when present');
  }

  const concepts = Array.isArray(bundle.concepts) ? bundle.concepts : [];
  const pathways = Array.isArray(bundle.pathways) ? bundle.pathways : [];
  const media = Array.isArray(bundle.media) ? bundle.media : [];
  const explainers = Array.isArray(bundle.explainers) ? bundle.explainers : [];
  const conceptIds = new Set(concepts.map((concept) => concept.id));
  const mediaIds = new Set(media.map((item) => item.id));
  const explainerIds = new Set(explainers.map((item) => item.id));

  requireUnique(concepts, 'concept', errors);
  requireUnique(pathways, 'pathway', errors);
  requireUnique(media, 'media', errors);
  requireUnique(explainers, 'explainer', errors);

  for (const concept of concepts) {
    requireId(concept.id, 'concept.id', errors);
    requireString(concept.name, `${concept.id}.name`, errors);
    requireString(concept.definition, `${concept.id}.definition`, errors);
    requireString(concept.summary, `${concept.id}.summary`, errors);
    if (!KNOWN_CATEGORIES.has(concept.category)) {
      errors.push(`${concept.id}.category is unknown: ${concept.category}`);
    }
    if (!KNOWN_REVIEW_STATUSES.has(concept.reviewStatus)) {
      errors.push(`${concept.id}.reviewStatus is unknown: ${concept.reviewStatus}`);
    }
    if (!Array.isArray(concept.blocks) || concept.blocks.length === 0) {
      errors.push(`${concept.id}.blocks must be a non-empty array`);
    }
    if (!Array.isArray(concept.relatedConceptIds)) {
      errors.push(`${concept.id}.relatedConceptIds must be an array`);
    }
    if (!Array.isArray(concept.phraseTemplates)) {
      errors.push(`${concept.id}.phraseTemplates must be an array`);
    }
    if (!Array.isArray(concept.citations)) {
      errors.push(`${concept.id}.citations must be an array`);
    }

    const citationIds = new Set((concept.citations || []).map((citation) => citation.id));
    requireUnique(concept.blocks || [], `${concept.id} block`, errors);
    requireUnique(concept.phraseTemplates || [], `${concept.id} phrase`, errors);
    requireUnique(concept.citations || [], `${concept.id} citation`, errors);

    for (const relatedId of concept.relatedConceptIds || []) {
      if (!conceptIds.has(relatedId)) {
        errors.push(`${concept.id}.relatedConceptIds references missing concept: ${relatedId}`);
      }
    }

    for (const mediaId of concept.mediaIds || []) {
      if (!mediaIds.has(mediaId)) {
        errors.push(`${concept.id}.mediaIds references missing media: ${mediaId}`);
      }
    }

    for (const block of concept.blocks || []) {
      requireId(block.id, `${concept.id}.blocks.id`, errors);
      if (!KNOWN_BLOCK_TYPES.has(block.type)) {
        errors.push(`${concept.id}.${block.id}.type is unknown: ${block.type}`);
      }
      requireString(block.title, `${concept.id}.${block.id}.title`, errors);
      requireString(block.body, `${concept.id}.${block.id}.body`, errors);

      if (block.mediaId && !mediaIds.has(block.mediaId)) {
        errors.push(`${concept.id}.${block.id}.mediaId references missing media: ${block.mediaId}`);
      }
      for (const citationId of block.citationIds || []) {
        if (!citationIds.has(citationId)) {
          errors.push(`${concept.id}.${block.id}.citationIds references missing citation: ${citationId}`);
        }
      }
    }

    for (const phrase of concept.phraseTemplates || []) {
      requireId(phrase.id, `${concept.id}.phraseTemplates.id`, errors);
      requireString(phrase.label, `${concept.id}.${phrase.id}.label`, errors);
      requireString(phrase.body, `${concept.id}.${phrase.id}.body`, errors);
      if (!KNOWN_TONES.has(phrase.tone)) {
        errors.push(`${concept.id}.${phrase.id}.tone is unknown: ${phrase.tone}`);
      }
      if (!KNOWN_PHRASE_USE_CASES.has(phrase.useCase)) {
        errors.push(`${concept.id}.${phrase.id}.useCase is unknown: ${phrase.useCase}`);
      }
    }

    for (const citation of concept.citations || []) {
      requireId(citation.id, `${concept.id}.citations.id`, errors);
      requireString(citation.label, `${concept.id}.${citation.id}.label`, errors);
      requireString(citation.source, `${concept.id}.${citation.id}.source`, errors);
    }
  }

  for (const pathway of pathways) {
    requireId(pathway.id, 'pathway.id', errors);
    requireString(pathway.name, `${pathway.id}.name`, errors);
    requireString(pathway.summary, `${pathway.id}.summary`, errors);
    if (!KNOWN_PATHWAY_INTENTS.has(pathway.intent)) {
      errors.push(`${pathway.id}.intent is unknown: ${pathway.intent}`);
    }
    if (!Array.isArray(pathway.conceptIds) || pathway.conceptIds.length === 0) {
      errors.push(`${pathway.id}.conceptIds must be a non-empty array`);
    }
    for (const conceptId of pathway.conceptIds || []) {
      if (!conceptIds.has(conceptId)) {
        errors.push(`${pathway.id}.conceptIds references missing concept: ${conceptId}`);
      }
    }
  }

  for (const item of media) {
    requireId(item.id, 'media.id', errors);
    if (!KNOWN_MEDIA_KINDS.has(item.kind)) {
      errors.push(`${item.id}.kind is unknown: ${item.kind}`);
    }
    requireString(item.path, `${item.id}.path`, errors);
    requireString(item.reducedMotionFallback, `${item.id}.reducedMotionFallback`, errors);
    pathExistsIfBundled(item.path, `${item.id}.path`, errors);
    pathExistsIfBundled(item.reducedMotionFallback, `${item.id}.reducedMotionFallback`, errors);
  }

  for (const explainer of explainers) {
    requireId(explainer.id, 'explainer.id', errors);
    requireString(explainer.title, `${explainer.id}.title`, errors);
    requireString(explainer.subtitle, `${explainer.id}.subtitle`, errors);
    requireString(explainer.icon, `${explainer.id}.icon`, errors);
    requireString(explainer.readTime, `${explainer.id}.readTime`, errors);
    requireString(explainer.overview, `${explainer.id}.overview`, errors);
    if (!Array.isArray(explainer.keyTakeaways) || explainer.keyTakeaways.length === 0) {
      errors.push(`${explainer.id}.keyTakeaways must be a non-empty array`);
    }
    if (!Array.isArray(explainer.sections) || explainer.sections.length === 0) {
      errors.push(`${explainer.id}.sections must be a non-empty array`);
    }
    if (!Array.isArray(explainer.misconceptions)) {
      errors.push(`${explainer.id}.misconceptions must be an array`);
    }
    if (!Array.isArray(explainer.keySources)) {
      errors.push(`${explainer.id}.keySources must be an array`);
    }
    if (!Array.isArray(explainer.relatedConceptIds)) {
      errors.push(`${explainer.id}.relatedConceptIds must be an array`);
    }
    if (!Array.isArray(explainer.relatedExplainerIds)) {
      errors.push(`${explainer.id}.relatedExplainerIds must be an array`);
    }
    if (explainer.heroImageId && !mediaIds.has(explainer.heroImageId)) {
      errors.push(`${explainer.id}.heroImageId references missing media: ${explainer.heroImageId}`);
    }
    for (const conceptId of explainer.relatedConceptIds || []) {
      if (!conceptIds.has(conceptId)) {
        errors.push(`${explainer.id}.relatedConceptIds references missing concept: ${conceptId}`);
      }
    }
    for (const relatedId of explainer.relatedExplainerIds || []) {
      if (!explainerIds.has(relatedId)) {
        errors.push(`${explainer.id}.relatedExplainerIds references missing explainer: ${relatedId}`);
      }
    }
    for (const section of explainer.sections || []) {
      requireString(section.title, `${explainer.id}.sections.title`, errors);
      if (!Array.isArray(section.contentBlocks) || section.contentBlocks.length === 0) {
        errors.push(`${explainer.id}.sections.contentBlocks must be a non-empty array`);
      }
      for (const block of section.contentBlocks || []) {
        if (!KNOWN_EXPLAINER_BLOCK_TYPES.has(block.type)) {
          errors.push(`${explainer.id}.sections block type is unknown: ${block.type}`);
        }
        requireString(block.body, `${explainer.id}.sections block body`, errors);
        if (block.type === 'callout') {
          requireString(block.title, `${explainer.id}.sections callout title`, errors);
        }
      }
    }
  }

  return errors;
}

const bundle = readJson(bundlePath);
const errors = validateBundle(bundle);

if (errors.length > 0) {
  console.error(`V2 bundle validation failed for ${path.relative(root, bundlePath)}:`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(
  `V2 bundle ok: ${path.relative(root, bundlePath)} ` +
    `(${bundle.concepts.length} concepts, ${bundle.pathways.length} pathways, ${bundle.media.length} media items` +
    `${Array.isArray(bundle.explainers) ? `, ${bundle.explainers.length} explainers` : ''})`
);
