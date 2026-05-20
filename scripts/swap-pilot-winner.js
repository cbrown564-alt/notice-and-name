/**
 * Promote a pilot illustration to production (Phase 1.3 review board).
 *
 * Usage:
 *   node scripts/swap-pilot-winner.js <concept-id> <generator>
 *
 * Example:
 *   node scripts/swap-pilot-winner.js non-concordance chatgpt-images-2
 *
 * Backs up current production to pilot/{concept}-production-backup.png
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const PILOT_CONCEPTS = [
  'angling',
  'spreading',
  'warmup-window',
  'non-concordance',
  'clitoral-structure',
];

function usage() {
  console.error('Usage: node scripts/swap-pilot-winner.js <concept-id> <generator>');
  console.error('Example: node scripts/swap-pilot-winner.js angling chatgpt-images-2');
  process.exit(1);
}

function main() {
  const [conceptId, generator] = process.argv.slice(2);
  if (!conceptId || !generator) usage();

  if (!PILOT_CONCEPTS.includes(conceptId)) {
    console.error(`Unknown pilot concept: ${conceptId}`);
    console.error(`Expected one of: ${PILOT_CONCEPTS.join(', ')}`);
    process.exit(1);
  }

  const pilotRel = `assets/images/concepts/illustrations/pilot/${conceptId}-${generator}.png`;
  const prodRel = `assets/images/concepts/illustrations/${conceptId}.png`;
  const backupRel = `assets/images/concepts/illustrations/pilot/${conceptId}-production-backup.png`;

  const pilotPath = path.join(ROOT, pilotRel);
  const prodPath = path.join(ROOT, prodRel);
  const backupPath = path.join(ROOT, backupRel);

  if (!fs.existsSync(pilotPath)) {
    console.error(`Pilot not found: ${pilotRel}`);
    process.exit(1);
  }

  const pilotDir = path.dirname(backupPath);
  if (!fs.existsSync(pilotDir)) fs.mkdirSync(pilotDir, { recursive: true });

  if (fs.existsSync(prodPath)) {
    fs.copyFileSync(prodPath, backupPath);
    console.log(`Backed up production → ${backupRel}`);
  }

  fs.copyFileSync(pilotPath, prodPath);
  console.log(`Promoted ${pilotRel} → ${prodRel}`);

  console.log('Running compress-assets on illustrations…');
  execSync('node scripts/compress-assets.js', { cwd: ROOT, stdio: 'inherit' });

  const bytes = fs.statSync(prodPath).size;
  console.log(`Production size: ${(bytes / 1024).toFixed(0)} KB`);
  console.log('\nNext: review in app, update PILOT_BATCH.md winners table, run npm run validate-manifest');
}

main();
