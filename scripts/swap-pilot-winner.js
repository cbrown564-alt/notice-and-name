/**
 * Promote a pilot illustration to production (Phase 1.3 review board).
 *
 * Usage:
 *   node scripts/swap-pilot-winner.js <concept-id> <generator>
 *
 * Example:
 *   node scripts/swap-pilot-winner.js non-concordance chatgpt-images-2
 *
 * Pilot paths (preferred): assets/_staging/pilot/illustrations/{concept}/{generator}.png
 * Legacy fallback: assets/images/concepts/illustrations/pilot/{concept}-{generator}.png
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { ROOT } = require('./lib/vocab-parse');
const {
  PILOT_BATCH_CONCEPTS,
  resolvePilotIllustrationPath,
  pilotIllustrationBackupPath,
  legacyPilotBackupPath,
} = require('./lib/pilot-paths');

function usage() {
  console.error('Usage: node scripts/swap-pilot-winner.js <concept-id> <generator>');
  console.error('Example: node scripts/swap-pilot-winner.js angling chatgpt-images-2');
  process.exit(1);
}

function main() {
  const [conceptId, generator] = process.argv.slice(2);
  if (!conceptId || !generator) usage();

  if (!PILOT_BATCH_CONCEPTS.includes(conceptId)) {
    console.error(`Unknown pilot concept: ${conceptId}`);
    console.error(`Expected one of: ${PILOT_BATCH_CONCEPTS.join(', ')}`);
    process.exit(1);
  }

  const pilotRel = resolvePilotIllustrationPath(conceptId, generator);
  if (!pilotRel) {
    console.error(`Pilot not found for ${conceptId}/${generator}`);
    console.error('Run npm run pilot-compare to list available pilots.');
    process.exit(1);
  }

  const prodRel = `assets/images/concepts/illustrations/${conceptId}.png`;
  const backupRel = pilotIllustrationBackupPath(conceptId);
  const legacyBackupRel = legacyPilotBackupPath(conceptId);

  const pilotPath = path.join(ROOT, pilotRel);
  const prodPath = path.join(ROOT, prodRel);
  let backupPath = path.join(ROOT, backupRel);
  if (!fs.existsSync(path.dirname(backupPath))) {
    backupPath = path.join(ROOT, legacyBackupRel);
  }

  const backupDir = path.dirname(backupPath);
  if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });

  if (fs.existsSync(prodPath)) {
    fs.copyFileSync(prodPath, backupPath);
    console.log(`Backed up production → ${path.relative(ROOT, backupPath)}`);
  }

  fs.copyFileSync(pilotPath, prodPath);
  console.log(`Promoted ${pilotRel} → ${prodRel}`);

  console.log('Running compress-assets on illustrations…');
  execSync('node scripts/compress-assets.js', { cwd: ROOT, stdio: 'inherit' });

  const bytes = fs.statSync(prodPath).size;
  console.log(`Production size: ${(bytes / 1024).toFixed(0)} KB`);
  console.log('\nNext: npm run sync-registry && npm run validate-manifest');
}

main();
