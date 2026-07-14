/**
 * Deduplicated media master sheet — images, videos, native diagrams.
 * Run: node scripts/generate-media-master-sheet.js [--write-md]
 *
 * Outputs:
 *   data/media-master-sheet.json
 *   data/media-master-sheet.csv
 *   docs/reports/MEDIA_MASTER_SHEET.md  (with --write-md)
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const {
  ROOT,
  PATHS,
  fileBytes,
  loadConcepts,
  loadVisualFormats,
} = require('./lib/vocab-parse');

const WRITE_MD = process.argv.includes('--write-md');
const OUT_JSON = path.join(ROOT, 'data/media-master-sheet.json');
const OUT_CSV = path.join(ROOT, 'data/media-master-sheet.csv');
const OUT_MD = path.join(ROOT, 'docs/reports/MEDIA_MASTER_SHEET.md');

const MEDIA_EXT = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.mp4', '.mov', '.webm']);
const SCAN_ROOTS = [
  'assets',
  path.join('ios/Sources/PleasureVocabularyApp/Resources/media'),
  path.join('ios/AppHost/Assets.xcassets'),
];

const NATIVE_DIAGRAMS = ['angling', 'rocking', 'shallowing', 'pairing'];

const BUNDLE_PATHS = [
  'content/v2/bundles/v2-full.bundle.json',
  'content/v2/bundles/golden-path.bundle.json',
  'ios/Sources/PleasureVocabularyApp/Resources/v2-full.bundle.json',
];

const SHELL_SCAN_DIRS = [
  'assets/images/ui',
  'assets/images/pathways',
  'assets/images/explainers',
  'assets/images',
];

function sha256File(absPath) {
  const buf = fs.readFileSync(absPath);
  return crypto.createHash('sha256').update(buf).digest('hex').slice(0, 16);
}

function walkMediaFiles(relRoot) {
  const absRoot = path.join(ROOT, relRoot);
  if (!fs.existsSync(absRoot)) return [];

  const results = [];
  const stack = [absRoot];
  while (stack.length) {
    const dir = stack.pop();
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      const abs = path.join(dir, ent.name);
      if (ent.isDirectory()) {
        if (ent.name === 'node_modules' || ent.name === '.git') continue;
        stack.push(abs);
        continue;
      }
      const ext = path.extname(ent.name).toLowerCase();
      if (!MEDIA_EXT.has(ext)) continue;
      const rel = path.relative(ROOT, abs).split(path.sep).join('/');
      results.push(rel);
    }
  }
  return results;
}

function inferSlot(rel) {
  if (rel.includes('/thumbnails/')) return 'thumbnail';
  if (rel.includes('/illustrations/')) return 'illustration';
  if (rel.includes('/videos/') || rel.endsWith('.mp4') || rel.endsWith('.mov')) return 'video';
  if (rel.includes('/pathways/')) return 'pathway';
  if (rel.includes('/explainers/')) return 'explainer';
  if (rel.includes('/communicate/')) return 'communicate-ui';
  if (rel.includes('/profile/')) return 'profile-ui';
  if (rel.includes('/ui/')) return 'shell-ui';
  if (rel.includes('AppIcon') || rel.includes('appiconset')) return 'app-icon';
  if (rel.includes('icon.png') || rel.includes('splash') || rel.includes('favicon') || rel.includes('adaptive-icon') || rel.includes('aura-background') || rel.includes('welcome-background')) {
    return 'branding';
  }
  return 'other';
}

function inferLocationTier(rel) {
  if (rel.startsWith('ios/Sources/PleasureVocabularyApp/Resources/media/')) return 'ios-copy';
  if (rel.startsWith('ios/AppHost/')) return 'ios-app-icon';
  if (rel.includes('/alternative_styles/')) return 'alternative';
  if (rel.includes('/_archive/')) return 'archive';
  if (rel.startsWith('assets/_originals/')) return 'original';
  if (rel.startsWith('assets/_staging/pilot/')) return 'staging-pilot';
  if (rel.startsWith('assets/_staging/reference/')) return 'staging-reference';
  if (rel.startsWith('assets/videos/originals/')) return 'video-original';
  if (rel.startsWith('assets/images/concepts/') || rel.startsWith('assets/videos/')) return 'production';
  if (rel.startsWith('assets/images/')) return 'shell-production';
  return 'other';
}

function inferConceptId(rel, slot, conceptIds) {
  const base = path.basename(rel, path.extname(rel));
  if (conceptIds.includes(base)) return base;

  const thumb = rel.match(/thumbnails\/([^/]+)\./);
  if (thumb && conceptIds.includes(thumb[1])) return thumb[1];

  const ill = rel.match(/illustrations\/([^/]+)\./);
  if (ill && conceptIds.includes(ill[1])) return ill[1];

  const vid = rel.match(/videos\/([^/]+)\./);
  if (vid && conceptIds.includes(vid[1])) return vid[1];

  const pilot = rel.match(/_staging\/pilot\/illustrations\/([^/]+)\//);
  if (pilot) return pilot[1];

  const origConcept = rel.match(/_originals\/images\/concepts\/([^/]+)\./);
  if (origConcept) return origConcept[1];

  if (slot === 'pathway') return base;
  if (slot === 'explainer') return base;

  return null;
}

function inferStyleFamily(rel, slot, conceptId, category) {
  if (rel.includes('alternative_styles/botanical')) return 'botanical-metaphor';
  if (rel.includes('alternative_styles/sketchbook')) return 'sketchbook-journal';
  if (rel.includes('/_staging/reference/')) return 'reference-render';
  if (slot === 'thumbnail') return 'abstract-glyph';
  if (slot === 'video' || slot === 'video-original') return 'motion';
  if (inferLocationTier(rel) === 'archive') return 'superseded-ui';

  const abstractPsych = new Set([
    'spectatoring',
    'embodied-presence',
    'non-concordance',
    'sexual-self-esteem',
    'body-appreciation',
    'spontaneous-desire',
    'responsive-desire',
    'golden-trio',
  ]);
  const anatomical = new Set([
    'clitoral-structure',
    'nerve-density',
    'clitourethrovaginal',
    'internal-stimulation',
    'angling',
    'rocking',
    'shallowing',
    'pairing',
  ]);

  if (conceptId && anatomical.has(conceptId)) return 'scientific-anatomical';
  if (conceptId && abstractPsych.has(conceptId) && slot === 'illustration') return 'ethereal-abstract';
  if (category === 'anatomy') return 'scientific-anatomical';
  if (category === 'psychological') return 'ethereal-abstract';
  if (slot === 'illustration') return 'scientific-warmth-plate';
  return 'unknown';
}

function loadBundleMediaPaths() {
  const byPath = {
    'v2-full': new Set(),
    'golden-path': new Set(),
    'ios-v2-full': new Set(),
  };
  const keys = ['v2-full', 'golden-path', 'ios-v2-full'];
  for (let i = 0; i < BUNDLE_PATHS.length; i++) {
    const p = path.join(ROOT, BUNDLE_PATHS[i]);
    if (!fs.existsSync(p)) continue;
    const bundle = JSON.parse(fs.readFileSync(p, 'utf8'));
    for (const m of bundle.media || []) {
      if (m.path && !m.path.startsWith('native://')) byPath[keys[i]].add(m.path);
      if (m.reducedMotionFallback) byPath[keys[i]].add(m.reducedMotionFallback);
    }
  }
  return byPath;
}

function loadVocabWiredPaths() {
  const wired = new Set();
  const source = fs.readFileSync(PATHS.vocab, 'utf8');
  for (const m of source.matchAll(/require\('@\/([^']+)'\)/g)) {
    wired.add(m[1]);
  }
  return wired;
}

function loadRegistry() {
  if (!fs.existsSync(PATHS.registry)) return null;
  return JSON.parse(fs.readFileSync(PATHS.registry, 'utf8'));
}

function loadReferenceRenders() {
  const p = path.join(ROOT, 'data/reference-renders.json');
  if (!fs.existsSync(p)) return {};
  const raw = JSON.parse(fs.readFileSync(p, 'utf8'));
  const byPath = {};
  for (const fam of Object.values(raw.families || {})) {
    if (fam.referencePath) byPath[fam.referencePath] = fam;
    if (fam.candidatePath) byPath[fam.candidatePath] = fam;
  }
  return byPath;
}

function registryNotesForPath(rel, registry) {
  if (!registry?.concepts) return null;
  for (const [conceptId, entry] of Object.entries(registry.concepts)) {
    for (const asset of Object.values(entry.assets || {})) {
      if (asset?.path === rel) {
        return {
          conceptId,
          status: asset.status,
          promotionDecision: entry.evaluation?.promotionDecision,
          notes: entry.evaluation?.notes || asset.notes || '',
        };
      }
    }
    for (const pilot of entry.pilots || []) {
      if (pilot.path === rel) {
        return {
          conceptId,
          status: pilot.decision || 'pilot',
          promotionDecision: pilot.decision,
          notes: pilot.notes || '',
        };
      }
    }
  }
  return null;
}

function inferStyleBibleFit(row, referenceByPath, registryMeta) {
  const tier = row.location_tier;
  if (tier === 'alternative' || tier === 'archive') return 'off-brief';
  if (tier === 'ios-copy') return 'duplicate';

  const ref = referenceByPath[row.path];
  if (ref?.status === 'approved' && row.path === ref.referencePath) return 'matches';

  if (registryMeta?.promotionDecision === 'rejected') return 'off-brief';
  if (registryMeta?.status === 'wired' && tier === 'production') return 'matches';
  if (tier === 'staging-pilot' || tier === 'staging-reference') return 'review';
  if (tier === 'original' || tier === 'video-original') return 'master-archive';
  if (row.slot === 'thumbnail') return 'partial';
  if (row.slot === 'shell-ui' || row.slot === 'pathway' || row.slot === 'explainer') return 'matches';

  return 'unknown';
}

function suggestDecision(row) {
  const tier = row.location_tier;
  if (tier === 'staging-pilot') return 'delete';
  if (tier === 'alternative' || tier === 'archive') return 'delete';
  if (tier === 'ios-copy') return 'consolidate-delete-copy';
  if (row.wired_in_vocab || row.wired_in_v2_full) {
    if (row.style_bible_fit === 'off-brief') return 'keep-until-regen';
    return 'keep';
  }
  if (tier === 'original' || tier === 'video-original') return 'keep-until-cut';
  if (tier === 'staging-reference') return 'archive';
  if (row.is_duplicate_of_production) return 'delete-duplicate';
  return 'review';
}

function canonicalProductionPath(row) {
  if (!row.concept_id) return null;
  switch (row.slot) {
    case 'thumbnail':
      return `assets/images/concepts/thumbnails/${row.concept_id}.png`;
    case 'illustration':
      return `assets/images/concepts/illustrations/${row.concept_id}.png`;
    case 'video':
      return `assets/videos/${row.concept_id}.mp4`;
    default:
      return null;
  }
}

function escapeCsv(value) {
  const s = value == null ? '' : String(value);
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function main() {
  const concepts = loadConcepts();
  const conceptIds = concepts.map((c) => c.id);
  const conceptById = Object.fromEntries(concepts.map((c) => [c.id, c]));
  const { formats } = loadVisualFormats();
  const vocabWired = loadVocabWiredPaths();
  const bundleWired = loadBundleMediaPaths();
  const registry = loadRegistry();
  const referenceByPath = loadReferenceRenders();

  const allPaths = new Set();
  for (const root of SCAN_ROOTS) {
    for (const rel of walkMediaFiles(root)) allPaths.add(rel);
  }

  const rows = [];
  for (const rel of [...allPaths].sort()) {
    const abs = path.join(ROOT, rel);
    const slot = inferSlot(rel);
    const location_tier = inferLocationTier(rel);
    const concept_id = inferConceptId(rel, slot, conceptIds);
    const category = concept_id ? conceptById[concept_id]?.category || null : null;
    const bytes = fileBytes(rel);
    const content_hash = fs.existsSync(abs) ? sha256File(abs) : null;
    const registryMeta = registryNotesForPath(rel, registry);

    const canonical = canonicalProductionPath({ concept_id, slot });
    const is_production_canonical = canonical === rel;
    const is_duplicate_of_production =
      canonical != null && rel !== canonical && path.basename(rel) === path.basename(canonical);

    const wired_in_vocab = vocabWired.has(rel);
    const wired_in_v2_full = bundleWired['v2-full'].has(rel);
    const wired_in_golden_path = bundleWired['golden-path'].has(rel);
    const wired_in_ios_bundle = bundleWired['ios-v2-full'].has(rel);

    const style_family = inferStyleFamily(rel, slot, concept_id, category);
    const style_bible_fit = inferStyleBibleFit(
      { path: rel, location_tier, slot },
      referenceByPath,
      registryMeta
    );

    const row = {
      path: rel,
      slot,
      concept_id,
      category,
      location_tier,
      bytes,
      content_hash,
      duplicate_group: content_hash ? `${slot}:${content_hash}` : null,
      basename_group: concept_id && ['thumbnail', 'illustration', 'video'].includes(slot)
        ? `${slot}:${concept_id}`
        : `${slot}:${path.basename(rel)}`,
      is_production_canonical,
      is_duplicate_of_production,
      wired_in_vocab,
      wired_in_v2_full,
      wired_in_golden_path,
      wired_in_ios_bundle,
      format_lock: concept_id ? formats[concept_id] || null : null,
      has_native_diagram: concept_id ? NATIVE_DIAGRAMS.includes(concept_id) : false,
      style_family,
      style_bible_fit,
      registry_status: registryMeta?.status || null,
      registry_notes: registryMeta?.notes || null,
      suggested_decision: null,
    };
    row.suggested_decision = suggestDecision(row);
    rows.push(row);
  }

  for (const diagramId of NATIVE_DIAGRAMS) {
    const concept = conceptById[diagramId];
    rows.push({
      path: `native://diagram/${diagramId}`,
      slot: 'diagram',
      concept_id: diagramId,
      category: concept?.category || null,
      location_tier: 'native-code',
      bytes: null,
      content_hash: null,
      duplicate_group: `diagram:${diagramId}`,
      basename_group: `diagram:${diagramId}`,
      is_production_canonical: true,
      is_duplicate_of_production: false,
      wired_in_vocab: !!concept?.diagramType,
      wired_in_v2_full: true,
      wired_in_golden_path: ['angling', 'pairing'].includes(diagramId),
      wired_in_ios_bundle: true,
      format_lock: formats[diagramId] || null,
      has_native_diagram: true,
      style_family: 'interactive-skia',
      style_bible_fit: 'matches',
      registry_status: 'wired',
      registry_notes: 'Rendered in ConceptDiagrams.swift + components/diagrams/*.tsx',
      suggested_decision: 'keep',
    });
  }

  rows.sort((a, b) => {
    const ca = a.concept_id || 'zzz';
    const cb = b.concept_id || 'zzz';
    if (ca !== cb) return ca.localeCompare(cb);
    if (a.slot !== b.slot) return a.slot.localeCompare(b.slot);
    return a.path.localeCompare(b.path);
  });

  const hashGroups = {};
  for (const row of rows) {
    if (!row.content_hash) continue;
    if (!hashGroups[row.content_hash]) hashGroups[row.content_hash] = [];
    hashGroups[row.content_hash].push(row.path);
  }

  const basenameGroups = {};
  for (const row of rows) {
    if (!basenameGroups[row.basename_group]) basenameGroups[row.basename_group] = [];
    basenameGroups[row.basename_group].push(row.path);
  }

  for (const row of rows) {
    const sameHash = row.content_hash ? hashGroups[row.content_hash] : [];
    const sameBasename = basenameGroups[row.basename_group] || [];
    row.duplicate_paths_same_hash = sameHash.filter((p) => p !== row.path);
    row.duplicate_paths_same_basename = sameBasename.filter((p) => p !== row.path);
    row.duplicate_count_same_basename = sameBasename.length;
  }

  const summary = {
    generated_at: new Date().toISOString(),
    total_rows: rows.length,
    file_rows: rows.filter((r) => r.location_tier !== 'native-code').length,
    native_diagram_rows: NATIVE_DIAGRAMS.length,
    by_location_tier: {},
    by_slot: {},
    by_style_family: {},
    by_suggested_decision: {},
    by_style_bible_fit: {},
    basename_groups_with_duplicates: Object.entries(basenameGroups).filter(([, paths]) => paths.length > 1).length,
    hash_groups_with_duplicates: Object.entries(hashGroups).filter(([, paths]) => paths.length > 1).length,
    wired_in_vocab_count: rows.filter((r) => r.wired_in_vocab).length,
    production_canonical_count: rows.filter((r) => r.is_production_canonical).length,
  };

  for (const row of rows) {
    summary.by_location_tier[row.location_tier] = (summary.by_location_tier[row.location_tier] || 0) + 1;
    summary.by_slot[row.slot] = (summary.by_slot[row.slot] || 0) + 1;
    summary.by_style_family[row.style_family] = (summary.by_style_family[row.style_family] || 0) + 1;
    summary.by_suggested_decision[row.suggested_decision] = (summary.by_suggested_decision[row.suggested_decision] || 0) + 1;
    summary.by_style_bible_fit[row.style_bible_fit] = (summary.by_style_bible_fit[row.style_bible_fit] || 0) + 1;
  }

  const payload = { summary, rows };
  fs.writeFileSync(OUT_JSON, JSON.stringify(payload, null, 2));

  const csvColumns = [
    'path',
    'slot',
    'concept_id',
    'category',
    'location_tier',
    'bytes',
    'content_hash',
    'basename_group',
    'duplicate_count_same_basename',
    'is_production_canonical',
    'wired_in_vocab',
    'wired_in_v2_full',
    'wired_in_golden_path',
    'style_family',
    'style_bible_fit',
    'registry_status',
    'registry_notes',
    'suggested_decision',
    'duplicate_paths_same_basename',
  ];

  const csvLines = [csvColumns.join(',')];
  for (const row of rows) {
    csvLines.push(
      csvColumns
        .map((col) => {
          const val = row[col];
          if (Array.isArray(val)) return escapeCsv(val.join('; '));
          return escapeCsv(val);
        })
        .join(',')
    );
  }
  fs.writeFileSync(OUT_CSV, csvLines.join('\n'));

  if (WRITE_MD) {
    writeMarkdownReport(summary, rows, basenameGroups);
  }

  console.log('Media master sheet generated');
  console.log(`  JSON: ${path.relative(ROOT, OUT_JSON)} (${rows.length} rows)`);
  console.log(`  CSV:  ${path.relative(ROOT, OUT_CSV)}`);
  console.log('');
  console.log('Summary:');
  console.log(`  File assets scanned:     ${summary.file_rows}`);
  console.log(`  Basename duplicate groups: ${summary.basename_groups_with_duplicates}`);
  console.log(`  Content-hash duplicate groups: ${summary.hash_groups_with_duplicates}`);
  console.log(`  Wired in vocabulary:     ${summary.wired_in_vocab_count}`);
  console.log('');
  console.log('By location tier:');
  for (const [tier, count] of Object.entries(summary.by_location_tier).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${tier.padEnd(22)} ${count}`);
  }
  console.log('');
  console.log('Suggested decisions:');
  for (const [decision, count] of Object.entries(summary.by_suggested_decision).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${decision.padEnd(28)} ${count}`);
  }
  if (WRITE_MD) {
    console.log(`  MD:   ${path.relative(ROOT, OUT_MD)}`);
  } else {
    console.log('');
    console.log('Tip: re-run with --write-md for docs/reports/MEDIA_MASTER_SHEET.md');
  }
}

function writeMarkdownReport(summary, rows, basenameGroups) {
  const dupGroups = Object.entries(basenameGroups)
    .filter(([, paths]) => paths.length > 1)
    .sort((a, b) => b[1].length - a[1].length);

  const conceptRows = rows.filter((r) => r.concept_id && ['thumbnail', 'illustration', 'video', 'diagram'].includes(r.slot));

  const lines = [];
  const out = (s = '') => lines.push(s);

  out('# Media Master Sheet');
  out('');
  out(`**Generated:** ${summary.generated_at.slice(0, 10)}`);
  out('**Refresh:** `node scripts/generate-media-master-sheet.js --write-md`');
  out('');
  out('Machine-readable: [`data/media-master-sheet.json`](../../data/media-master-sheet.json), [`data/media-master-sheet.csv`](../../data/media-master-sheet.csv)');
  out('');
  out('## Summary');
  out('');
  out(`| Metric | Count |`);
  out(`|--------|------:|`);
  out(`| Total rows | ${summary.total_rows} |`);
  out(`| File assets | ${summary.file_rows} |`);
  out(`| Basename duplicate groups | ${summary.basename_groups_with_duplicates} |`);
  out(`| Hash duplicate groups | ${summary.hash_groups_with_duplicates} |`);
  out(`| Wired in vocabulary | ${summary.wired_in_vocab_count} |`);
  out('');
  out('## Duplicate groups (concept slots)');
  out('');
  for (const [group, paths] of dupGroups.slice(0, 40)) {
    out(`### ${group} (${paths.length} copies)`);
    for (const p of paths) {
      const row = rows.find((r) => r.path === p);
      const flags = [
        row?.is_production_canonical ? 'canonical' : null,
        row?.wired_in_vocab ? 'wired' : null,
        row?.style_bible_fit,
        row?.suggested_decision,
      ]
        .filter(Boolean)
        .join(', ');
      out(`- \`${p}\`${flags ? ` — ${flags}` : ''}`);
    }
    out('');
  }
  out('## Concept media matrix');
  out('');
  out('| Concept | Thumbnail | Illustration | Video | Diagram | Style notes |');
  out('|---------|-----------|--------------|-------|---------|-------------|');

  const conceptIds = [...new Set(conceptRows.map((r) => r.concept_id))].sort();
  for (const id of conceptIds) {
    const thumb = rows.find((r) => r.concept_id === id && r.slot === 'thumbnail' && r.is_production_canonical);
    const ill = rows.find((r) => r.concept_id === id && r.slot === 'illustration' && r.is_production_canonical);
    const vid = rows.find((r) => r.concept_id === id && r.slot === 'video' && r.location_tier === 'production');
    const diagram = rows.find((r) => r.concept_id === id && r.slot === 'diagram');
    const illStyle = ill?.style_family || '—';
    const fit = ill?.style_bible_fit || diagram?.style_bible_fit || '—';
    out(
      `| ${id} | ${thumb ? '✅' : '—'} | ${ill ? '✅' : '—'} | ${vid ? '✅' : '—'} | ${diagram ? 'native' : '—'} | ${illStyle} / ${fit} |`
    );
  }

  fs.mkdirSync(path.dirname(OUT_MD), { recursive: true });
  fs.writeFileSync(OUT_MD, lines.join('\n'));
}

main();
