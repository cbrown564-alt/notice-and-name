#!/usr/bin/env node

/**
 * Task-oriented media review HTML.
 * Run: node scripts/preview-media-master-sheet.js
 *
 * Open: content/media-review/index.html
 * Serve (videos): npx serve -p 4173 → /content/media-review/
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SHEET_PATH = path.join(ROOT, 'data/media-master-sheet.json');
const REFERENCE_PATH = path.join(ROOT, 'data/reference-renders.json');
const OUT_DIR = path.join(ROOT, 'content/media-review');
const OUT_PATH = path.join(OUT_DIR, 'index.html');

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function mediaUrl(repoPath) {
  if (!repoPath || repoPath.startsWith('native://')) return null;
  return `../../${repoPath.split(path.sep).join('/')}`;
}

function isImage(p) {
  return p && /\.(png|jpe?g|gif|webp|svg)$/i.test(p);
}

function isVideo(p) {
  return p && /\.(mp4|webm|mov)$/i.test(p);
}

function formatBytes(bytes) {
  if (bytes == null) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function badgeClass(prefix, value) {
  return `${prefix}-${String(value || 'unknown').replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`;
}

function rowByPath(rows, repoPath) {
  return rows.find((r) => r.path === repoPath) || null;
}

function renderMedia(row, className = 'preview') {
  if (!row) {
    return `<div class="${className} placeholder"><span>Missing</span></div>`;
  }
  const url = mediaUrl(row.path);
  if (row.slot === 'diagram') {
    return `<div class="${className} placeholder diagram"><span>Native diagram</span><small>${escapeHtml(row.concept_id)}</small></div>`;
  }
  if (url && isVideo(row.path)) {
    return `<video class="${className} video" src="${escapeHtml(url)}" controls muted playsinline preload="metadata"></video>`;
  }
  if (url && isImage(row.path)) {
    return `<img class="${className} image" src="${escapeHtml(url)}" alt="" loading="lazy">`;
  }
  return `<div class="${className} placeholder"><span>No preview</span></div>`;
}

function renderPreviewButton(row, extra = '') {
  if (!row) return renderMedia(null);
  return `<button type="button" class="previewButton" data-lightbox="${escapeHtml(row.path)}" ${extra} aria-label="Enlarge">${renderMedia(row, 'preview')}</button>`;
}

function decisionControls(taskId, options) {
  const opts = options
    .map(
      (o) =>
        `<button type="button" class="decisionBtn" data-task="${escapeHtml(taskId)}" data-value="${escapeHtml(o.value)}">${escapeHtml(o.label)}</button>`
    )
    .join('');
  return `<div class="decisionBar" data-task="${escapeHtml(taskId)}">${opts}<span class="decisionStatus" data-task-status="${escapeHtml(taskId)}">Not reviewed</span></div>`;
}

function buildStyleAuditConcepts(rows) {
  const concepts = new Map();

  for (const row of rows) {
    if (!row.concept_id) continue;
    if (row.location_tier === 'production' && row.is_production_canonical) {
      if (!['illustration', 'thumbnail'].includes(row.slot)) continue;
      if (!concepts.has(row.concept_id)) {
        concepts.set(row.concept_id, {
          id: row.concept_id,
          category: row.category,
          illustration: null,
          thumbnail: null,
          video: null,
          diagram: null,
        });
      }
      concepts.get(row.concept_id)[row.slot] = row;
    }
  }

  for (const row of rows) {
    if (row.slot === 'diagram') {
      if (!concepts.has(row.concept_id)) {
        concepts.set(row.concept_id, {
          id: row.concept_id,
          category: row.category,
          illustration: null,
          thumbnail: null,
          video: null,
          diagram: null,
        });
      }
      concepts.get(row.concept_id).diagram = row;
    }
    if (row.slot === 'video' && row.location_tier === 'production') {
      if (concepts.has(row.concept_id)) {
        concepts.get(row.concept_id).video = row;
      }
    }
  }

  return [...concepts.values()].sort((a, b) => a.id.localeCompare(b.id));
}

function renderStyleAuditSection(concepts) {
  const cards = concepts
    .map((c) => {
      const ill = c.illustration;
      const style = ill?.style_family || '—';
      const fit = ill?.style_bible_fit || '—';
      const taskId = `style:${c.id}`;

      return `
        <article class="taskCard styleCard" id="style-${escapeHtml(c.id)}"
          data-concept="${escapeHtml(c.id)}"
          data-category="${escapeHtml(c.category || '')}"
          data-style="${escapeHtml(style)}"
          data-fit="${escapeHtml(fit)}"
          data-task="${escapeHtml(taskId)}">
          <header class="taskHeader">
            <div>
              <h2>${escapeHtml(c.id)}</h2>
              <p>${escapeHtml(c.category || 'concept')} · plate style: <strong>${escapeHtml(style)}</strong></p>
            </div>
            <div class="badges">
              ${c.diagram ? '<span class="badge slot">native diagram</span>' : ''}
              ${c.video ? '<span class="badge slot">has video</span>' : ''}
              <span class="badge fit ${badgeClass('fit', fit)}">${escapeHtml(fit)}</span>
            </div>
          </header>
          <p class="taskPrompt">Does this production plate match <em>Scientific Warmth</em> for its category? Thumbnail should feel related to the plate.</p>
          <div class="compareRow">
            <div class="compareCol production">
              <div class="compareColHeader">Production plate</div>
              ${renderPreviewButton(ill, 'data-compare-group="style-' + escapeHtml(c.id) + '"')}
              <div class="compareMeta">
                <p class="path">${escapeHtml(ill?.path || 'missing')}</p>
                <p class="compareFacts">${escapeHtml(formatBytes(ill?.bytes))}${ill?.wired_in_vocab ? ' · wired' : ''}</p>
                ${ill?.registry_notes ? `<p class="notes">${escapeHtml(ill.registry_notes)}</p>` : ''}
              </div>
            </div>
            <div class="compareCol production secondary">
              <div class="compareColHeader">Production thumbnail</div>
              ${renderPreviewButton(c.thumbnail, 'data-compare-group="style-' + escapeHtml(c.id) + '-thumb"')}
              <div class="compareMeta">
                <p class="path">${escapeHtml(c.thumbnail?.path || 'missing')}</p>
                <p class="compareFacts">${escapeHtml(formatBytes(c.thumbnail?.bytes))}</p>
              </div>
            </div>
          </div>
          ${decisionControls(taskId, [
            { value: 'keep', label: 'Keep' },
            { value: 'regen', label: 'Regen plate' },
            { value: 'regen-thumb', label: 'Regen thumb only' },
          ])}
        </article>
      `;
    })
    .join('');

  return { html: cards, count: concepts.length };
}

function buildReferenceSections(rows, referenceData) {
  const families = referenceData?.families || {};
  const sections = Object.entries(families)
    .map(([family, meta]) => {
      const shipped = rowByPath(rows, meta.referencePath);
      const candidate = rowByPath(rows, meta.candidatePath);
      const candidateMissing = meta.candidatePath && !candidate && !fs.existsSync(path.join(ROOT, meta.candidatePath));
      const taskId = `reference:${family}`;

      return `
        <article class="taskCard referenceCard" id="reference-${escapeHtml(family)}"
          data-family="${escapeHtml(family)}"
          data-task="${escapeHtml(taskId)}">
          <header class="taskHeader">
            <div>
              <h2>${escapeHtml(family)} family</h2>
              <p>Exemplar concept: <strong>${escapeHtml(meta.conceptId)}</strong> · ${escapeHtml(meta.status || 'unknown')}</p>
            </div>
            <div class="badges">
              <span class="badge fit-matches">style ${escapeHtml(String(meta.scores?.styleCoherence ?? '—'))}/5</span>
            </div>
          </header>
          <p class="taskPrompt">Reference renders ratified the style bible. Shipped plate is canonical — decide whether to keep the candidate PNG for documentation.</p>
          <div class="compareRow">
            <div class="compareCol production">
              <div class="compareColHeader">Shipped plate</div>
              ${renderPreviewButton(shipped, 'data-compare-group="ref-' + escapeHtml(family) + '"')}
              <div class="compareMeta">
                <p class="path">${escapeHtml(meta.referencePath)}</p>
                ${meta.notes ? `<p class="notes">${escapeHtml(meta.notes)}</p>` : ''}
              </div>
            </div>
            <div class="compareCol staging">
              <div class="compareColHeader">Reference candidate</div>
              ${
                candidateMissing
                  ? `<div class="preview placeholder missing"><span>File removed</span><small>${escapeHtml(meta.candidatePath)}</small></div>`
                  : renderPreviewButton(candidate, 'data-compare-group="ref-' + escapeHtml(family) + '"')
              }
              <div class="compareMeta">
                <p class="path">${escapeHtml(meta.candidatePath || '—')}</p>
                <p class="compareFacts">${escapeHtml(meta.generatorHint || '')}</p>
              </div>
            </div>
          </div>
          ${decisionControls(taskId, [
            { value: 'archive', label: 'Archive candidate' },
            { value: 'keep', label: 'Keep candidate' },
          ])}
        </article>
      `;
    })
    .join('');

  return { html: sections, count: Object.keys(families).length };
}

function buildVideoGroups(rows) {
  const groups = new Map();

  for (const row of rows) {
    if (row.slot !== 'video' || !row.concept_id) continue;
    if (row.location_tier === 'ios-copy') continue;
    if (!['production', 'video-original'].includes(row.location_tier)) continue;

    if (!groups.has(row.concept_id)) {
      groups.set(row.concept_id, {
        id: row.concept_id,
        category: row.category,
        shipped: null,
        masters: [],
      });
    }
    const g = groups.get(row.concept_id);
    if (row.location_tier === 'production') g.shipped = row;
    else g.masters.push(row);
  }

  for (const g of groups.values()) {
    g.masters.sort((a, b) => a.path.localeCompare(b.path));
  }

  return [...groups.values()].sort((a, b) => a.id.localeCompare(b.id));
}

function renderVideoSections(groups) {
  const cards = groups
    .map((g) => {
      const taskId = `video:${g.id}`;
      const shipped = g.shipped;
      const orphan = !shipped && g.masters.length > 0;

      const masterCols = g.masters
        .map((row) => {
          const label = path.basename(row.path);
          return `
            <div class="compareCol staging">
              <div class="compareColHeader">Master · ${escapeHtml(label)}</div>
              ${renderPreviewButton(row, 'data-compare-group="video-' + escapeHtml(g.id) + '"')}
              <div class="compareMeta">
                <p class="path">${escapeHtml(row.path)}</p>
                <p class="compareFacts">${escapeHtml(formatBytes(row.bytes))}</p>
              </div>
            </div>
          `;
        })
        .join('');

      return `
        <article class="taskCard videoCard" id="video-${escapeHtml(g.id)}"
          data-concept="${escapeHtml(g.id)}"
          data-orphan="${orphan ? 'true' : 'false'}"
          data-task="${escapeHtml(taskId)}">
          <header class="taskHeader">
            <div>
              <h2>${escapeHtml(g.id)}</h2>
              <p>${escapeHtml(g.category || 'concept')}${orphan ? ' · not shipped (masters only)' : shipped?.wired_in_vocab ? ' · wired in app' : ''}</p>
            </div>
          </header>
          <p class="taskPrompt">${orphan ? 'These source files are not bundled. Safe to delete if you will not re-transcode.' : 'Compare shipped MP4 against source masters. Keep masters until transcodes are final.'}</p>
          <div class="compareRow">
            ${
              shipped
                ? `
              <div class="compareCol production">
                <div class="compareColHeader">Shipped MP4</div>
                ${renderPreviewButton(shipped, 'data-compare-group="video-' + escapeHtml(g.id) + '"')}
                <div class="compareMeta">
                  <p class="path">${escapeHtml(shipped.path)}</p>
                  <p class="compareFacts">${escapeHtml(formatBytes(shipped.bytes))}${shipped.wired_in_vocab ? ' · wired' : ''}</p>
                </div>
              </div>`
                : `
              <div class="compareCol missingCol">
                <div class="compareColHeader">Shipped MP4</div>
                <div class="preview placeholder"><span>None</span></div>
              </div>`
            }
            ${masterCols}
          </div>
          ${decisionControls(taskId, [
            { value: 'keep-masters', label: 'Keep masters' },
            { value: 'delete-masters', label: 'Delete masters' },
            ...(orphan ? [{ value: 'delete-now', label: 'Delete now (orphan)' }] : []),
          ])}
        </article>
      `;
    })
    .join('');

  return { html: cards, count: groups.length };
}

function buildHtml(payload, referenceData) {
  const { summary, rows } = payload;
  const styleAudit = renderStyleAuditSection(buildStyleAuditConcepts(rows));
  const reference = buildReferenceSections(rows, referenceData);
  const video = renderVideoSections(buildVideoGroups(rows));

  const categories = [...new Set(styleAudit.count ? buildStyleAuditConcepts(rows).map((c) => c.category).filter(Boolean) : [])].sort();
  const styles = [...new Set(rows.filter((r) => r.slot === 'illustration' && r.is_production_canonical).map((r) => r.style_family).filter(Boolean))].sort();

  const categoryOptions = categories.map((c) => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join('');
  const styleOptions = styles.map((s) => `<option value="${escapeHtml(s)}">${escapeHtml(s)}</option>`).join('');

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Media Review</title>
  <style>
    :root {
      color-scheme: light;
      --canvas: #f3efe8;
      --ink: #2a2420;
      --muted: #6f645c;
      --line: #ddd3c8;
      --surface: #fffdf9;
      --accent: #8b4a45;
      --soft: #ebe1d8;
      --ok: #4f6f55;
      --warn: #9a6b2f;
      --bad: #9a4545;
    }
    * { box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body { margin: 0; background: var(--canvas); color: var(--ink); font-family: Inter, ui-sans-serif, system-ui, sans-serif; line-height: 1.45; }
    h1, h2 { margin: 0; font-family: Georgia, serif; line-height: 1.1; }
    h1 { font-size: clamp(1.8rem, 4vw, 2.4rem); }
    h2 { font-size: 1.2rem; }
    p { margin: 0; }
    main { max-width: 1200px; margin: 0 auto; padding: 24px 18px 80px; }
    .hero { display: grid; gap: 14px; padding-bottom: 16px; border-bottom: 1px solid var(--line); margin-bottom: 16px; }
    .metaLine { color: var(--muted); font-size: 0.92rem; }
    .taskList { display: grid; gap: 8px; margin: 0 0 16px; padding: 0; list-style: none; }
    .taskList li { padding: 10px 12px; background: var(--surface); border: 1px solid var(--line); border-radius: 8px; font-size: 0.92rem; }
    .taskList strong { color: var(--accent); }
    .toolbar {
      position: sticky; top: 0; z-index: 20; display: grid; gap: 10px;
      padding: 12px 14px; margin: 0 -18px 16px;
      background: rgba(243,239,232,0.95); backdrop-filter: blur(8px); border-bottom: 1px solid var(--line);
    }
    .toolbarRow { display: flex; flex-wrap: wrap; gap: 10px; align-items: end; }
    .viewTabs { display: inline-flex; border: 1px solid var(--line); border-radius: 8px; overflow: hidden; background: var(--surface); }
    .viewTabs button { border: 0; background: transparent; padding: 8px 12px; cursor: pointer; font: inherit; }
    .viewTabs button[aria-selected="true"] { background: var(--accent); color: white; }
    label { display: grid; gap: 4px; font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.04em; color: var(--muted); }
    input, select, button { font: inherit; color: var(--ink); }
    input, select { min-height: 36px; border: 1px solid var(--line); border-radius: 8px; background: var(--surface); padding: 6px 10px; }
    .panel { display: none; } .panel.active { display: block; }
    .panelIntro { margin-bottom: 16px; padding: 12px 14px; background: var(--surface); border: 1px solid var(--line); border-radius: 8px; font-size: 0.92rem; }
    .progressBar { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; margin-bottom: 16px; font-size: 0.88rem; }
    .progressBar strong { font-size: 1rem; }
    .jumpNav { display: flex; flex-wrap: wrap; gap: 6px; max-height: 88px; overflow: auto; }
    .jumpNav a { display: inline-flex; align-items: center; min-height: 28px; padding: 2px 8px; border: 1px solid var(--line); border-radius: 999px; background: var(--surface); text-decoration: none; font-size: 0.82rem; color: var(--ink); }
    .jumpNav a.done { background: #e5efe7; border-color: #b8cfc0; }
    .taskCard { background: var(--surface); border: 1px solid var(--line); border-radius: 12px; padding: 16px; scroll-margin-top: 100px; }
    .taskCard + .taskCard { margin-top: 16px; }
    .taskCard.reviewed { box-shadow: inset 0 0 0 2px rgba(79,111,85,0.25); }
    .taskCard.hidden { display: none; }
    .taskHeader { display: flex; justify-content: space-between; gap: 12px; align-items: start; margin-bottom: 10px; }
    .taskHeader p { color: var(--muted); font-size: 0.88rem; margin-top: 4px; }
    .taskPrompt { font-size: 0.88rem; color: var(--muted); margin-bottom: 12px; }
    .compareRow { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr)); gap: 12px; }
    .compareCol { background: #fffaf3; border: 2px solid var(--line); border-radius: 10px; overflow: hidden; display: grid; grid-template-rows: auto auto 1fr; }
    .compareCol.production { border-color: var(--ok); }
    .compareCol.staging { border-color: #c9a24a; }
    .compareCol.secondary { border-color: #8aa4c9; }
    .compareColHeader { padding: 8px 10px; font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid var(--line); background: rgba(255,255,255,0.7); }
    .compareCol.production .compareColHeader { color: var(--ok); background: #eef5ef; }
    .compareCol.staging .compareColHeader { color: #8a6420; background: #fbf4e7; }
    .compareCol.secondary .compareColHeader { color: #4a608a; background: #eef2f8; }
    .previewButton { display: block; width: 100%; padding: 0; border: 0; background: #f8f4ee; cursor: zoom-in; }
    .preview { display: block; width: 100%; aspect-ratio: 1; object-fit: contain; min-height: 240px; background: repeating-conic-gradient(#eee 0% 25%, #f8f8f8 0% 50%) 0 0 / 16px 16px; }
    .preview.placeholder, .preview.placeholder.missing { display: grid; place-content: center; gap: 4px; color: var(--muted); font-size: 0.85rem; text-align: center; padding: 12px; min-height: 240px; }
    .preview.placeholder.diagram { background: linear-gradient(135deg, #efe8df, #f7f2ea); }
    .compareMeta { padding: 10px; display: grid; gap: 6px; }
    .path { font-family: ui-monospace, Menlo, monospace; font-size: 0.68rem; color: var(--muted); word-break: break-all; }
    .compareFacts, .notes { font-size: 0.82rem; color: var(--muted); }
    .notes { border-left: 3px solid var(--line); padding-left: 8px; }
    .badges { display: flex; flex-wrap: wrap; gap: 6px; }
    .badge { display: inline-flex; align-items: center; min-height: 22px; padding: 0 8px; border-radius: 999px; font-size: 0.7rem; text-transform: uppercase; background: var(--soft); color: var(--muted); }
    .badge.fit-matches { background: #e5efe7; color: var(--ok); }
    .decisionBar { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; margin-top: 14px; padding-top: 14px; border-top: 1px solid var(--line); }
    .decisionBtn { border: 1px solid var(--line); border-radius: 999px; padding: 6px 12px; background: var(--surface); cursor: pointer; font-size: 0.85rem; }
    .decisionBtn.selected { background: var(--accent); border-color: var(--accent); color: white; }
    .decisionStatus { margin-left: auto; font-size: 0.82rem; color: var(--muted); }
    .decisionStatus.set { color: var(--ok); font-weight: 600; }
    .styleLegend { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px; font-size: 0.82rem; }
    .styleLegend span { padding: 4px 8px; border-radius: 6px; background: var(--soft); }
    .lightbox { position: fixed; inset: 0; display: none; place-items: center; padding: 24px; background: rgba(20,16,14,0.85); z-index: 100; }
    .lightbox.open { display: grid; }
    .lightboxInner { width: min(1100px, 100%); display: grid; gap: 10px; }
    .lightboxCompare { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 400px), 1fr)); gap: 14px; }
    .lightboxPanelLabel { color: #f5f0ea; font-size: 0.75rem; text-transform: uppercase; opacity: 0.9; }
    .lightboxMedia { width: 100%; max-height: 70vh; object-fit: contain; background: #111; border-radius: 8px; }
    .lightboxCaption { color: #f5f0ea; font-size: 0.82rem; word-break: break-all; }
    .lightboxClose { position: fixed; top: 16px; right: 16px; border: 0; border-radius: 999px; width: 40px; height: 40px; background: rgba(255,255,255,0.15); color: white; font-size: 1.4rem; cursor: pointer; }
    .panelTools { display: none; } .panelTools.active { display: flex; flex-wrap: wrap; gap: 10px; align-items: end; }
    @media (max-width: 760px) { main { padding-inline: 12px; } .toolbar { margin-inline: -12px; } .decisionStatus { margin-left: 0; width: 100%; } }
  </style>
</head>
<body>
  <main>
    <header class="hero">
      <p class="metaLine">Generated ${escapeHtml(summary.generated_at.slice(0, 10))}</p>
      <h1>Media review</h1>
      <ol class="taskList">
        <li><strong>1 · Style audit</strong> — Review all ${styleAudit.count} production concept plates for coherence.</li>
        <li><strong>2 · Reference renders</strong> — Decide whether to keep or archive ${reference.count} style-bible candidates.</li>
        <li><strong>3 · Video masters</strong> — Compare ${video.count} video groups: shipped MP4 vs source files.</li>
      </ol>
    </header>

    <div class="toolbar">
      <div class="toolbarRow">
        <div class="viewTabs" role="tablist">
          <button type="button" role="tab" id="tab-style" aria-selected="true" aria-controls="panel-style">1 · Style audit</button>
          <button type="button" role="tab" id="tab-reference" aria-selected="false" aria-controls="panel-reference">2 · References</button>
          <button type="button" role="tab" id="tab-video" aria-selected="false" aria-controls="panel-video">3 · Video masters</button>
        </div>
        <label><span>&nbsp;</span><button type="button" id="exportDecisions">Export decisions</button></label>
        <label><span>&nbsp;</span><button type="button" id="clearDecisions">Clear saved</button></label>
      </div>
      <div class="toolbarRow panelTools active" id="tools-style">
        <label>Category <select id="filter-category"><option value="">All</option>${categoryOptions}</select></label>
        <label>Plate style <select id="filter-style-family"><option value="">All</option>${styleOptions}</select></label>
        <label><span>&nbsp;</span><label style="text-transform:none;font-size:0.88rem;"><input type="checkbox" id="filter-unreviewed"> Unreviewed only</label></label>
      </div>
      <div class="toolbarRow panelTools" id="tools-video">
        <label><span>&nbsp;</span><label style="text-transform:none;font-size:0.88rem;"><input type="checkbox" id="filter-orphans"> Orphans only (not shipped)</label></label>
      </div>
      <nav class="jumpNav" id="jumpNav"></nav>
    </div>

    <section class="panel active" id="panel-style" role="tabpanel">
      <div class="panelIntro">Scan plates for style coherence. <em>Scientific-anatomical</em> (technique/anatomy) vs <em>ethereal-abstract</em> (psychological) should still share the same cream canvas and palette.</div>
      <div class="styleLegend">
        <span>scientific-anatomical — cross-section / clarity</span>
        <span>ethereal-abstract — mood / metaphor</span>
        <span>scientific-warmth-plate — sensation / timing</span>
      </div>
      <div class="progressBar" id="progress-style">Reviewed: <strong>0</strong> / ${styleAudit.count}</div>
      <div id="styleCards">${styleAudit.html}</div>
    </section>

    <section class="panel" id="panel-reference" role="tabpanel" hidden>
      <div class="panelIntro">These PNGs in <code>assets/_staging/reference/</code> ratified the style bible per category family. Production plates already match the shipped path.</div>
      <div class="progressBar" id="progress-reference">Reviewed: <strong>0</strong> / ${reference.count}</div>
      <div id="referenceCards">${reference.html}</div>
    </section>

    <section class="panel" id="panel-video" role="tabpanel" hidden>
      <div class="panelIntro">Masters in <code>assets/videos/originals/</code> are re-transcode sources — not bundled. Shipped files live in <code>assets/videos/*.mp4</code>.</div>
      <div class="progressBar" id="progress-video">Reviewed: <strong>0</strong> / ${video.count}</div>
      <div id="videoCards">${video.html}</div>
    </section>
  </main>

  <div class="lightbox" id="lightbox" hidden>
    <button type="button" class="lightboxClose" id="lightboxClose" aria-label="Close">×</button>
    <div class="lightboxInner" id="lightboxInner"></div>
  </div>

  <script>
    const STORAGE_KEY = 'media-review-decisions-v2';
    const panels = {
      style: document.getElementById('panel-style'),
      reference: document.getElementById('panel-reference'),
      video: document.getElementById('panel-video'),
    };
    const tabs = {
      style: document.getElementById('tab-style'),
      reference: document.getElementById('tab-reference'),
      video: document.getElementById('tab-video'),
    };
    const panelTools = {
      style: document.getElementById('tools-style'),
      video: document.getElementById('tools-video'),
    };

    let activeView = 'style';
    let decisions = {};

    function loadDecisions() {
      try { decisions = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch { decisions = {}; }
    }
    function saveDecisions() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(decisions));
      refreshDecisionUI();
    }

    function setView(name) {
      activeView = name;
      for (const [key, panel] of Object.entries(panels)) {
        const on = key === name;
        panel.classList.toggle('active', on);
        panel.hidden = !on;
        tabs[key].setAttribute('aria-selected', on ? 'true' : 'false');
      }
      for (const [key, el] of Object.entries(panelTools)) {
        el.classList.toggle('active', key === name);
      }
      rebuildJumpNav();
      applyPanelFilters();
    }

    function refreshDecisionUI() {
      document.querySelectorAll('.decisionBar').forEach((bar) => {
        const task = bar.dataset.task;
        const value = decisions[task];
        bar.querySelectorAll('.decisionBtn').forEach((btn) => {
          btn.classList.toggle('selected', btn.dataset.value === value);
        });
        const status = bar.querySelector('[data-task-status]');
        const card = bar.closest('.taskCard');
        if (value) {
          status.textContent = 'Decision: ' + value;
          status.classList.add('set');
          card?.classList.add('reviewed');
        } else {
          status.textContent = 'Not reviewed';
          status.classList.remove('set');
          card?.classList.remove('reviewed');
        }
      });
      updateProgress('style', '#styleCards .taskCard', 'progress-style');
      updateProgress('reference', '#referenceCards .taskCard', 'progress-reference');
      updateProgress('video', '#videoCards .taskCard', 'progress-video');
      rebuildJumpNav();
    }

    function updateProgress(prefix, selector, elId) {
      const cards = document.querySelectorAll(selector);
      let done = 0;
      cards.forEach((card) => {
        const task = card.dataset.task;
        if (task && decisions[task]) done++;
      });
      const el = document.getElementById(elId);
      if (el) el.innerHTML = 'Reviewed: <strong>' + done + '</strong> / ' + cards.length;
    }

    function rebuildJumpNav() {
      const nav = document.getElementById('jumpNav');
      nav.innerHTML = '';
      const panel = panels[activeView];
      if (!panel) return;
      panel.querySelectorAll('.taskCard').forEach((card) => {
        if (card.classList.contains('hidden')) return;
        const a = document.createElement('a');
        a.href = '#' + card.id;
        a.textContent = card.dataset.concept || card.dataset.family || card.id;
        if (decisions[card.dataset.task]) a.classList.add('done');
        nav.appendChild(a);
      });
    }

    function applyPanelFilters() {
      if (activeView === 'style') {
        const cat = document.getElementById('filter-category').value;
        const style = document.getElementById('filter-style-family').value;
        const unreviewed = document.getElementById('filter-unreviewed').checked;
        document.querySelectorAll('#styleCards .taskCard').forEach((card) => {
          let show = true;
          if (cat && card.dataset.category !== cat) show = false;
          if (style && card.dataset.style !== style) show = false;
          if (unreviewed && decisions[card.dataset.task]) show = false;
          card.classList.toggle('hidden', !show);
        });
      }
      if (activeView === 'video') {
        const orphans = document.getElementById('filter-orphans').checked;
        document.querySelectorAll('#videoCards .taskCard').forEach((card) => {
          const show = !orphans || card.dataset.orphan === 'true';
          card.classList.toggle('hidden', !show);
        });
      }
      rebuildJumpNav();
    }

    document.querySelectorAll('.decisionBtn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const task = btn.dataset.task;
        decisions[task] = decisions[task] === btn.dataset.value ? null : btn.dataset.value;
        if (!decisions[task]) delete decisions[task];
        saveDecisions();
      });
    });

    for (const [name, tab] of Object.entries(tabs)) {
      tab.addEventListener('click', () => setView(name));
    }

    ['filter-category', 'filter-style-family'].forEach((id) => {
      document.getElementById(id)?.addEventListener('change', applyPanelFilters);
    });
    document.getElementById('filter-unreviewed')?.addEventListener('change', applyPanelFilters);
    document.getElementById('filter-orphans')?.addEventListener('change', applyPanelFilters);

    document.getElementById('exportDecisions').addEventListener('click', () => {
      const blob = new Blob([JSON.stringify(decisions, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'media-review-decisions.json';
      a.click();
      URL.revokeObjectURL(url);
    });

    document.getElementById('clearDecisions').addEventListener('click', () => {
      if (confirm('Clear all saved review decisions?')) {
        decisions = {};
        saveDecisions();
      }
    });

    const lightbox = document.getElementById('lightbox');
    const lightboxInner = document.getElementById('lightboxInner');

    function mediaFromButton(btn) {
      const preview = btn.querySelector('.preview');
      if (!preview) return null;
      if (preview.tagName === 'IMG') {
        const img = document.createElement('img');
        img.className = 'lightboxMedia';
        img.src = preview.src;
        return img;
      }
      if (preview.tagName === 'VIDEO') {
        const video = document.createElement('video');
        video.className = 'lightboxMedia';
        video.src = preview.src;
        video.controls = true;
        video.autoplay = true;
        return video;
      }
      return null;
    }

    document.body.addEventListener('click', (event) => {
      const btn = event.target.closest('[data-lightbox]');
      if (!btn) return;
      event.preventDefault();
      lightboxInner.innerHTML = '';
      const group = btn.dataset.compareGroup;
      const peers = group ? Array.from(document.querySelectorAll('[data-compare-group="' + group + '"]')) : [btn];
      const grid = document.createElement('div');
      grid.className = 'lightboxCompare';
      peers.forEach((peer) => {
        const panel = document.createElement('div');
        const label = document.createElement('div');
        label.className = 'lightboxPanelLabel';
        label.textContent = peer.closest('.compareCol')?.querySelector('.compareColHeader')?.textContent || peer.dataset.lightbox;
        panel.appendChild(label);
        const media = mediaFromButton(peer);
        if (media) panel.appendChild(media);
        grid.appendChild(panel);
      });
      lightboxInner.appendChild(grid);
      const cap = document.createElement('div');
      cap.className = 'lightboxCaption';
      cap.textContent = btn.dataset.lightbox;
      lightboxInner.appendChild(cap);
      lightbox.hidden = false;
      lightbox.classList.add('open');
    });

    document.getElementById('lightboxClose').addEventListener('click', () => {
      lightbox.classList.remove('open');
      lightbox.hidden = true;
      lightboxInner.innerHTML = '';
    });
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) document.getElementById('lightboxClose').click(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') document.getElementById('lightboxClose').click(); });

    loadDecisions();
    refreshDecisionUI();
    setView('style');
  </script>
</body>
</html>`;
}

function main() {
  if (!fs.existsSync(SHEET_PATH)) {
    console.error(`Missing ${path.relative(ROOT, SHEET_PATH)} — run: npm run media-master-sheet`);
    process.exit(1);
  }
  const payload = JSON.parse(fs.readFileSync(SHEET_PATH, 'utf8'));
  const referenceData = fs.existsSync(REFERENCE_PATH)
    ? JSON.parse(fs.readFileSync(REFERENCE_PATH, 'utf8'))
    : { families: {} };

  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(OUT_PATH, buildHtml(payload, referenceData));
  console.log(`Generated ${path.relative(ROOT, OUT_PATH)}`);
}

main();
