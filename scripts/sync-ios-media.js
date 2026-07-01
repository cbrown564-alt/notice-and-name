#!/usr/bin/env node

/**
 * Copy canonical concept media from assets/ into the iOS SPM resource bundle.
 *
 * Source of truth:
 *   assets/images/concepts/illustrations/*.png
 *   assets/images/concepts/thumbnails/*.png
 *   assets/videos/*.mp4  (top-level only — not originals/)
 *
 * Destination (generated — do not edit by hand):
 *   ios-native/Sources/PleasureVocabularyApp/Resources/media/
 *
 * Usage:
 *   node scripts/sync-ios-media.js          # copy + prune stale files
 *   node scripts/sync-ios-media.js --check  # exit 1 if out of sync (CI)
 *   node scripts/sync-ios-media.js --dry-run
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const IOS_MEDIA_ROOT = path.join(
  ROOT,
  'ios-native/Sources/PleasureVocabularyApp/Resources/media'
);

const SYNC_RULES = [
  {
    label: 'illustrations',
    from: path.join(ROOT, 'assets/images/concepts/illustrations'),
    to: path.join(IOS_MEDIA_ROOT, 'illustrations'),
    match: (name) => name.endsWith('.png') && !name.startsWith('.'),
  },
  {
    label: 'thumbnails',
    from: path.join(ROOT, 'assets/images/concepts/thumbnails'),
    to: path.join(IOS_MEDIA_ROOT, 'thumbnails'),
    match: (name) => name.endsWith('.png') && !name.startsWith('.'),
  },
  {
    label: 'videos',
    from: path.join(ROOT, 'assets/videos'),
    to: path.join(IOS_MEDIA_ROOT, 'videos'),
    match: (name) => name.endsWith('.mp4') && !name.startsWith('.'),
    flat: true,
  },
];

const CHECK = process.argv.includes('--check');
const DRY_RUN = process.argv.includes('--dry-run');

function sha256File(filePath) {
  const buf = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(buf).digest('hex');
}

function listSourceFiles(rule) {
  if (!fs.existsSync(rule.from)) {
    throw new Error(`Missing source directory: ${path.relative(ROOT, rule.from)}`);
  }
  const names = fs.readdirSync(rule.from).filter(rule.match);
  if (rule.flat) {
    return names.map((name) => ({
      name,
      src: path.join(rule.from, name),
    }));
  }
  return names.map((name) => ({
    name,
    src: path.join(rule.from, name),
  }));
}

function listDestFiles(rule) {
  if (!fs.existsSync(rule.to)) return [];
  return fs
    .readdirSync(rule.to)
    .filter((name) => !name.startsWith('.') && name !== '.gitkeep')
    .map((name) => path.join(rule.to, name));
}

function ensureGitkeep(dir) {
  const gitkeep = path.join(dir, '.gitkeep');
  if (!fs.existsSync(gitkeep) && !DRY_RUN && !CHECK) {
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(gitkeep, '');
  }
}

function filesMatch(src, dest) {
  if (!fs.existsSync(dest)) return false;
  const srcStat = fs.statSync(src);
  const destStat = fs.statSync(dest);
  if (srcStat.size !== destStat.size) return false;
  return sha256File(src) === sha256File(dest);
}

function main() {
  const actions = [];
  let drift = 0;

  for (const rule of SYNC_RULES) {
    const sources = listSourceFiles(rule);
    const expectedNames = new Set(sources.map((s) => s.name));

    for (const { name, src } of sources) {
      const dest = path.join(rule.to, name);
      if (filesMatch(src, dest)) continue;
      drift++;
      actions.push({ type: 'copy', rule: rule.label, src, dest, name });
    }

    for (const destPath of listDestFiles(rule)) {
      const name = path.basename(destPath);
      if (expectedNames.has(name)) continue;
      drift++;
      actions.push({ type: 'remove', rule: rule.label, dest: destPath, name });
    }
  }

  if (CHECK) {
    if (drift === 0) {
      console.log('iOS media bundle is in sync with assets/.');
      return;
    }
    console.error(`iOS media out of sync (${drift} difference${drift === 1 ? '' : 's'}).`);
    for (const action of actions) {
      if (action.type === 'copy') {
        console.error(`  copy  ${path.relative(ROOT, action.src)} → ${path.relative(ROOT, action.dest)}`);
      } else {
        console.error(`  remove stale ${path.relative(ROOT, action.dest)}`);
      }
    }
    console.error('\nRun: npm run sync-ios-media');
    process.exit(1);
  }

  if (actions.length === 0) {
    console.log('iOS media already in sync.');
    return;
  }

  for (const rule of SYNC_RULES) {
    ensureGitkeep(rule.to);
  }

  for (const action of actions) {
    if (action.type === 'copy') {
      const relSrc = path.relative(ROOT, action.src);
      const relDest = path.relative(ROOT, action.dest);
      if (DRY_RUN) {
        console.log(`[dry-run] copy ${relSrc} → ${relDest}`);
        continue;
      }
      fs.mkdirSync(path.dirname(action.dest), { recursive: true });
      fs.copyFileSync(action.src, action.dest);
      console.log(`copied ${relSrc} → ${relDest}`);
    } else {
      const relDest = path.relative(ROOT, action.dest);
      if (DRY_RUN) {
        console.log(`[dry-run] remove stale ${relDest}`);
        continue;
      }
      fs.unlinkSync(action.dest);
      console.log(`removed stale ${relDest}`);
    }
  }

  console.log(`\nSynced ${actions.filter((a) => a.type === 'copy').length} file(s), removed ${actions.filter((a) => a.type === 'remove').length} stale file(s).`);
}

main();
