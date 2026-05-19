/**
 * Validate format lock, filesystem assets, and vocabulary wiring.
 * Run: node scripts/validate-manifest.js
 * Exit 0 = pass, 1 = failures (for future CI).
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const VOCAB_PATH = path.join(ROOT, 'data/vocabulary.ts');
const FORMAT_PATH = path.join(ROOT, 'data/visual-formats.json');

const errors = [];
const warnings = [];

/** Post-compress budgets — STYLE_BIBLE / IMAGE_GENERATION.md */
const SIZE_BUDGET = {
  illustration: 400 * 1024,
  thumbnail: 80 * 1024,
  video: 1.5 * 1024 * 1024,
};

function fileBytes(rel) {
  const p = path.join(ROOT, rel);
  if (!fs.existsSync(p)) return null;
  return fs.statSync(p).size;
}

function warnIfOverBudget(rel, budget, label) {
  const bytes = fileBytes(rel);
  if (bytes == null) return;
  if (bytes > budget) {
    warnings.push(`${label}: ${rel} is ${(bytes / 1024).toFixed(0)} KB (budget ${(budget / 1024).toFixed(0)} KB)`);
  }
}

function exists(rel) {
  return fs.existsSync(path.join(ROOT, rel));
}

function parseConcepts(source) {
  const concepts = [];
  const blockRe = /\{\s*\n\s*id: '([^']+)'([\s\S]*?)\n  \},(?=\s*\n\s*(?:\/\/|{|\]))/g;
  const body = source.slice(source.indexOf('export const concepts'));
  let m;
  while ((m = blockRe.exec(body)) !== null) {
    const id = m[1];
    const block = m[2];
    const diagramType = (block.match(/diagramType: '([^']+)'/) || [])[1] || '';
    const videoMatch = block.match(/videos\/([^']+)\.(mov|mp4)/);
    const illMatch = block.match(/illustrations\/([^']+)\.png/);
    const thumbMatch = block.match(/thumbnails\/([^']+)\.png/);
    concepts.push({
      id,
      diagramType,
      videoFile: videoMatch ? `${videoMatch[1]}.${videoMatch[2]}` : null,
      illustrationId: illMatch ? illMatch[1] : null,
      thumbOnIllustrate: /illustrate[\s\S]*?thumbnails\//.test(block),
    });
  }
  return concepts;
}

function main() {
  const formats = JSON.parse(fs.readFileSync(FORMAT_PATH, 'utf8')).formats;
  const vocab = fs.readFileSync(VOCAB_PATH, 'utf8');
  const concepts = parseConcepts(vocab);
  const formatIds = new Set(Object.keys(formats));
  const conceptIds = new Set(concepts.map((c) => c.id));

  for (const id of conceptIds) {
    if (!formatIds.has(id)) errors.push(`Missing format lock for concept: ${id}`);
  }
  for (const id of formatIds) {
    if (!conceptIds.has(id)) errors.push(`Format lock orphan (no concept): ${id}`);
  }

  for (const c of concepts) {
    const format = formats[c.id];
    const thumbPath = `assets/images/concepts/thumbnails/${c.id}.png`;

    if (!exists(thumbPath)) {
      warnings.push(`${c.id}: missing thumbnail`);
    } else {
      warnIfOverBudget(thumbPath, SIZE_BUDGET.thumbnail, c.id);
    }

    if (format?.startsWith('interactive') && !c.diagramType) {
      if (format.includes('planned')) {
        warnings.push(`${c.id}: interactive planned but no diagramType yet`);
      } else {
        errors.push(`${c.id}: format interactive but diagramType missing`);
      }
    }

    if (format === 'video' && !c.videoFile) {
      warnings.push(`${c.id}: format video but no illustrationVideo wired`);
    }

    if (c.videoFile) {
      const vp = `assets/videos/${c.videoFile}`;
      if (!exists(vp)) {
        errors.push(`${c.id}: wired video missing on disk: ${vp}`);
      } else {
        warnIfOverBudget(vp, SIZE_BUDGET.video, c.id);
      }
      if (c.videoFile.endsWith('.mov')) {
        errors.push(`${c.id}: .mov in vocabulary — use MP4 only: ${vp}`);
      }
    }

    if (c.thumbOnIllustrate) {
      warnings.push(`${c.id}: illustrate slide uses thumbnail path — prefer illustrations/`);
    }

    if (c.illustrationId) {
      const illPath = `assets/images/concepts/illustrations/${c.illustrationId}.png`;
      if (!exists(illPath)) {
        errors.push(`${c.id}: wired illustration missing: ${illPath}`);
      } else {
        warnIfOverBudget(illPath, SIZE_BUDGET.illustration, c.id);
      }
    }
  }

  const videoDir = path.join(ROOT, 'assets/videos');
  if (exists('assets/videos')) {
    for (const name of fs.readdirSync(videoDir)) {
      if (name.endsWith('.mov')) {
        errors.push(`Untracked .mov in assets/videos/: ${name} (use originals/ or MP4)`);
      }
    }
  }

  if (warnings.length) {
    console.warn(`\n${warnings.length} warning(s):`);
    warnings.forEach((w) => console.warn(`  ⚠ ${w}`));
  }

  if (errors.length) {
    console.error(`\n${errors.length} error(s):`);
    errors.forEach((e) => console.error(`  ✗ ${e}`));
    process.exit(1);
  }

  console.log(`validate-manifest: OK (${concepts.length} concepts, ${Object.keys(formats).length} format locks)`);
}

main();
