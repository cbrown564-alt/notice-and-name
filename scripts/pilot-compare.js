/**
 * Pilot A/B comparison, scoring, and promotion decisions.
 *
 *   npm run pilot-compare                          # list all pilots
 *   npm run pilot-compare -- score <concept> illustration <generator> --style 4 --accuracy 5 --no-text pass
 *   npm run pilot-compare -- decide <concept> illustration <generator> approved|rejected|pending [--notes "..."]
 *   npm run pilot-compare -- migrate               # move legacy pilot/ → _staging/
 */

const fs = require('fs');
const {
  PATHS,
  fileBytes,
  loadConcepts,
} = require('./lib/vocab-parse');
const {
  PILOT_BATCH_CONCEPTS,
  listPilotIllustrations,
  listAllPilotConcepts,
  pilotIllustrationPath,
  pilotIllustrationBackupPath,
  legacyPilotIllustrationPath,
  legacyPilotBackupPath,
  LEGACY_PILOT_DIR,
  STAGING_ROOT,
} = require('./lib/pilot-paths');

const ILL_BUDGET = 400 * 1024;

function loadRegistry() {
  if (!fs.existsSync(PATHS.registry)) {
    return { _meta: {}, concepts: {} };
  }
  return JSON.parse(fs.readFileSync(PATHS.registry, 'utf8'));
}

function saveRegistry(registry) {
  registry._meta = registry._meta || {};
  registry._meta.updated = new Date().toISOString().slice(0, 10);
  fs.writeFileSync(PATHS.registry, JSON.stringify(registry, null, 2) + '\n');
}

function ensureConcept(registry, conceptId) {
  if (!registry.concepts[conceptId]) {
    registry.concepts[conceptId] = { evaluation: { notes: '' }, pilots: [] };
  }
  if (!registry.concepts[conceptId].pilots) registry.concepts[conceptId].pilots = [];
  if (!registry.concepts[conceptId].evaluation) registry.concepts[conceptId].evaluation = { notes: '' };
  return registry.concepts[conceptId];
}

function findPilotEntry(concept, assetType, generator) {
  return concept.pilots.find((p) => p.assetType === assetType && p.generator === generator);
}

function upsertPilot(concept, entry) {
  const idx = concept.pilots.findIndex(
    (p) => p.assetType === entry.assetType && p.generator === entry.generator
  );
  if (idx >= 0) concept.pilots[idx] = { ...concept.pilots[idx], ...entry };
  else concept.pilots.push(entry);
}

function parseFlag(args, name) {
  const i = args.indexOf(name);
  if (i === -1 || i + 1 >= args.length) return null;
  return args[i + 1];
}

function parsePassFail(val) {
  if (val == null) return null;
  const v = val.toLowerCase();
  if (v === 'pass' || v === 'true' || v === 'yes') return true;
  if (v === 'fail' || v === 'false' || v === 'no') return false;
  return null;
}

function scoreLabel(scores) {
  if (!scores || !scores.styleCoherence) return '(unscored)';
  const parts = [`style:${scores.styleCoherence}`, `acc:${scores.scientificAccuracy}`];
  if (scores.noEmbeddedText != null) parts.push(scores.noEmbeddedText ? 'no-text:pass' : 'no-text:FAIL');
  return parts.join(' ');
}

function passesThreshold(scores) {
  if (!scores) return false;
  return (
    scores.styleCoherence >= 4 &&
    scores.scientificAccuracy >= 4 &&
    scores.noEmbeddedText === true
  );
}

function cmdList() {
  console.log('Pilot comparison (Phase 1.3 + staging)\n');
  console.log(`Rubric: docs/pipelines/ASSET_EVALUATION.md\n`);

  const concepts = loadConcepts();
  const registry = loadRegistry();
  const ids = listAllPilotConcepts();

  for (const id of ids) {
    const prod = `assets/images/concepts/illustrations/${id}.png`;
    const prodBytes = fileBytes(prod);
    const prodKb = prodBytes != null ? `${(prodBytes / 1024).toFixed(0)} KB` : 'missing';
    const over = prodBytes != null && prodBytes > ILL_BUDGET ? ' ⚠️ over 400 KB' : '';
    const entry = registry.concepts[id];
    const evalNotes = entry?.evaluation?.notes;
    const promotion = entry?.evaluation?.promotionDecision;

    console.log(`## ${id}`);
    if (promotion && promotion !== 'pending') console.log(`  production decision: ${promotion}`);
    if (evalNotes) console.log(`  notes: ${evalNotes}`);
    console.log(`  production: ${prod} — ${prodKb}${over}`);

    const pilots = listPilotIllustrations(id);
    if (!pilots.length) {
      console.log('  pilots: (none)\n');
      continue;
    }
    for (const p of pilots) {
      const b = fileBytes(p.path);
      const pilotEntry = findPilotEntry(entry || { pilots: [] }, 'illustration', p.generator);
      const decision = pilotEntry?.decision || 'pending';
      const scores = pilotEntry?.scores || {};
      const pass = passesThreshold(scores) ? ' ✅ passes rubric' : '';
      console.log(
        `  [${decision}] ${p.generator} (${p.location}) — ${b != null ? `${(b / 1024).toFixed(0)} KB` : '?'} — ${scoreLabel(scores)}${pass}`
      );
      if (pilotEntry?.notes) console.log(`           ${pilotEntry.notes}`);
    }
    console.log('');
  }

  const awaiting = PILOT_BATCH_CONCEPTS.filter((id) => !listPilotIllustrations(id).length);
  if (awaiting.length) {
    console.log(`Awaiting pilot output: ${awaiting.join(', ')}`);
  }
  console.log('\nScore: npm run pilot-compare -- score <concept> illustration <generator> --style 4 --accuracy 5 --no-text pass');
  console.log('Decide: npm run pilot-compare -- decide <concept> illustration <generator> approved|rejected');
}

function cmdScore(args) {
  const [conceptId, assetType, generator] = args;
  if (!conceptId || assetType !== 'illustration' || !generator) {
    console.error('Usage: pilot-compare score <concept> illustration <generator> --style N --accuracy N [--no-text pass|fail]');
    process.exit(1);
  }

  const style = parseFloat(parseFlag(args, '--style'));
  const accuracy = parseFloat(parseFlag(args, '--accuracy'));
  const noText = parsePassFail(parseFlag(args, '--no-text'));
  const notes = parseFlag(args, '--notes') || '';

  const pilots = listPilotIllustrations(conceptId);
  const pilot = pilots.find((p) => p.generator === generator);
  if (!pilot) {
    console.error(`Pilot not found: ${conceptId} / ${generator}`);
    process.exit(1);
  }

  const registry = loadRegistry();
  const concept = ensureConcept(registry, conceptId);
  const scores = {
    ...(findPilotEntry(concept, assetType, generator)?.scores || {}),
  };
  if (!Number.isNaN(style)) scores.styleCoherence = style;
  if (!Number.isNaN(accuracy)) scores.scientificAccuracy = accuracy;
  if (noText != null) scores.noEmbeddedText = noText;

  upsertPilot(concept, {
    assetType,
    generator,
    path: pilot.path,
    scores,
    decision: findPilotEntry(concept, assetType, generator)?.decision || 'pending',
    notes: notes || findPilotEntry(concept, assetType, generator)?.notes || '',
    reviewedAt: new Date().toISOString().slice(0, 10),
  });

  saveRegistry(registry);
  console.log(`Scored ${conceptId}/${generator}: ${scoreLabel(scores)}`);
  if (passesThreshold(scores)) console.log('  → passes promotion threshold (≥4 style + accuracy, no-text pass)');
}

function cmdDecide(args) {
  const [conceptId, assetType, generator, decision] = args;
  if (!conceptId || !generator || !['approved', 'rejected', 'pending'].includes(decision)) {
    console.error('Usage: pilot-compare decide <concept> illustration <generator> approved|rejected|pending [--notes "..."]');
    process.exit(1);
  }

  const notes = parseFlag(args, '--notes') || '';
  const registry = loadRegistry();
  const concept = ensureConcept(registry, conceptId);
  const pilots = listPilotIllustrations(conceptId);
  const pilot = pilots.find((p) => p.generator === generator);
  if (!pilot) {
    console.error(`Pilot not found: ${conceptId} / ${generator}`);
    process.exit(1);
  }

  upsertPilot(concept, {
    assetType: assetType || 'illustration',
    generator,
    path: pilot.path,
    scores: findPilotEntry(concept, assetType || 'illustration', generator)?.scores || {},
    decision,
    notes,
    reviewedAt: new Date().toISOString().slice(0, 10),
  });

  if (decision === 'approved') {
    concept.evaluation.promotionDecision = 'approved';
    concept.evaluation.notes = notes || concept.evaluation.notes;
  } else if (decision === 'rejected') {
    concept.evaluation.promotionDecision = 'rejected';
    concept.evaluation.notes = notes || concept.evaluation.notes;
  }

  saveRegistry(registry);
  console.log(`Decision recorded: ${conceptId}/${generator} → ${decision}`);
  if (decision === 'approved') {
    console.log(`  Promote: npm run swap-pilot-winner -- ${conceptId} ${generator}`);
  }
}

function parseLegacyPilotFilename(name) {
  if (!name.endsWith('.png')) return null;
  if (name.endsWith('-production-backup.png')) {
    return {
      conceptId: name.slice(0, -'-production-backup.png'.length),
      destName: 'production-backup.png',
    };
  }
  const sorted = [...PILOT_BATCH_CONCEPTS].sort((a, b) => b.length - a.length);
  for (const id of sorted) {
    const prefix = `${id}-`;
    if (name.startsWith(prefix)) {
      return { conceptId: id, destName: `${name.slice(prefix.length)}` };
    }
  }
  return null;
}

function cmdMigrate() {
  const path = require('path');
  const { ROOT } = require('./lib/vocab-parse');
  const legacyDir = path.join(ROOT, LEGACY_PILOT_DIR);
  if (!fs.existsSync(legacyDir)) {
    console.log('No legacy pilot directory — nothing to migrate.');
    return;
  }

  let moved = 0;
  for (const name of fs.readdirSync(legacyDir)) {
    if (!name.endsWith('.png')) continue;
    const parsed = parseLegacyPilotFilename(name);
    if (!parsed) {
      console.warn(`  skip unmapped: ${name}`);
      continue;
    }
    const destDir = path.join(ROOT, STAGING_ROOT, 'illustrations', parsed.conceptId);
    const destPath = path.join(destDir, parsed.destName);
    const srcPath = path.join(legacyDir, name);

    if (fs.existsSync(destPath)) continue;
    fs.mkdirSync(destDir, { recursive: true });
    fs.renameSync(srcPath, destPath);
    console.log(`  ${LEGACY_PILOT_DIR}/${name} → ${STAGING_ROOT}/illustrations/${parsed.conceptId}/${parsed.destName}`);
    moved++;
  }
  console.log(`\nMigrated ${moved} file(s) to ${STAGING_ROOT}/`);
}

function cmdSeed() {
  const registry = loadRegistry();
  const seeds = [
    {
      id: 'angling',
      generator: 'chatgpt-images-2',
      decision: 'rejected',
      notes: 'In-image titles/labels — regen with no-text prompt',
      scores: { styleCoherence: 2, scientificAccuracy: 3, noEmbeddedText: false },
    },
    {
      id: 'non-concordance',
      generator: 'chatgpt-images-2',
      decision: 'approved',
      notes: 'Promoted to production May 19',
      scores: { styleCoherence: 4, scientificAccuracy: 5, noEmbeddedText: true },
    },
  ];

  for (const s of seeds) {
    const concept = ensureConcept(registry, s.id);
    const pilots = listPilotIllustrations(s.id);
    const pilot = pilots.find((p) => p.generator === s.generator);
    upsertPilot(concept, {
      assetType: 'illustration',
      generator: s.generator,
      path: pilot?.path || legacyPilotIllustrationPath(s.id, s.generator),
      scores: s.scores,
      decision: s.decision,
      notes: s.notes,
      reviewedAt: '2026-05-19',
    });
    concept.evaluation.promotionDecision = s.decision;
    concept.evaluation.notes = s.notes;
  }

  saveRegistry(registry);
  console.log('Seeded pilot evaluations for angling (rejected) and non-concordance (approved).');
}

function main() {
  const [cmd, ...rest] = process.argv.slice(2);
  switch (cmd) {
    case 'score':
      cmdScore(rest);
      break;
    case 'decide':
      cmdDecide(rest);
      break;
    case 'migrate':
      cmdMigrate();
      break;
    case 'seed':
      cmdSeed();
      break;
    case undefined:
    case 'list':
      cmdList();
      break;
    default:
      console.error(`Unknown command: ${cmd}`);
      console.error('Commands: list, score, decide, migrate, seed');
      process.exit(1);
  }
}

main();
