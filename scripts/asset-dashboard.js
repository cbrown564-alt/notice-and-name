/**
 * Asset production progress dashboard (terminal + optional markdown report).
 * Run: node scripts/asset-dashboard.js [--write]
 */

const fs = require('fs');
const path = require('path');
const {
  ROOT,
  PATHS,
  loadConcepts,
  loadVisualFormats,
  loadCopyReviewedIds,
  loadQaPassedIds,
  SIZE_BUDGET,
  videoBudgetForConcept,
  fileBytes,
} = require('./lib/vocab-parse');

const REPORT_PATH = path.join(ROOT, 'docs/reports/ASSET_DASHBOARD.md');
const WRITE = process.argv.includes('--write');

function countBy(concepts, predicate) {
  return concepts.filter(predicate).length;
}

function formatKb(bytes) {
  if (bytes == null) return '—';
  return `${(bytes / 1024).toFixed(0)} KB`;
}

function loadRegistry() {
  if (!fs.existsSync(PATHS.registry)) return null;
  return JSON.parse(fs.readFileSync(PATHS.registry, 'utf8'));
}

function main() {
  const concepts = loadConcepts();
  const { formats, videoProfiles } = loadVisualFormats();
  const copyReviewed = loadCopyReviewedIds();
  const qaPassed = loadQaPassedIds();
  const registry = loadRegistry();

  const thumbsOnDisk = countBy(concepts, (c) =>
    fs.existsSync(path.join(ROOT, `assets/images/concepts/thumbnails/${c.id}.png`))
  );
  const thumbsWired = countBy(concepts, (c) => c.conceptLevelThumb);
  const videosWired = countBy(concepts, (c) => c.videoFile);
  const videoFormatCount = Object.values(formats).filter((f) => f === 'video').length;
  const interactiveCount = Object.values(formats).filter((f) => f.startsWith('interactive')).length;
  const interactiveWired = countBy(
    concepts,
    (c) => c.diagramType && formats[c.id]?.startsWith('interactive')
  );

  let overBudget = 0;
  for (const c of concepts) {
    const tb = fileBytes(`assets/images/concepts/thumbnails/${c.id}.png`);
    const ib = fileBytes(`assets/images/concepts/illustrations/${c.id}.png`);
    if (tb != null && tb > SIZE_BUDGET.thumbnail) overBudget++;
    if (ib != null && ib > SIZE_BUDGET.illustration) overBudget++;
    if (c.videoFile) {
      const vb = fileBytes(`assets/videos/${c.videoFile}`);
      const budget = videoBudgetForConcept(c.id, videoProfiles);
      if (vb != null && vb > budget) overBudget++;
    }
  }

  const p0Videos = Object.entries(videoProfiles)
    .filter(([, p]) => p.priority === 'P0')
    .map(([id]) => id);

  const lines = [];
  const out = (s = '') => lines.push(s);

  out('Asset production dashboard');
  out('═'.repeat(40));
  out(`Concepts:              ${concepts.length}`);
  out(`Format lock:           ${Object.keys(formats).length}/${concepts.length}`);
  out(`Copy reviewed:         ${copyReviewed.size}/${concepts.length}`);
  out(`Device QA passed:      ${qaPassed.size}/${concepts.length}`);
  out('');
  out('Thumbnails:            ' + `${thumbsOnDisk} on disk / ${thumbsWired} wired`);
  out('Illustrations:         ' + `${countBy(concepts, (c) => fs.existsSync(path.join(ROOT, `assets/images/concepts/illustrations/${c.id}.png`)))} on disk`);
  out('Videos:                ' + `${videosWired}/${videoFormatCount} wired (format lock)`);
  out('Interactive:           ' + `${interactiveWired}/${interactiveCount} wired`);
  out(`Over size budget:      ${overBudget} assets ⚠️`);
  out('');

  if (registry) {
    out('Registry:              ' + PATHS.registry.replace(ROOT + '/', ''));
    out(`Last synced:           ${registry._meta?.updated || 'unknown'}`);
    out('');
  } else {
    out('Registry:              not found — run npm run sync-registry');
    out('');
  }

  out('P0 video concepts:');
  for (const id of p0Videos) {
    const c = concepts.find((x) => x.id === id);
    const wired = c?.videoFile ? '✅ wired' : '☐ TBD';
    out(`  ${id.padEnd(22)} ${wired}`);
  }
  out('');

  const missingVideo = concepts.filter((c) => formats[c.id] === 'video' && !c.videoFile);
  if (missingVideo.length) {
    out(`Video TBD (${missingVideo.length}): ${missingVideo.map((c) => c.id).join(', ')}`);
  }

  const text = lines.join('\n');
  console.log('\n' + text + '\n');

  if (WRITE) {
    const md = [
      '# Asset Dashboard',
      '',
      `**Generated:** ${new Date().toISOString().slice(0, 10)}`,
      '**Refresh:** `npm run asset-dashboard -- --write`',
      '',
      '```',
      text,
      '```',
      '',
      '## P0 video status',
      '',
      '| concept | wired | tier |',
      '|---------|-------|------|',
      ...p0Videos.map((id) => {
        const c = concepts.find((x) => x.id === id);
        const profile = videoProfiles[id];
        return `| ${id} | ${c?.videoFile ? '✅' : '☐'} | ${profile?.tier || '—'} |`;
      }),
      '',
    ].join('\n');
    fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
    fs.writeFileSync(REPORT_PATH, md);
    console.log(`Wrote ${REPORT_PATH}`);
  }
}

main();
