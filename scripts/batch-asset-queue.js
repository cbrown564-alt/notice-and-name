/**
 * Phase D asset work queue — illustrations, thumbnails, videos, shell.
 * Run: node scripts/batch-asset-queue.js [--json]
 */

const fs = require('fs');
const path = require('path');
const {
  ROOT,
  loadConcepts,
  loadVisualFormats,
  SIZE_BUDGET,
  videoBudgetForConcept,
  fileBytes,
  fileExists,
} = require('./lib/vocab-parse');

const REFERENCE_IDS = new Set([
  'angling',
  'spreading',
  'warmup-window',
  'non-concordance',
  'clitoral-structure',
]);

const ILLUSTRATION_BATCH = [
  { label: 'Techniques', ids: ['angling', 'rocking', 'shallowing', 'pairing'] },
  { label: 'Sensations', ids: ['building', 'plateauing', 'edging', 'spreading', 'pulsing'] },
  { label: 'Timing', ids: ['warmup-window', 'responsive-desire', 'spontaneous-desire', 'golden-trio'] },
  { label: 'Psychological', ids: ['spectatoring', 'embodied-presence', 'non-concordance', 'sexual-self-esteem', 'body-appreciation'] },
  { label: 'Anatomy', ids: ['clitoral-structure', 'nerve-density', 'clitourethrovaginal', 'internal-stimulation'] },
];

const SHELL_QUEUE = [
  { tier: 'video-p0', items: [
    { id: 'pulsing', prompt: 'docs/pipelines/prompts/videos/pulsing.md', asset: 'assets/videos/pulsing.mp4' },
    { id: 'clitoral-structure', prompt: 'docs/pipelines/prompts/videos/clitoral-structure.md', asset: 'assets/videos/clitoral-structure.mp4' },
    { id: 'nerve-density', prompt: 'docs/pipelines/prompts/videos/nerve-density.md', asset: 'assets/videos/nerve-density.mp4' },
  ]},
  { tier: 'video-p1-presence', items: [
    { id: 'spontaneous-desire', prompt: 'docs/pipelines/prompts/videos/spontaneous-desire.md', asset: 'assets/videos/spontaneous-desire.mp4' },
    { id: 'embodied-presence', prompt: 'docs/pipelines/prompts/videos/embodied-presence.md', asset: 'assets/videos/embodied-presence.mp4' },
  ]},
  { tier: 'shell-pathways', items: [
    { id: 'foundations', prompt: 'docs/pipelines/prompts/shell/pathways/foundations.md', asset: 'assets/images/pathways/foundations.png' },
    { id: 'solo-exploration', prompt: 'docs/pipelines/prompts/shell/pathways/solo-exploration.md', asset: 'assets/images/pathways/solo-exploration.png' },
    { id: 'partner-communication', prompt: 'docs/pipelines/prompts/shell/pathways/partner-communication.md', asset: 'assets/images/pathways/partner-communication.png' },
    { id: 'expanding-repertoire', prompt: 'docs/pipelines/prompts/shell/pathways/expanding-repertoire.md', asset: 'assets/images/pathways/expanding-repertoire.png' },
    { id: 'mindful-presence', prompt: 'docs/pipelines/prompts/shell/pathways/mindful-presence.md', asset: 'assets/images/pathways/mindful-presence.png' },
  ]},
  { tier: 'shell-explainers', items: [
    { id: 'orgasm-gap', prompt: 'docs/pipelines/prompts/shell/explainers/orgasm-gap.md', asset: 'assets/images/explainers/orgasm-gap.png' },
    { id: 'anatomy-101', prompt: 'docs/pipelines/prompts/shell/explainers/anatomy-101.md', asset: 'assets/images/explainers/anatomy-101.png' },
    { id: 'mind-body', prompt: 'docs/pipelines/prompts/shell/explainers/mind-body.md', asset: 'assets/images/explainers/mind-body.png' },
    { id: 'communication-science-101', prompt: 'docs/pipelines/prompts/shell/explainers/communication-science-101.md', asset: 'assets/images/explainers/communication-science-101.png' },
  ]},
  { tier: 'shell-ui', items: [
    { id: 'slide-name', prompt: 'docs/pipelines/prompts/shell/ui/slide-name.md', asset: 'assets/images/ui/slide-name.png' },
    { id: 'slide-understand', prompt: 'docs/pipelines/prompts/shell/ui/slide-understand.md', asset: 'assets/images/ui/slide-understand.png' },
    { id: 'slide-explore', prompt: 'docs/pipelines/prompts/shell/ui/slide-explore.md', asset: 'assets/images/ui/slide-explore.png' },
    { id: 'home-welcome', prompt: 'docs/pipelines/prompts/shell/ui/home-welcome.md', asset: 'assets/images/ui/home-welcome.png' },
    { id: 'daily-discovery', prompt: 'docs/pipelines/prompts/shell/ui/daily-discovery.md', asset: 'assets/images/ui/daily-discovery.png' },
    { id: 'empty-journal', prompt: 'docs/pipelines/prompts/shell/ui/empty-journal.md', asset: 'assets/images/ui/empty-journal.png' },
    { id: 'empty-collection', prompt: 'docs/pipelines/prompts/shell/ui/empty-collection.md', asset: 'assets/images/ui/empty-collection.png' },
  ]},
];

function kb(bytes) {
  if (bytes == null) return null;
  return Math.round(bytes / 1024);
}

function illustrationStatus(conceptId) {
  const rel = `assets/images/concepts/illustrations/${conceptId}.png`;
  const bytes = fileBytes(rel);
  const over = bytes != null && bytes > SIZE_BUDGET.illustration;
  const isRef = REFERENCE_IDS.has(conceptId);
  if (!fileExists(rel)) return { action: 'generate', bytes, over, isRef };
  if (over) return { action: isRef ? 'regen-reference' : 'regen', bytes, over, isRef };
  if (isRef) return { action: 'keep-reference', bytes, over, isRef };
  return { action: 'optional-refresh', bytes, over, isRef };
}

function thumbnailStatus(conceptId) {
  const rel = `assets/images/concepts/thumbnails/${conceptId}.png`;
  const bytes = fileBytes(rel);
  const over = bytes != null && bytes > SIZE_BUDGET.thumbnail;
  if (!fileExists(rel)) return { action: 'generate', bytes, over };
  if (over) return { action: 'regen', bytes, over };
  return { action: 'derive-from-plate', bytes, over };
}

function videoStatus(conceptId, formats, videoProfiles) {
  if (formats[conceptId] !== 'video') return null;
  const rel = `assets/videos/${conceptId}.mp4`;
  const bytes = fileBytes(rel);
  const budget = videoBudgetForConcept(conceptId, videoProfiles);
  const profile = videoProfiles[conceptId];
  const wired = bytes != null;
  const over = wired && bytes > budget;
  return {
    tier: profile?.tier || 'abstract-loop',
    priority: profile?.priority || 'P2',
    action: wired ? (over ? 're-transcode' : 'review-style') : 'generate',
    bytes,
    budgetKb: Math.round(budget / 1024),
    prompt: `docs/pipelines/prompts/videos/${conceptId}.md`,
  };
}

function buildQueue() {
  const concepts = loadConcepts();
  const byId = Object.fromEntries(concepts.map((c) => [c.id, c]));
  const { formats, videoProfiles } = loadVisualFormats();

  const illustrationBatches = ILLUSTRATION_BATCH.map((batch) => ({
    label: batch.label,
    items: batch.ids.map((id) => {
      const ill = illustrationStatus(id);
      const thumb = thumbnailStatus(id);
      const vid = videoStatus(id, formats, videoProfiles);
      return {
        id,
        category: byId[id]?.category,
        format: formats[id],
        illustration: ill,
        thumbnail: thumb,
        video: vid,
        illPrompt: `docs/pipelines/prompts/illustrations/${id}.md`,
        thumbPrompt: `docs/pipelines/prompts/illustrations/${id}-thumb.md`,
      };
    }),
  }));

  const shellItems = SHELL_QUEUE.map((group) => ({
    tier: group.tier,
    items: group.items.map((item) => {
      const bytes = fileBytes(item.asset);
      const budget =
        item.asset.includes('/pathways/') || item.asset.includes('/explainers/')
          ? 200 * 1024
          : item.asset.includes('/ui/slide')
            ? 150 * 1024
            : 150 * 1024;
      return {
        ...item,
        exists: fileExists(item.asset),
        kb: kb(bytes),
        overBudget: bytes != null && bytes > budget,
        action: bytes == null ? 'generate' : 'regen-for-coherence',
      };
    }),
  }));

  const counts = {
    illRegen: 0,
    thumbRegen: 0,
    videoGenerate: 0,
    shellRegen: 0,
  };
  for (const batch of illustrationBatches) {
    for (const item of batch.items) {
      if (['regen', 'regen-reference', 'generate'].includes(item.illustration.action)) counts.illRegen++;
      if (item.thumbnail.action === 'regen' || item.thumbnail.action === 'generate') counts.thumbRegen++;
      if (item.video?.action === 'generate') counts.videoGenerate++;
    }
  }
  for (const group of shellItems) {
    counts.shellRegen += group.items.length;
  }

  return {
    phase: 'D',
    updated: new Date().toISOString().slice(0, 10),
    referenceConcepts: [...REFERENCE_IDS],
    illustrationBatches,
    shellQueue: shellItems,
    counts,
  };
}

function printReport(queue) {
  console.log('\nPhase D — Asset work queue');
  console.log('═'.repeat(48));
  console.log(`Reference plates (keep unless over budget): ${queue.referenceConcepts.join(', ')}`);
  console.log(`Illustrations needing work: ${queue.counts.illRegen}`);
  console.log(`Thumbnails needing work:   ${queue.counts.thumbRegen}`);
  console.log(`Videos to generate:        ${queue.counts.videoGenerate}`);
  console.log(`Shell assets in queue:     ${queue.counts.shellRegen}`);
  console.log('');

  for (const batch of queue.illustrationBatches) {
    console.log(`── ${batch.label} ──`);
    for (const item of batch.items) {
      const illKb = kb(item.illustration.bytes);
      const flags = [
        item.illustration.action,
        item.thumbnail.over ? 'thumb-over' : null,
        item.video ? `video:${item.video.action}` : null,
      ].filter(Boolean);
      console.log(`  ${item.id.padEnd(22)} ${String(illKb).padStart(4)} KB ill  [${flags.join(', ')}]`);
    }
    console.log('');
  }

  console.log('── Shell & video priority ──');
  for (const group of queue.shellQueue) {
    console.log(`  ${group.tier}`);
    for (const item of group.items) {
      const mark = item.exists ? (item.overBudget ? '⚠ over' : '✓ disk') : '☐ missing';
      console.log(`    ${item.id.padEnd(28)} ${mark}  → ${item.prompt}`);
    }
  }
  console.log('\nAfter each batch: npm run compress-assets && npm run sync-registry && npm run validate-manifest');
}

function main() {
  const queue = buildQueue();
  if (process.argv.includes('--json')) {
    console.log(JSON.stringify(queue, null, 2));
    return;
  }
  printReport(queue);
}

main();
