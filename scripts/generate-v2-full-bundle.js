#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const ts = require('typescript');

const root = path.resolve(__dirname, '..');
const vocabularyPath = path.join(root, 'data/vocabulary.ts');
const pathwaysPath = path.join(root, 'data/pathways.ts');
const bundlePath = path.join(root, 'content/v2/bundles/v2-full.bundle.json');
const nativeResourcePath = path.join(
  root,
  'ios-native/Sources/PleasureVocabularyApp/Resources/v2-full.bundle.json'
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
      return {};
    },
  };
  sandbox.module.exports = sandbox.exports;

  vm.runInNewContext(output, sandbox, { filename: filePath });
  return sandbox.exports;
}

function slug(value) {
  return value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function sentenceCase(value) {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
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

function buildReflectionPrompt(concept) {
  const prompt = (concept.recognitionPrompts || [])[0];
  if (prompt) {
    return `${prompt} What would you want to remember about your own experience?`;
  }
  return `Where does ${concept.name.toLowerCase()} show up for you, and what would you want to remember next time?`;
}

function buildPhrase(concept) {
  switch (concept.category) {
    case 'technique':
      return `I am curious about exploring ${concept.name.toLowerCase()} slowly, with check-ins about what feels good and what does not.`;
    case 'sensation':
      return `I am learning to notice ${concept.name.toLowerCase()} as useful information about my pleasure, not something I need to force.`;
    case 'timing':
      return `My timing may follow ${concept.name.toLowerCase()}; I would like room for that pace instead of treating it as a problem.`;
    case 'psychological':
      return `I am noticing how ${concept.name.toLowerCase()} affects my pleasure, and it helps when we make the experience calmer and less performative.`;
    case 'anatomy':
      return `Understanding ${concept.name.toLowerCase()} helps me explain what kind of touch or pressure I may want to explore.`;
    default:
      return `I am learning that ${concept.name.toLowerCase()} matters for me, and I want language for it.`;
  }
}

function phraseTone(category) {
  switch (category) {
    case 'technique':
      return 'direct';
    case 'sensation':
      return 'soft';
    case 'timing':
      return 'reassuring';
    case 'psychological':
      return 'reassuring';
    case 'anatomy':
      return 'curious';
    default:
      return 'soft';
  }
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

function buildBlocks(concept, citations, mediaIds) {
  const recognize = getSlide(concept, 'recognize');
  const name = getSlide(concept, 'name');
  const understand = getSlide(concept, 'understand');
  const illustrate = getSlide(concept, 'illustrate');
  const phrase = buildPhrase(concept);
  const blocks = [
    {
      id: blockId(concept.id, 'recognize'),
      type: 'recognize',
      title: 'Recognize',
      body: recognize?.content || (concept.recognitionPrompts || [])[0] || concept.summary,
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
      title: 'Field Note',
      body: buildReflectionPrompt(concept),
      privateByDefault: true,
    },
    {
      id: blockId(concept.id, 'phrase'),
      type: 'phrase',
      title: 'A Phrase To Keep',
      body: phrase,
    }
  );

  return blocks;
}

function buildBundle() {
  const { concepts } = loadTsExports(vocabularyPath);
  const { pathways } = loadTsExports(pathwaysPath);
  const mediaById = new Map();

  const v2Concepts = concepts.map((concept) => {
    const citations = buildCitations(concept);
    const mediaIds = buildConceptMedia(concept, mediaById);
    return {
      id: concept.id,
      name: concept.name,
      category: concept.category,
      definition: concept.definition,
      summary: trimSummary(concept.description || concept.definition),
      blocks: buildBlocks(concept, citations, mediaIds),
      relatedConceptIds: (concept.relatedConcepts || []).filter((id) =>
        concepts.some((candidate) => candidate.id === id)
      ),
      phraseTemplates: [
        {
          id: `${concept.id}-${slug(phraseTone(concept.category))}-share`,
          label: `${sentenceCase(phraseTone(concept.category))} share`,
          body: buildPhrase(concept),
          tone: phraseTone(concept.category),
        },
      ],
      citations,
      mediaIds,
    };
  });

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
      conceptIds: pathway.conceptIds,
    })),
    media: [...mediaById.values()],
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
    `${bundle.pathways.length} pathways, ${bundle.media.length} media items)`
);
