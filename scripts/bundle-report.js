/**
 * Asset bundle size report for ship planning (local assets only).
 * Run: npm run bundle-report
 * Writes: docs/reports/BUNDLE_REPORT.md
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const ASSETS_DIR = path.join(ROOT, 'assets');
const OUT_DIR = path.join(ROOT, 'docs/reports');
const OUT_PATH = path.join(OUT_DIR, 'BUNDLE_REPORT.md');

const SIZE_BUDGET = {
  illustration: 400 * 1024,
  thumbnail: 80 * 1024,
  video: 1.5 * 1024 * 1024,
};

const MEDIA_EXT = new Set([
  '.png',
  '.jpg',
  '.jpeg',
  '.webp',
  '.gif',
  '.mp4',
  '.mov',
  '.json',
  '.lottie',
]);

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (name === 'node_modules' || name === '_archive') continue;
      walk(full, files);
    } else {
      const ext = path.extname(name).toLowerCase();
      if (MEDIA_EXT.has(ext) || name.endsWith('.json')) {
        files.push({ rel: path.relative(ROOT, full), bytes: stat.size });
      }
    }
  }
  return files;
}

function formatKb(bytes) {
  return `${(bytes / 1024).toFixed(1)} KB`;
}

function formatMb(bytes) {
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function bucketFor(rel) {
  if (rel.includes('/videos/originals/')) return 'videos-originals';
  if (rel.includes('/illustrations/pilot/')) return 'pilot';
  if (rel.includes('/thumbnails/')) return 'thumbnails';
  if (rel.includes('/illustrations/')) return 'illustrations';
  if (rel.includes('/videos/')) return 'videos';
  if (rel.includes('/animations/')) return 'animations';
  if (rel.includes('/explainers/')) return 'explainers';
  if (rel.includes('/pathways/')) return 'pathways';
  if (rel.includes('/ui/')) return 'ui';
  if (rel.startsWith('assets/images/')) return 'images-other';
  return 'other';
}

function budgetFor(rel) {
  if (rel.includes('/thumbnails/')) return SIZE_BUDGET.thumbnail;
  if (rel.includes('/illustrations/') && rel.endsWith('.png')) return SIZE_BUDGET.illustration;
  if (rel.endsWith('.mp4') || rel.endsWith('.mov')) return SIZE_BUDGET.video;
  return null;
}

function main() {
  const files = walk(ASSETS_DIR);
  const total = files.reduce((s, f) => s + f.bytes, 0);

  const byBucket = {};
  for (const f of files) {
    const b = bucketFor(f.rel);
    if (!byBucket[b]) byBucket[b] = { count: 0, bytes: 0, files: [] };
    byBucket[b].count += 1;
    byBucket[b].bytes += f.bytes;
    byBucket[b].files.push(f);
  }

  const overBudget = files
    .map((f) => ({ ...f, budget: budgetFor(f.rel) }))
    .filter((f) => f.budget != null && f.bytes > f.budget)
    .sort((a, b) => b.bytes - a.bytes);

  const largest = [...files].sort((a, b) => b.bytes - a.bytes).slice(0, 25);

  const shippedBytes =
    total -
    (byBucket['videos-originals']?.bytes || 0) -
    (byBucket['pilot']?.bytes || 0);

  const date = new Date().toISOString().slice(0, 10);
  const lines = [
    '# Bundle / Asset Size Report',
    '',
    `**Generated:** ${date}`,
    '**Regenerate:** `npm run bundle-report`',
    '',
    'On-disk sizes under `assets/` (what ships in the app binary). JS bundle not included — run EAS build analytics for full binary size.',
    '',
    '## Summary',
    '',
    `| Metric | Value |`,
    `|--------|-------|`,
    `| Total asset files | ${files.length} |`,
    `| Total asset size | **${formatMb(total)}** (${total.toLocaleString()} bytes) |`,
    `| Est. shipped (excl. originals + pilot) | **${formatMb(shippedBytes)}** |`,
    `| Over post-compress budget | ${overBudget.length} files |`,
    '',
    '## By category',
    '',
    '| Category | Files | Size | % of total |',
    '|----------|------:|-----:|-----------:|',
  ];

  const bucketOrder = [
    'illustrations',
    'thumbnails',
    'videos',
    'videos-originals',
    'pilot',
    'ui',
    'pathways',
    'explainers',
    'animations',
    'images-other',
    'other',
  ];

  for (const key of bucketOrder) {
    const row = byBucket[key];
    if (!row) continue;
    const pct = ((row.bytes / total) * 100).toFixed(1);
    lines.push(`| ${key} | ${row.count} | ${formatMb(row.bytes)} | ${pct}% |`);
  }

  lines.push('', '## Size budgets (reference)', '', '| Type | Budget |', '|------|--------|');
  lines.push(`| Illustration PNG | ${formatKb(SIZE_BUDGET.illustration)} |`);
  lines.push(`| Thumbnail PNG | ${formatKb(SIZE_BUDGET.thumbnail)} |`);
  lines.push(`| Video MP4 | ${formatKb(SIZE_BUDGET.video)} |`);

  lines.push('', '## Over budget', '');
  if (overBudget.length === 0) {
    lines.push('_None — all budgeted assets within limits._');
  } else {
    lines.push('| File | Size | Budget | Over by |', '|------|-----:|-------:|--------:|');
    for (const f of overBudget) {
      const over = f.bytes - f.budget;
      lines.push(
        `| \`${f.rel}\` | ${formatKb(f.bytes)} | ${formatKb(f.budget)} | +${formatKb(over)} |`
      );
    }
  }

  lines.push('', '## Largest files (top 25)', '', '| File | Size |', '|------|-----:|');
  for (const f of largest) {
    lines.push(`| \`${f.rel}\` | ${formatKb(f.bytes)} |`);
  }

  lines.push('', '## Notes', '');
  lines.push('- Regenerate after Phase 3 asset batches; compare total MB before/after `compress-assets`.');
  lines.push('- `assets/videos/originals/` may be large — exclude from production bundle if not imported in code.');
  lines.push('- Run `npm run validate-manifest` for wiring + budget warnings tied to vocabulary.');

  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(OUT_PATH, `${lines.join('\n')}\n`);
  console.log(`Wrote ${OUT_PATH}`);
  console.log(`Total: ${formatMb(total)} across ${files.length} files`);
  console.log(`Over budget: ${overBudget.length}`);
}

main();
