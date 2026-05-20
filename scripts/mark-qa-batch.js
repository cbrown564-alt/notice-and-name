/**
 * Mark device-QA batches in data/qa-passed.json (see docs/QA_CHECKLIST.md).
 *
 *   node scripts/mark-qa-batch.js list
 *   node scripts/mark-qa-batch.js status
 *   node scripts/mark-qa-batch.js techniques
 *   node scripts/mark-qa-batch.js sensations --clear
 *   node scripts/mark-qa-batch.js all
 *
 * After marking, run: npm run generate-concept-audit
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const QA_PATH = path.join(ROOT, 'data/qa-passed.json');

const BATCHES = {
  techniques: ['angling', 'rocking', 'shallowing', 'pairing'],
  sensations: ['building', 'plateauing', 'edging', 'spreading', 'pulsing'],
  timing: ['warmup-window', 'responsive-desire', 'spontaneous-desire', 'golden-trio'],
  psychological: [
    'spectatoring',
    'embodied-presence',
    'non-concordance',
    'sexual-self-esteem',
    'body-appreciation',
  ],
  anatomy: [
    'clitoral-structure',
    'nerve-density',
    'clitourethrovaginal',
    'internal-stimulation',
  ],
};

const ALL_IDS = [...new Set(Object.values(BATCHES).flat())];

function loadQa() {
  if (!fs.existsSync(QA_PATH)) {
    return { comment: '', passed: {} };
  }
  return JSON.parse(fs.readFileSync(QA_PATH, 'utf8'));
}

function saveQa(data) {
  fs.writeFileSync(QA_PATH, `${JSON.stringify(data, null, 2)}\n`);
}

function printStatus(passed) {
  console.log('\nQA batch progress:\n');
  for (const [batch, ids] of Object.entries(BATCHES)) {
    const done = ids.filter((id) => passed[id]).length;
    console.log(`  ${batch.padEnd(14)} ${done}/${ids.length}`);
  }
  const total = ALL_IDS.filter((id) => passed[id]).length;
  console.log(`\n  Total: ${total}/${ALL_IDS.length}\n`);
}

function main() {
  const args = process.argv.slice(2);
  const batchArg = args.find((a) => !a.startsWith('--'));
  const clear = args.includes('--clear');

  if (!batchArg || batchArg === 'help' || args.includes('--help')) {
    console.log(`Usage: node scripts/mark-qa-batch.js <batch|list|status|all> [--clear]

Batches: ${Object.keys(BATCHES).join(', ')}, all`);
    process.exit(0);
  }

  const data = loadQa();
  if (!data.passed || typeof data.passed !== 'object') {
    data.passed = {};
  }

  if (batchArg === 'list') {
    for (const [name, ids] of Object.entries(BATCHES)) {
      console.log(`${name}: ${ids.join(', ')}`);
    }
    process.exit(0);
  }

  if (batchArg === 'status') {
    printStatus(data.passed);
    process.exit(0);
  }

  let ids;
  if (batchArg === 'all') {
    ids = ALL_IDS;
  } else if (BATCHES[batchArg]) {
    ids = BATCHES[batchArg];
  } else {
    console.error(`Unknown batch "${batchArg}". Run with "list" for options.`);
    process.exit(1);
  }

  const value = !clear;
  for (const id of ids) {
    if (value) {
      data.passed[id] = true;
    } else {
      delete data.passed[id];
    }
  }

  saveQa(data);
  const verb = value ? 'Marked' : 'Cleared';
  console.log(`${verb} ${ids.length} concept(s) in batch "${batchArg}".`);
  printStatus(data.passed);
  console.log('Run: npm run generate-concept-audit');
}

main();
