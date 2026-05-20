/**
 * Validate format lock, filesystem assets, and vocabulary wiring.
 * Run: node scripts/validate-manifest.js
 * Strict: STRICT=1 npm run validate-manifest  (warnings → errors)
 */

const fs = require('fs');
const path = require('path');
const {
  ROOT,
  PATHS,
  SIZE_BUDGET,
  videoBudgetForConcept,
  fileBytes,
  fileExists,
  loadConcepts,
  loadVisualFormats,
} = require('./lib/vocab-parse');

const STRICT = process.env.STRICT === '1' || process.argv.includes('--strict');

const errors = [];
const warnings = [];

function warn(msg) {
  warnings.push(msg);
}

function fail(msg) {
  errors.push(msg);
}

function warnIfOverBudget(rel, budget, label) {
  const bytes = fileBytes(rel);
  if (bytes == null) return;
  if (bytes > budget) {
    warn(`${label}: ${rel} is ${(bytes / 1024).toFixed(0)} KB (budget ${(budget / 1024).toFixed(0)} KB)`);
  }
}

function main() {
  const { formats, videoProfiles } = loadVisualFormats();
  const concepts = loadConcepts();
  const formatIds = new Set(Object.keys(formats));
  const conceptIds = new Set(concepts.map((c) => c.id));

  for (const id of conceptIds) {
    if (!formatIds.has(id)) fail(`Missing format lock for concept: ${id}`);
  }
  for (const id of formatIds) {
    if (!conceptIds.has(id)) fail(`Format lock orphan (no concept): ${id}`);
  }

  for (const c of concepts) {
    const format = formats[c.id];
    const thumbPath = `assets/images/concepts/thumbnails/${c.id}.png`;
    const thumbExists = fileExists(thumbPath);

    if (!thumbExists) {
      warn(`${c.id}: missing thumbnail on disk`);
    } else {
      warnIfOverBudget(thumbPath, SIZE_BUDGET.thumbnail, c.id);
      if (!c.conceptLevelThumb) {
        warn(`${c.id}: thumbnail on disk but not wired in vocabulary.ts`);
      }
    }

    if (format?.startsWith('interactive') && !c.diagramType) {
      if (format.includes('planned')) {
        warn(`${c.id}: interactive planned but no diagramType yet`);
      } else {
        fail(`${c.id}: format interactive but diagramType missing`);
      }
    }

    if (format === 'video' && !c.videoFile) {
      warn(`${c.id}: format video but no illustrationVideo wired`);
    }

    if (c.videoFile) {
      const vp = `assets/videos/${c.videoFile}`;
      if (!fileExists(vp)) {
        fail(`${c.id}: wired video missing on disk: ${vp}`);
      } else {
        warnIfOverBudget(vp, videoBudgetForConcept(c.id, videoProfiles), c.id);
      }
      if (c.videoFile.endsWith('.mov')) {
        fail(`${c.id}: .mov in vocabulary — use MP4 only: ${vp}`);
      }
    }

    if (c.thumbOnIllustrate) {
      warn(`${c.id}: illustrate slide uses thumbnail path — prefer illustrations/`);
    }

    if (c.illustrationId) {
      const illPath = `assets/images/concepts/illustrations/${c.illustrationId}.png`;
      if (!fileExists(illPath)) {
        fail(`${c.id}: wired illustration missing: ${illPath}`);
      } else {
        warnIfOverBudget(illPath, SIZE_BUDGET.illustration, c.id);
      }
    }
  }

  const videoDir = path.join(ROOT, 'assets/videos');
  if (fileExists('assets/videos')) {
    for (const name of fs.readdirSync(videoDir)) {
      if (name.endsWith('.mov')) {
        fail(`Untracked .mov in assets/videos/: ${name} (use originals/ or MP4)`);
      }
    }
  }

  const allIssues = STRICT ? [...errors, ...warnings] : errors;
  const reportWarnings = STRICT ? [] : warnings;

  if (reportWarnings.length) {
    console.warn(`\n${reportWarnings.length} warning(s):`);
    reportWarnings.forEach((w) => console.warn(`  ⚠ ${w}`));
  }

  if (allIssues.length) {
    const label = STRICT ? 'issue(s)' : 'error(s)';
    console.error(`\n${allIssues.length} ${label}:`);
    allIssues.forEach((e) => console.error(`  ✗ ${e}`));
    process.exit(1);
  }

  console.log(
    `validate-manifest: OK (${concepts.length} concepts, ${Object.keys(formats).length} format locks)${STRICT ? ' [strict]' : ''}`
  );
}

main();
