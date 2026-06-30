#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const bundlePath = path.join(root, 'content/v2/bundles/v2-full.bundle.json');
const reviewPath = path.join(root, 'content/v2/editorial-review.json');
const outDir = path.join(root, 'content/v2/preview');
const outPath = path.join(outDir, 'index.html');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function linkForConcept(concept) {
  return `#${escapeHtml(concept.id)}`;
}

function renderConcept(concept, review) {
  const blocks = concept.blocks
    .map((block) => `
      <section class="block">
        <div class="blockMeta">${escapeHtml(block.type)}</div>
        <h3>${escapeHtml(block.title)}</h3>
        <p>${escapeHtml(block.body)}</p>
        ${block.citationIds ? `<p class="refs">Cites: ${block.citationIds.map(escapeHtml).join(', ')}</p>` : ''}
      </section>
    `)
    .join('');

  const phrases = concept.phraseTemplates
    .map((phrase) => `
      <li>
        <span>${escapeHtml(phrase.useCase)}</span>
        <strong>${escapeHtml(phrase.label)}</strong>
        <p>${escapeHtml(phrase.body)}</p>
      </li>
    `)
    .join('');

  const citations = concept.citations
    .map((citation) => `<li><strong>${escapeHtml(citation.label)}</strong><br>${escapeHtml(citation.source)}</li>`)
    .join('');

  return `
    <article class="concept" id="${escapeHtml(concept.id)}">
      <header>
        <div>
          <p class="eyebrow">${escapeHtml(concept.category)} / ${escapeHtml(concept.reviewStatus)}</p>
          <h2>${escapeHtml(concept.name)}</h2>
          <p>${escapeHtml(concept.summary)}</p>
        </div>
        <a href="#top" aria-label="Back to top">Top</a>
      </header>
      <div class="definition">${escapeHtml(concept.definition)}</div>
      <div class="review">
        <strong>Citation audit:</strong> ${escapeHtml(review?.citationAudit || 'missing')}
        <br>
        <strong>Media policy:</strong> ${(review?.mediaPolicy?.requiredKinds || []).map(escapeHtml).join(', ') || 'missing'}
      </div>
      <div class="blocks">${blocks}</div>
      <section>
        <h3>Phrase Templates</h3>
        <ul class="phrases">${phrases}</ul>
      </section>
      <section>
        <h3>Citations</h3>
        <ul class="citations">${citations}</ul>
      </section>
    </article>
  `;
}

function renderPreview(bundle, review) {
  const conceptLinks = bundle.concepts
    .map((concept) => `<a href="${linkForConcept(concept)}">${escapeHtml(concept.name)}</a>`)
    .join('');
  const pathways = bundle.pathways
    .map((pathway) => `
      <li>
        <strong>${escapeHtml(pathway.name)}</strong>
        <span>${escapeHtml(pathway.intent)}</span>
        <p>${escapeHtml(pathway.summary)}</p>
        <small>${pathway.conceptIds.map(escapeHtml).join(' -> ')}</small>
      </li>
    `)
    .join('');
  const concepts = bundle.concepts
    .map((concept) => renderConcept(concept, review.concepts[concept.id]))
    .join('');

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>V2 Content Preview</title>
  <style>
    :root {
      color-scheme: light;
      --canvas: #f7f4ef;
      --ink: #2b2420;
      --muted: #71655d;
      --line: #ded4ca;
      --surface: #fffdf9;
      --accent: #9d4f52;
      --soft: #ead8d3;
    }
    * { box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body {
      margin: 0;
      background: var(--canvas);
      color: var(--ink);
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      line-height: 1.55;
    }
    a { color: var(--accent); text-decoration: none; }
    a:hover { text-decoration: underline; }
    main { max-width: 1120px; margin: 0 auto; padding: 32px 20px 64px; }
    .hero {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(280px, 380px);
      gap: 28px;
      align-items: end;
      padding-bottom: 28px;
      border-bottom: 1px solid var(--line);
    }
    h1, h2, h3 { margin: 0; line-height: 1.12; font-family: Georgia, "Times New Roman", serif; }
    h1 { font-size: clamp(2rem, 5vw, 4rem); max-width: 720px; }
    h2 { font-size: clamp(1.6rem, 3vw, 2.6rem); }
    h3 { font-size: 1.15rem; }
    p { margin: 0; }
    .meta, .eyebrow, .blockMeta, small {
      color: var(--muted);
      font-size: 0.78rem;
      letter-spacing: 0;
      text-transform: uppercase;
    }
    .nav {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 18px;
    }
    .nav a {
      display: inline-flex;
      min-height: 34px;
      align-items: center;
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 6px 10px;
      background: var(--surface);
      color: var(--ink);
      font-size: 0.9rem;
    }
    .panel, .concept {
      background: var(--surface);
      border: 1px solid var(--line);
      border-radius: 8px;
    }
    .panel { padding: 18px; }
    .pathways {
      display: grid;
      gap: 12px;
      padding: 0;
      margin: 14px 0 0;
      list-style: none;
    }
    .pathways li {
      border-top: 1px solid var(--line);
      padding-top: 12px;
    }
    .pathways li:first-child {
      border-top: 0;
      padding-top: 0;
    }
    .pathways span {
      display: inline-block;
      margin-left: 8px;
      color: var(--accent);
      font-size: 0.85rem;
    }
    .concepts {
      display: grid;
      gap: 24px;
      margin-top: 28px;
    }
    .concept { padding: 22px; scroll-margin-top: 18px; }
    .concept header {
      display: flex;
      justify-content: space-between;
      gap: 18px;
      align-items: start;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--line);
    }
    .definition, .review {
      margin-top: 14px;
      padding: 12px 14px;
      border-radius: 8px;
      background: var(--soft);
    }
    .review { background: #f4ece5; color: var(--muted); }
    .blocks {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
      margin-top: 16px;
    }
    .block {
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 14px;
      background: #fffaf3;
    }
    .refs { margin-top: 8px; color: var(--muted); font-size: 0.9rem; }
    .phrases, .citations {
      display: grid;
      gap: 10px;
      list-style: none;
      padding: 0;
      margin: 12px 0 0;
    }
    .phrases li, .citations li {
      border-left: 3px solid var(--accent);
      padding-left: 12px;
    }
    .phrases span {
      display: block;
      color: var(--muted);
      font-size: 0.78rem;
      text-transform: uppercase;
    }
    section { margin-top: 18px; }
    @media (max-width: 760px) {
      main { padding: 22px 14px 48px; }
      .hero, .blocks { grid-template-columns: 1fr; }
      .concept header { display: grid; }
    }
  </style>
</head>
<body>
  <main id="top">
    <section class="hero">
      <div>
        <p class="meta">Generated from ${escapeHtml(path.relative(root, bundlePath))}</p>
        <h1>V2 Content Preview</h1>
        <p>${escapeHtml(bundle.concepts.length)} approved concepts, ${escapeHtml(bundle.pathways.length)} intent pathways, ${escapeHtml(bundle.media.length)} media entries.</p>
        <nav class="nav" aria-label="Concepts">${conceptLinks}</nav>
      </div>
      <aside class="panel">
        <h2>Pathways</h2>
        <ul class="pathways">${pathways}</ul>
      </aside>
    </section>
    <section class="concepts">${concepts}</section>
  </main>
</body>
</html>`;
}

const bundle = readJson(bundlePath);
const review = readJson(reviewPath);
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outPath, renderPreview(bundle, review));
console.log(`Generated ${path.relative(root, outPath)}`);
