/**
 * Style bible reference render tracker (Phase 1.1).
 *
 *   npm run reference-renders              # status dashboard
 *   npm run reference-renders -- register technique gemini --path assets/_staging/reference/technique/gemini.png
 *   npm run reference-renders -- score sensation gemini --style 5 --accuracy 5 --no-text pass
 *   npm run reference-renders -- approve psychological
 *   npm run reference-renders -- promote sensation gemini
 *   npm run reference-renders -- sync
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { ROOT, PATHS, fileExists, fileBytes } = require('./lib/vocab-parse');
const {
  resolvePilotIllustrationPath,
  pilotIllustrationPath,
} = require('./lib/pilot-paths');

const REF_PATH = path.join(ROOT, 'data/reference-renders.json');
const REF_STAGING = 'assets/_staging/reference';
const STYLE_BIBLE = path.join(ROOT, 'docs/design/STYLE_BIBLE.md');

/** Reference bar: style 5 required (stricter than general promotion ≥4) */
const REFERENCE_STYLE_MIN = 5;
const REFERENCE_ACCURACY_MIN = 4;

const FAMILY_ORDER = ['technique', 'sensation', 'timing', 'psychological', 'anatomy'];

function loadRef() {
  return JSON.parse(fs.readFileSync(REF_PATH, 'utf8'));
}

function saveRef(data) {
  data._meta.updated = new Date().toISOString().slice(0, 10);
  const approved = FAMILY_ORDER.filter((f) => data.families[f]?.status === 'approved').length;
  data._meta.approvedCount = approved;
  data._meta.ratified = approved === FAMILY_ORDER.length;
  fs.writeFileSync(REF_PATH, JSON.stringify(data, null, 2) + '\n');
}

function referenceCandidatePath(family, generator) {
  return `${REF_STAGING}/${family}/${generator}.png`;
}

function parseFlag(args, name) {
  const i = args.indexOf(name);
  if (i === -1 || i + 1 >= args.length) return null;
  return args[i + 1];
}

function parsePassFail(val) {
  if (val == null) return null;
  const v = val.toLowerCase();
  if (['pass', 'true', 'yes'].includes(v)) return true;
  if (['fail', 'false', 'no'].includes(v)) return false;
  return null;
}

function passesReferenceBar(scores) {
  return (
    scores.styleCoherence >= REFERENCE_STYLE_MIN &&
    scores.scientificAccuracy >= REFERENCE_ACCURACY_MIN &&
    scores.noEmbeddedText === true
  );
}

function cmdList() {
  const data = loadRef();
  const approved = FAMILY_ORDER.filter((f) => data.families[f]?.status === 'approved').length;

  console.log('Style Bible Reference Renders (Phase 1.1)\n');
  console.log(`Progress: ${approved}/5 approved${approved === 5 ? ' — RATIFIED ✅' : ''}`);
  console.log(`Rubric: docs/pipelines/ASSET_EVALUATION.md (reference bar: style ≥${REFERENCE_STYLE_MIN})\n`);
  console.log('Family       Concept              Status      Style  Candidate');
  console.log('─'.repeat(75));

  for (const family of FAMILY_ORDER) {
    const f = data.families[family];
    const style = f.scores?.styleCoherence ?? '—';
    const cand = f.candidatePath ? path.basename(f.candidatePath) : '—';
    const exists = f.candidatePath && fileExists(f.candidatePath) ? '' : f.status === 'approved' ? '' : ' ⚠️';
    console.log(
      `${family.padEnd(12)} ${f.conceptId.padEnd(20)} ${f.status.padEnd(11)} ${String(style).padEnd(6)} ${cand}${exists}`
    );
    if (f.notes) console.log(`             ${f.notes}`);
  }

  console.log('\nWorkflow: docs/pipelines/REFERENCE_RENDERS.md');
  if (!data._meta.ratified) {
    const pending = FAMILY_ORDER.filter((f) => data.families[f].status !== 'approved');
    console.log(`\nNext actions: ${pending.map((f) => data.families[f].conceptId).join(', ')}`);
  }
}

function cmdRegister(args) {
  const [family, generator] = args;
  const srcPath = parseFlag(args, '--path');
  if (!family || !generator) {
    console.error('Usage: reference-renders register <family> <generator> [--path <rel-path>]');
    process.exit(1);
  }

  const data = loadRef();
  const entry = data.families[family];
  if (!entry) {
    console.error(`Unknown family: ${family}. Expected: ${FAMILY_ORDER.join(', ')}`);
    process.exit(1);
  }

  let candidateRel = srcPath;
  if (!candidateRel) {
    candidateRel = referenceCandidatePath(family, generator);
    const pilotRel = resolvePilotIllustrationPath(entry.conceptId, generator);
    if (pilotRel && fileExists(pilotRel)) {
      const dest = path.join(ROOT, candidateRel);
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      if (!fileExists(candidateRel)) {
        fs.copyFileSync(path.join(ROOT, pilotRel), dest);
        console.log(`Copied ${pilotRel} → ${candidateRel}`);
      }
      candidateRel = candidateRel;
    }
  }

  if (!candidateRel || !fileExists(candidateRel)) {
    console.error(`Candidate not found. Save PNG to ${REF_STAGING}/${family}/${generator}.png`);
    process.exit(1);
  }

  entry.candidatePath = candidateRel;
  entry.generatorHint = generator;
  entry.status = 'review';
  saveRef(data);
  console.log(`Registered ${family} candidate: ${candidateRel}`);
  console.log(`Score: npm run reference-renders -- score ${family} ${generator} --style 5 --accuracy 5 --no-text pass`);
}

function cmdScore(args) {
  const [family, generator] = args;
  if (!family) {
    console.error('Usage: reference-renders score <family> [generator] --style N --accuracy N --no-text pass|fail');
    process.exit(1);
  }

  const data = loadRef();
  const entry = data.families[family];
  if (!entry) {
    console.error(`Unknown family: ${family}`);
    process.exit(1);
  }

  const style = parseFloat(parseFlag(args, '--style'));
  const accuracy = parseFloat(parseFlag(args, '--accuracy'));
  const noText = parsePassFail(parseFlag(args, '--no-text'));
  const notes = parseFlag(args, '--notes') || entry.notes;

  entry.scores = { ...(entry.scores || {}) };
  if (!Number.isNaN(style)) entry.scores.styleCoherence = style;
  if (!Number.isNaN(accuracy)) entry.scores.scientificAccuracy = accuracy;
  if (noText != null) entry.scores.noEmbeddedText = noText;
  if (notes) entry.notes = notes;

  if (passesReferenceBar(entry.scores)) {
    entry.status = 'review';
    console.log(`✅ Passes reference bar (style ≥${REFERENCE_STYLE_MIN}, accuracy ≥${REFERENCE_ACCURACY_MIN}, no-text pass)`);
    console.log(`Approve: npm run reference-renders -- approve ${family}`);
  } else {
    entry.status = entry.status === 'approved' ? 'approved' : 'review';
    console.log(`⚠️ Below reference bar — style ${entry.scores.styleCoherence ?? '?'} (need ≥${REFERENCE_STYLE_MIN})`);
  }

  saveRef(data);

  // Mirror scores to asset-registry via pilot-compare
  const gen = generator || entry.generatorHint;
  if (gen && entry.conceptId) {
    try {
      execSync(
        `node scripts/pilot-compare.js score ${entry.conceptId} illustration ${gen} --style ${entry.scores.styleCoherence ?? ''} --accuracy ${entry.scores.scientificAccuracy ?? ''} --no-text ${entry.scores.noEmbeddedText ? 'pass' : 'fail'} --notes "${(notes || '').replace(/"/g, '\\"')}"`,
        { cwd: ROOT, stdio: 'pipe' }
      );
    } catch {
      /* pilot may not exist yet */
    }
  }
}

function cmdApprove(args) {
  const [family] = args;
  const data = loadRef();
  const entry = data.families[family];
  if (!entry) {
    console.error(`Unknown family: ${family}`);
    process.exit(1);
  }

  if (!passesReferenceBar(entry.scores || {})) {
    console.error(`Cannot approve ${family}: scores do not meet reference bar.`);
    console.error(`Required: style ≥${REFERENCE_STYLE_MIN}, accuracy ≥${REFERENCE_ACCURACY_MIN}, no-text pass`);
    console.error(`Current: ${JSON.stringify(entry.scores)}`);
    process.exit(1);
  }

  const prodPath = `assets/images/concepts/illustrations/${entry.conceptId}.png`;
  entry.status = 'approved';
  entry.referencePath = fileExists(prodPath) ? prodPath : entry.candidatePath;
  entry.approvedAt = new Date().toISOString().slice(0, 10);
  saveRef(data);

  console.log(`Approved ${family} reference → ${entry.referencePath}`);

  const approvedCount = FAMILY_ORDER.filter((f) => data.families[f]?.status === 'approved').length;
  if (approvedCount === 5) {
    console.log('\n🎉 All 5 families approved — update STYLE_BIBLE.md status to v1.0 ratified.');
  }
}

function cmdPromote(args) {
  const [family, generator] = args;
  const data = loadRef();
  const entry = data.families[family];
  if (!entry) {
    console.error(`Unknown family: ${family}`);
    process.exit(1);
  }

  const gen = generator || entry.generatorHint;
  const pilotRel = resolvePilotIllustrationPath(entry.conceptId, gen);
  const refRel = referenceCandidatePath(family, gen);

  if (!pilotRel && !fileExists(refRel) && !fileExists(entry.candidatePath)) {
    console.error(`No candidate to promote for ${entry.conceptId}`);
    process.exit(1);
  }

  execSync(`node scripts/swap-pilot-winner.js ${entry.conceptId} ${gen}`, {
    cwd: ROOT,
    stdio: 'inherit',
  });

  entry.referencePath = `assets/images/concepts/illustrations/${entry.conceptId}.png`;
  entry.status = 'approved';
  entry.approvedAt = new Date().toISOString().slice(0, 10);
  saveRef(data);

  execSync('node scripts/sync-registry.js', { cwd: ROOT, stdio: 'inherit' });
  console.log(`\nPromoted and marked ${family} reference approved.`);
}

function cmdSync() {
  const data = loadRef();
  let registry = null;
  if (fs.existsSync(PATHS.registry)) {
    registry = JSON.parse(fs.readFileSync(PATHS.registry, 'utf8'));
  }

  for (const family of FAMILY_ORDER) {
    const entry = data.families[family];
    const concept = registry?.concepts?.[entry.conceptId];
    if (!concept) continue;

    const pilot = (concept.pilots || []).find((p) => p.decision === 'approved' || p.decision === 'rejected');
    if (pilot?.scores && Object.keys(pilot.scores).length) {
      entry.scores = { ...entry.scores, ...pilot.scores };
    }
    if (pilot?.decision === 'approved' && entry.status !== 'approved') {
      entry.status = 'review';
    }
    if (pilot?.decision === 'rejected') {
      entry.status = 'rejected';
    }
    if (concept.evaluation?.promotionDecision === 'approved' && fileExists(`assets/images/concepts/illustrations/${entry.conceptId}.png`)) {
      if (entry.status !== 'approved') {
        entry.referencePath = `assets/images/concepts/illustrations/${entry.conceptId}.png`;
      }
    }

    const pilotPath = resolvePilotIllustrationPath(entry.conceptId, entry.generatorHint);
    if (pilotPath) entry.candidatePath = pilotPath;
  }

  saveRef(data);
  console.log('Synced reference-renders.json from asset-registry and pilot paths.');
  cmdList();
}

function cmdReject(args) {
  const [family] = args;
  const notes = parseFlag(args, '--notes') || '';
  const data = loadRef();
  const entry = data.families[family];
  if (!entry) {
    console.error(`Unknown family: ${family}`);
    process.exit(1);
  }
  entry.status = 'rejected';
  if (notes) entry.notes = notes;
  saveRef(data);
  console.log(`Rejected ${family} reference candidate.`);
}

function main() {
  const [cmd, ...rest] = process.argv.slice(2);
  switch (cmd) {
    case 'register':
      cmdRegister(rest);
      break;
    case 'score':
      cmdScore(rest);
      break;
    case 'approve':
      cmdApprove(rest);
      break;
    case 'promote':
      cmdPromote(rest);
      break;
    case 'sync':
      cmdSync();
      break;
    case 'reject':
      cmdReject(rest);
      break;
    case undefined:
    case 'list':
    case 'status':
      cmdList();
      break;
    default:
      console.error(`Unknown command: ${cmd}`);
      console.error('Commands: list, register, score, approve, promote, reject, sync');
      process.exit(1);
  }
}

main();
