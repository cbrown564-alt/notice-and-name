/**
 * List image pilot outputs and size checklist for Phase 1.3 review.
 * Run: node scripts/pilot-review.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PILOT_DIR = path.join(ROOT, 'assets/images/concepts/illustrations/pilot');
const PILOT_CONCEPTS = [
  'angling',
  'spreading',
  'warmup-window',
  'non-concordance',
  'clitoral-structure',
];
const GENERATORS = ['chatgpt-images-2', 'nano-banana-pro-2', 'gemini'];

const ILL_BUDGET = 400 * 1024;

/** Manual QA notes (Phase 1.3) — update when pilots are reviewed */
const QA_NOTES = {
  angling: 'REJECTED: in-image titles/labels — regen with no-text prompt',
  'non-concordance': 'APPROVED: promoted to production May 19',
  spreading: 'awaiting Gemini pilot',
  'warmup-window': 'awaiting Gemini pilot',
  'clitoral-structure': 'awaiting Gemini pilot (optional comparison)',
};

function bytes(rel) {
  const p = path.join(ROOT, rel);
  if (!fs.existsSync(p)) return null;
  return fs.statSync(p).size;
}

function findPilotFiles() {
  const found = [];
  const legacyDir = path.join(ROOT, 'assets/images/concepts/illustrations');

  if (fs.existsSync(PILOT_DIR)) {
    for (const name of fs.readdirSync(PILOT_DIR)) {
      if (!name.endsWith('.png')) continue;
      found.push(`assets/images/concepts/illustrations/pilot/${name}`);
    }
  }

  for (const name of fs.readdirSync(legacyDir)) {
    if (name.includes('-pilot-') && name.endsWith('.png')) {
      found.push(`assets/images/concepts/illustrations/${name}`);
    }
  }

  return found.sort();
}

function slotForFilename(name) {
  for (const id of PILOT_CONCEPTS) {
    if (name.startsWith(id)) return id;
  }
  return null;
}

function main() {
  console.log('Image pilot review (Phase 1.3)\n');
  console.log('Expected naming: assets/images/concepts/illustrations/pilot/{concept}-{generator}.png\n');

  const files = findPilotFiles();
  const byConcept = Object.fromEntries(PILOT_CONCEPTS.map((id) => [id, []]));

  for (const rel of files) {
    const name = path.basename(rel);
    const id = slotForFilename(name);
    if (id) byConcept[id].push(rel);
    else console.log(`  ? unmapped: ${rel}`);
  }

  for (const id of PILOT_CONCEPTS) {
    const prod = `assets/images/concepts/illustrations/${id}.png`;
    const prodBytes = bytes(prod);
    const prodKb = prodBytes != null ? `${(prodBytes / 1024).toFixed(0)} KB` : 'missing';
    const over = prodBytes != null && prodBytes > ILL_BUDGET ? ' (over 400 KB budget)' : '';
    console.log(`## ${id}`);
    if (QA_NOTES[id]) console.log(`  qa: ${QA_NOTES[id]}`);
    console.log(`  production: ${prod} — ${prodKb}${over}`);
    const pilots = byConcept[id];
    if (!pilots.length) {
      console.log('  pilots: (none yet)');
    } else {
      for (const rel of pilots) {
        const b = bytes(rel);
        console.log(`  pilot: ${rel} — ${b != null ? `${(b / 1024).toFixed(0)} KB` : '?'}`);
      }
    }
    console.log('');
  }

  const missing = PILOT_CONCEPTS.filter((id) => !byConcept[id].length);
  if (missing.length) {
    console.log(`Concepts awaiting any pilot output: ${missing.join(', ')}`);
  }

  console.log('\nNext: compare in app, record winners in docs/pipelines/prompts/PILOT_BATCH.md');
}

main();
