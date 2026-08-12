#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const ts = require('typescript');

const root = path.resolve(__dirname, '..');
const vocabularyPath = path.join(root, 'data/vocabulary.ts');
const pathwaysPath = path.join(root, 'data/pathways.ts');
const explainersPath = path.join(root, 'data/explainers.ts');
const editorialReviewPath = path.join(root, 'content/v2/editorial-review.json');
const conceptCopyPath = path.join(root, 'content/v2/copy/concept-copy.json');
const bundlePath = path.join(root, 'content/v2/bundles/v2-full.bundle.json');
const nativeResourcePath = path.join(
  root,
  'ios/Sources/PleasureVocabularyApp/Resources/v2-full.bundle.json'
);

function loadTsExports(filePath) {
  const source = fs.readFileSync(filePath, 'utf8');
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true,
      jsx: ts.JsxEmit.React,
    },
  }).outputText;

  const sandbox = {
    exports: {},
    module: { exports: {} },
    require(specifier) {
      if (specifier.startsWith('@/assets/')) {
        return specifier.replace('@/', '');
      }
      if (specifier.startsWith('../assets/')) {
        return specifier.replace('../', '');
      }
      if (specifier === './pathways') {
        return { getPathwayById: () => undefined };
      }
      if (specifier === '@/types') {
        return {};
      }
      return {};
    },
  };
  sandbox.module.exports = sandbox.exports;

  vm.runInNewContext(output, sandbox, { filename: filePath });
  return sandbox.exports;
}

const EXPLAINER_ICON_MAP = {
  'stats-chart': 'chart.bar',
  body: 'figure.stand',
  bulb: 'lightbulb',
  chatbubbles: 'bubble.left.and.bubble.right',
};

function normalizeExplainerContent(content) {
  if (typeof content === 'string') {
    return [{ type: 'text', body: content }];
  }
  if (!Array.isArray(content)) return [];

  return content
    .map((block) => {
      switch (block.type) {
        case 'text':
          return { type: 'text', body: block.content };
        case 'quote':
          return {
            type: 'quote',
            body: block.content,
            attribution: block.author || undefined,
          };
        case 'callout':
          return {
            type: 'callout',
            title: block.title,
            body: block.content,
          };
        default:
          return block.content ? { type: 'text', body: String(block.content) } : null;
      }
    })
    .filter(Boolean);
}

function registerExplainerHeroMedia(explainer, mediaById) {
  if (!explainer.image || typeof explainer.image !== 'string') return null;

  const assetPath = explainer.image.startsWith('assets/')
    ? explainer.image
    : `assets/images/explainers/${path.basename(explainer.image)}`;
  const mediaId = `explainer-${explainer.id}`;

  if (!mediaById.has(mediaId)) {
    mediaById.set(mediaId, {
      id: mediaId,
      kind: 'image',
      path: assetPath,
      alt: explainer.title,
      reducedMotionFallback: assetPath,
    });
  }

  return mediaId;
}

function buildExplainers(rawExplainers, conceptIds, mediaById) {
  const explainerIds = new Set(rawExplainers.map((item) => item.id));

  return rawExplainers.map((explainer) => {
    const heroImageId = registerExplainerHeroMedia(explainer, mediaById);

    return {
      id: explainer.id,
      title: explainer.title,
      subtitle: explainer.subtitle,
      icon: EXPLAINER_ICON_MAP[explainer.icon] || 'doc.text',
      heroImageId,
      readTime: explainer.readTime,
      overview: explainer.overview,
      keyTakeaways: explainer.keyTakeaways,
      sections: explainer.sections.map((section) => ({
        title: section.title,
        contentBlocks: normalizeExplainerContent(section.content),
        statistic: section.statistic || undefined,
      })),
      misconceptions: explainer.misconceptions,
      keySources: explainer.keySources,
      relatedConceptIds: (explainer.relatedConceptIds || []).filter((id) => conceptIds.has(id)),
      relatedExplainerIds: (explainer.relatedExplainerIds || []).filter((id) => explainerIds.has(id)),
    };
  });
}

function trimSummary(value) {
  const firstParagraph = String(value || '').split(/\n\s*\n/)[0].replace(/\s+/g, ' ').trim();
  if (firstParagraph.length <= 210) return firstParagraph;
  const firstSentence = firstParagraph.match(/^.*?[.!?](\s|$)/);
  return firstSentence ? firstSentence[0].trim() : `${firstParagraph.slice(0, 207).trim()}...`;
}

function blockId(conceptId, suffix) {
  return `${conceptId}-${suffix}`;
}

function citationId(conceptId, index) {
  return `${conceptId}-source-${index + 1}`;
}

function readEditorialReview() {
  return JSON.parse(fs.readFileSync(editorialReviewPath, 'utf8'));
}

// Per-concept hand-written copy (recognize / reflection / phrases) that overrides
// the generic frames below. See content/v2/copy/concept-copy.json.
function readConceptCopy() {
  if (!fs.existsSync(conceptCopyPath)) return {};
  return JSON.parse(fs.readFileSync(conceptCopyPath, 'utf8')).concepts || {};
}

function buildCitations(concept) {
  const sources = String(concept.source || concept.researchBasis || 'Editorial review')
    .split(';')
    .map((source) => source.trim())
    .filter(Boolean);

  return (sources.length > 0 ? sources : ['Editorial review']).map((source, index) => ({
    id: citationId(concept.id, index),
    label: source.replace(/\s+research$/i, ' research'),
    source,
    note: concept.researchBasis,
  }));
}

function getSlide(concept, type) {
  return (concept.slides || []).find((slide) => slide.type === type);
}

function buildReflectionPrompt(concept, override) {
  if (override && override.reflection) {
    return override.reflection;
  }
  const prompt = (concept.recognitionPrompts || [])[0];
  if (prompt) {
    return `${prompt} What would you want to remember about your own experience?`;
  }
  return `Where does ${concept.name.toLowerCase()} show up for you, and what would you want to remember next time?`;
}

function conceptFocus(concept) {
  switch (concept.category) {
    case 'technique':
      return `exploring ${concept.name.toLowerCase()}`;
    case 'sensation':
      return `noticing ${concept.name.toLowerCase()}`;
    case 'timing':
      return `making room for ${concept.name.toLowerCase()}`;
    case 'psychological':
      return `understanding how ${concept.name.toLowerCase()} affects me`;
    case 'anatomy':
      return `using what I know about ${concept.name.toLowerCase()}`;
    default:
      return `learning about ${concept.name.toLowerCase()}`;
  }
}

function buildPhraseTemplates(concept, override) {
  if (override && Array.isArray(override.phrases) && override.phrases.length > 0) {
    return override.phrases.map((phrase) => ({
      id: `${concept.id}-${phrase.useCase}`,
      useCase: phrase.useCase,
      label: phrase.label,
      body: phrase.body,
      tone: phrase.tone,
    }));
  }
  const focus = conceptFocus(concept);
  const name = concept.name.toLowerCase();
  return [
    {
      useCase: 'self-understanding',
      label: 'For myself',
      body: `I am learning that ${name} may matter for me, and I want to notice it without turning it into a goal.`,
      tone: 'soft',
    },
    {
      useCase: 'partner-request',
      label: 'Ask for support',
      body: `Can we make space for ${focus} slowly, with check-ins about what feels good and what does not?`,
      tone: 'direct',
    },
    {
      useCase: 'boundary',
      label: 'Set a boundary',
      body: `If ${name} starts to feel pressured or uncomfortable, I want us to pause and choose a different pace.`,
      tone: 'direct',
    },
    {
      useCase: 'curiosity',
      label: 'Open curiosity',
      body: `I am curious about ${focus}, and I would like to treat it as an experiment rather than something we have to get right.`,
      tone: 'curious',
    },
    {
      useCase: 'reassurance',
      label: 'Reassure',
      body: `Nothing is wrong if ${name} shows up differently from one experience to the next. I want patience and honesty to lead.`,
      tone: 'reassuring',
    },
  ].map((phrase) => ({
    id: `${concept.id}-${phrase.useCase}`,
    ...phrase,
  }));
}

function mediaAlt(concept, kind) {
  if (kind === 'diagram') return `Native diagram for ${concept.name}.`;
  if (kind === 'video') return `Motion study for ${concept.name}.`;
  return `Warm educational illustration for ${concept.name}.`;
}

function buildConceptMedia(concept, mediaById) {
  const mediaIds = [];
  const illustrate = getSlide(concept, 'illustrate');
  const fallback = illustrate && illustrate.illustrationAsset
    ? illustrate.illustrationAsset
    : `assets/images/concepts/illustrations/${concept.id}.png`;

  if (concept.diagramType) {
    const id = `${concept.id}-diagram`;
    mediaById.set(id, {
      id,
      kind: 'diagram',
      path: `native://diagram/${concept.diagramType}`,
      alt: mediaAlt(concept, 'diagram'),
      caption: illustrate?.illustrationCaption || `Diagram for ${concept.name}.`,
      reducedMotionFallback: fallback,
    });
    mediaIds.push(id);
  }

  if (illustrate?.illustrationAsset) {
    const id = `${concept.id}-illustration`;
    mediaById.set(id, {
      id,
      kind: 'image',
      path: illustrate.illustrationAsset,
      alt: mediaAlt(concept, 'image'),
      caption: illustrate.illustrationCaption || `Illustration for ${concept.name}.`,
      reducedMotionFallback: illustrate.illustrationAsset,
    });
    mediaIds.push(id);
  }

  if (illustrate?.illustrationVideo) {
    const id = `${concept.id}-video`;
    mediaById.set(id, {
      id,
      kind: 'video',
      path: illustrate.illustrationVideo,
      alt: mediaAlt(concept, 'video'),
      caption: illustrate.illustrationCaption || `Motion study for ${concept.name}.`,
      reducedMotionFallback: fallback,
    });
    mediaIds.push(id);
  }

  return mediaIds;
}

function buildBlocks(concept, citations, mediaIds, override) {
  const recognize = getSlide(concept, 'recognize');
  const name = getSlide(concept, 'name');
  const understand = getSlide(concept, 'understand');
  const illustrate = getSlide(concept, 'illustrate');
  const phrase = buildPhraseTemplates(concept, override)[0].body;
  const blocks = [
    {
      id: blockId(concept.id, 'recognize'),
      type: 'recognize',
      title: 'Notice',
      body: (override && override.recognize) || recognize?.content || (concept.recognitionPrompts || [])[0] || concept.summary,
    },
    {
      id: blockId(concept.id, 'definition'),
      type: 'definition',
      title: 'Name',
      body: name?.content || concept.definition,
    },
  ];

  if (mediaIds.length > 0) {
    blocks.push({
      id: blockId(concept.id, 'media'),
      type: 'media',
      title: 'See It',
      body: illustrate?.illustrationCaption || `A visual reference for ${concept.name}.`,
      mediaId: mediaIds[0],
    });
  }

  blocks.push(
    {
      id: blockId(concept.id, 'mechanism'),
      type: 'mechanism',
      title: 'Understand',
      body: understand?.content || concept.researchBasis || concept.description,
      citationIds: citations.map((citation) => citation.id),
    },
    {
      id: blockId(concept.id, 'reflection'),
      type: 'reflection',
      title: 'Reflect',
      body: buildReflectionPrompt(concept, override),
      privateByDefault: true,
    },
    {
      id: blockId(concept.id, 'phrase'),
      type: 'phrase',
      title: 'Keep',
      body: phrase,
    }
  );

  return blocks;
}

function buildBundle() {
  const { concepts } = loadTsExports(vocabularyPath);
  const { pathways } = loadTsExports(pathwaysPath);
  const { explainers } = loadTsExports(explainersPath);
  const editorialReview = readEditorialReview();
  const conceptCopy = readConceptCopy();
  const mediaById = new Map();
  const conceptIds = new Set(concepts.map((concept) => concept.id));

  const v2Concepts = concepts.map((concept) => {
    const override = conceptCopy[concept.id];
    const citations = buildCitations(concept);
    const mediaIds = buildConceptMedia(concept, mediaById);
    return {
      id: concept.id,
      name: concept.name,
      category: concept.category,
      reviewStatus: editorialReview.concepts[concept.id]?.reviewStatus || 'draft',
      definition: concept.definition,
      summary: trimSummary(concept.description || concept.definition),
      blocks: buildBlocks(concept, citations, mediaIds, override),
      relatedConceptIds: (concept.relatedConcepts || []).filter((id) =>
        concepts.some((candidate) => candidate.id === id)
      ),
      phraseTemplates: buildPhraseTemplates(concept, override),
      citations,
      mediaIds,
    };
  });

  const v2Explainers = buildExplainers(explainers || [], conceptIds, mediaById);

  return {
    schemaVersion: 1,
    bundleId: 'v2-full',
    contentVersion: '0.2.0',
    generatedAt: '2026-06-27T00:00:00Z',
    concepts: v2Concepts,
    pathways: pathways.map((pathway) => ({
      id: pathway.id,
      name: pathway.name,
      summary: pathway.description,
      intent: pathway.intent,
      conceptIds: pathway.conceptIds,
    })),
    media: [...mediaById.values()],
    explainers: v2Explainers,
  };
}

const bundle = buildBundle();
fs.mkdirSync(path.dirname(bundlePath), { recursive: true });
fs.writeFileSync(bundlePath, `${JSON.stringify(bundle, null, 2)}\n`);

if (fs.existsSync(path.dirname(nativeResourcePath))) {
  fs.mkdirSync(path.dirname(nativeResourcePath), { recursive: true });
  fs.writeFileSync(nativeResourcePath, `${JSON.stringify(bundle, null, 2)}\n`);
}

console.log(
  `Generated ${path.relative(root, bundlePath)} (${bundle.concepts.length} concepts, ` +
    `${bundle.pathways.length} pathways, ${bundle.media.length} media items, ` +
    `${bundle.explainers.length} explainers)`
);
