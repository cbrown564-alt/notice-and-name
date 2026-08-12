/**
 * Copy canonical app audio from assets/audio into the iOS SPM resource bundle.
 * Source: phrases, onboarding (no rushed-backup), notice-moments, sfx *-v1.
 * Explainer narration retired (no ElevenLabs credits); explainers/ sync clears stale dest.
 * Dest: ios/Sources/PleasureVocabularyApp/Resources/media/audio/
 * Usage: node scripts/sync-ios-audio.js [--check|--dry-run]
 * Also invoked from sync-ios-media.js.
 */

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const IOS_AUDIO_ROOT = path.join(ROOT, "ios/Sources/PleasureVocabularyApp/Resources/media/audio");

const SYNC_RULES = [
  {
    label: "phrases",
    from: path.join(ROOT, "assets/audio/phrases"),
    to: path.join(IOS_AUDIO_ROOT, "phrases"),
    match: (name) => name.endsWith(".mp3") && !name.startsWith("."),
  },
  {
    label: "onboarding",
    from: path.join(ROOT, "assets/audio/onboarding"),
    to: path.join(IOS_AUDIO_ROOT, "onboarding"),
    match: (name) => name.endsWith(".mp3") && !name.startsWith(".") && !name.includes("rushed-backup"),
  },
  {
    label: "notice-moments",
    from: path.join(ROOT, "assets/audio/notice-moments"),
    to: path.join(IOS_AUDIO_ROOT, "notice-moments"),
    match: (name) => name.endsWith(".mp3") && !name.startsWith("."),
  },
  {
    // Explainer narration retired — keep rule so empty/missing source clears iOS Resources.
    label: "explainers",
    from: path.join(ROOT, "assets/audio/explainers"),
    to: path.join(IOS_AUDIO_ROOT, "explainers"),
    match: (name) => name.endsWith(".mp3") && !name.startsWith("."),
    optionalSource: true,
  },
  {
    label: "sfx",
    from: path.join(ROOT, "assets/audio/sfx"),
    to: path.join(IOS_AUDIO_ROOT, "sfx"),
    match: (name) => name.endsWith("-v1.mp3") && !name.startsWith("."),
  },
];

function sha256File(filePath) {
  const buf = fs.readFileSync(filePath);
  return crypto.createHash("sha256").update(buf).digest("hex");
}

function listSourceFiles(rule) {
  if (!fs.existsSync(rule.from)) {
    if (rule.optionalSource) return [];
    throw new Error("Missing source directory: " + path.relative(ROOT, rule.from));
  }
  return fs.readdirSync(rule.from).filter(rule.match).map((name) => ({
    name,
    src: path.join(rule.from, name),
  }));
}

function listDestFiles(rule) {
  if (!fs.existsSync(rule.to)) return [];
  return fs.readdirSync(rule.to)
    .filter((name) => !name.startsWith(".") && name !== ".gitkeep")
    .map((name) => path.join(rule.to, name));
}

function ensureGitkeep(dir) {
  const gitkeep = path.join(dir, ".gitkeep");
  if (!fs.existsSync(gitkeep)) {
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(gitkeep, "");
  }
}

function filesMatch(src, dest) {
  if (!fs.existsSync(dest)) return false;
  const srcStat = fs.statSync(src);
  const destStat = fs.statSync(dest);
  if (srcStat.size !== destStat.size) return false;
  return sha256File(src) === sha256File(dest);
}

function syncAudio(opts) {
  opts = opts || {};
  const argv = opts.argv || process.argv.slice(2);
  const CHECK = opts.check != null ? opts.check : argv.includes("--check");
  const DRY_RUN = opts.dryRun != null ? opts.dryRun : argv.includes("--dry-run");
  const actions = [];
  let drift = 0;

  for (const rule of SYNC_RULES) {
    const sources = listSourceFiles(rule);
    const expectedNames = new Set(sources.map((s) => s.name));
    for (const item of sources) {
      const dest = path.join(rule.to, item.name);
      if (filesMatch(item.src, dest)) continue;
      drift++;
      actions.push({ type: "copy", rule: rule.label, src: item.src, dest: dest, name: item.name });
    }
    for (const destPath of listDestFiles(rule)) {
      const name = path.basename(destPath);
      if (expectedNames.has(name)) continue;
      drift++;
      actions.push({ type: "remove", rule: rule.label, dest: destPath, name: name });
    }
  }
  if (CHECK) {
    if (drift === 0) {
      console.log("iOS audio bundle is in sync with assets/audio/.");
      return 0;
    }
    console.error("iOS audio out of sync (" + drift + " diffs).");
    for (const action of actions) {
      if (action.type === "copy") {
        console.error("  copy  " + path.relative(ROOT, action.src) + " -> " + path.relative(ROOT, action.dest));
      } else {
        console.error("  remove stale " + path.relative(ROOT, action.dest));
      }
    }
    console.error("");
    console.error("Run sync-ios-media or sync-ios-audio to refresh.");
    process["exitCode"] = 1;
    return drift;
  }

  if (actions.length === 0) {
    console.log("iOS audio already in sync.");
    return 0;
  }
  if (!DRY_RUN) {
    for (const rule of SYNC_RULES) {
      ensureGitkeep(rule.to);
    }
  }

  for (const action of actions) {
    if (action.type === "copy") {
      const relSrc = path.relative(ROOT, action.src);
      const relDest = path.relative(ROOT, action.dest);
      if (DRY_RUN) {
        console.log("[dry-run] copy " + relSrc + " -> " + relDest);
        continue;
      }
      fs.mkdirSync(path.dirname(action.dest), { recursive: true });
      fs.copyFileSync(action.src, action.dest);
      console.log("copied " + relSrc + " -> " + relDest);
    } else {
      const relDest = path.relative(ROOT, action.dest);
      if (DRY_RUN) {
        console.log("[dry-run] remove stale " + relDest);
        continue;
      }
      fs.unlinkSync(action.dest);
      console.log("removed stale " + relDest);
    }
  }

  const copied = actions.filter((a) => a.type === "copy").length;
  const removed = actions.filter((a) => a.type === "remove").length;
  console.log("\nAudio synced " + copied + " file(s), removed " + removed + " stale file(s).");
  return drift;
}

if (require.main === module) {
  const drift = syncAudio();
  if (process["exitCode"] === 1 || (process.argv.includes("--check") && drift > 0)) {
    process["exit"](1);
  }
}

module.exports = { syncAudio: syncAudio, SYNC_RULES: SYNC_RULES, IOS_AUDIO_ROOT: IOS_AUDIO_ROOT };
