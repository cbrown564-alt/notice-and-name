/**
 * Pilot asset path conventions (staging vs legacy).
 */

const path = require('path');
const fs = require('fs');
const { ROOT, fileExists } = require('./vocab-parse');

/** Phase 1.3 image pilot concepts */
const PILOT_BATCH_CONCEPTS = [
  'angling',
  'spreading',
  'warmup-window',
  'non-concordance',
  'clitoral-structure',
];

const STAGING_ROOT = 'assets/_staging/pilot';
const LEGACY_PILOT_DIR = 'assets/images/concepts/illustrations/pilot';

function pilotIllustrationPath(conceptId, generator) {
  return `${STAGING_ROOT}/illustrations/${conceptId}/${generator}.png`;
}

function pilotIllustrationBackupPath(conceptId) {
  return `${STAGING_ROOT}/illustrations/${conceptId}/production-backup.png`;
}

function legacyPilotIllustrationPath(conceptId, generator) {
  return `${LEGACY_PILOT_DIR}/${conceptId}-${generator}.png`;
}

function legacyPilotBackupPath(conceptId) {
  return `${LEGACY_PILOT_DIR}/${conceptId}-production-backup.png`;
}

function resolvePilotIllustrationPath(conceptId, generator) {
  const staging = pilotIllustrationPath(conceptId, generator);
  if (fileExists(staging)) return staging;
  const legacy = legacyPilotIllustrationPath(conceptId, generator);
  if (fileExists(legacy)) return legacy;
  return null;
}

function listPilotIllustrations(conceptId) {
  const found = [];
  const stagingDir = path.join(ROOT, STAGING_ROOT, 'illustrations', conceptId);
  if (fs.existsSync(stagingDir)) {
    for (const name of fs.readdirSync(stagingDir)) {
      if (!name.endsWith('.png') || name === 'production-backup.png') continue;
      found.push({
        generator: name.replace(/\.png$/, ''),
        path: `${STAGING_ROOT}/illustrations/${conceptId}/${name}`,
        location: 'staging',
      });
    }
  }
  const legacyDir = path.join(ROOT, LEGACY_PILOT_DIR);
  if (fs.existsSync(legacyDir)) {
    const prefix = `${conceptId}-`;
    for (const name of fs.readdirSync(legacyDir)) {
      if (!name.startsWith(prefix) || !name.endsWith('.png')) continue;
      if (name.endsWith('-production-backup.png')) continue;
      const generator = name.slice(prefix.length, -4);
      const rel = `${LEGACY_PILOT_DIR}/${name}`;
      if (!found.some((f) => f.generator === generator)) {
        found.push({ generator, path: rel, location: 'legacy' });
      }
    }
  }
  return found.sort((a, b) => a.generator.localeCompare(b.generator));
}

function listAllPilotConcepts() {
  return [...PILOT_BATCH_CONCEPTS];
}

module.exports = {
  PILOT_BATCH_CONCEPTS,
  STAGING_ROOT,
  LEGACY_PILOT_DIR,
  pilotIllustrationPath,
  pilotIllustrationBackupPath,
  legacyPilotIllustrationPath,
  legacyPilotBackupPath,
  resolvePilotIllustrationPath,
  listPilotIllustrations,
  listAllPilotConcepts,
};
