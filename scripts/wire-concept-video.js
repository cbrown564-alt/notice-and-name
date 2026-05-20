/**
 * Wire illustrationVideo on the illustrate slide after MP4 is in place.
 *
 * Usage:
 *   node scripts/wire-concept-video.js <concept-id>
 *
 * Example (after transcode):
 *   ./scripts/transcode-video.sh ~/Downloads/pulsing-veo.mp4 assets/videos/pulsing.mp4
 *   node scripts/wire-concept-video.js pulsing
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const VOCAB_PATH = path.join(ROOT, 'data/vocabulary.ts');

function usage() {
  console.error('Usage: node scripts/wire-concept-video.js <concept-id>');
  process.exit(1);
}

function main() {
  const conceptId = process.argv[2];
  if (!conceptId) usage();

  const videoRel = `assets/videos/${conceptId}.mp4`;
  const videoPath = path.join(ROOT, videoRel);
  if (!fs.existsSync(videoPath)) {
    console.error(`Video not found: ${videoRel}`);
    console.error('Transcode first: ./scripts/transcode-video.sh <source> ' + videoRel);
    process.exit(1);
  }

  let source = fs.readFileSync(VOCAB_PATH, 'utf8');
  const idMarker = `id: '${conceptId}'`;
  const idIdx = source.indexOf(idMarker);
  if (idIdx === -1) {
    console.error(`Concept not found in vocabulary.ts: ${conceptId}`);
    process.exit(1);
  }

  const nextConcept = source.indexOf("\n  {\n    id: '", idIdx + idMarker.length);
  const blockEnd = nextConcept === -1 ? source.length : nextConcept;
  const block = source.slice(idIdx, blockEnd);

  if (block.includes('illustrationVideo:')) {
    console.log(`${conceptId}: illustrationVideo already wired`);
    process.exit(0);
  }

  const illAssetRe = new RegExp(
    `(type: 'illustrate'[\\s\\S]*?illustrationAsset: require\\('@/assets/images/concepts/illustrations/${conceptId}\\.png'\\),)`
  );
  const match = block.match(illAssetRe);
  if (!match) {
    console.error(`Could not find illustrate illustrationAsset for ${conceptId}`);
    process.exit(1);
  }

  const insertLine = `\n        illustrationVideo: require('@/assets/videos/${conceptId}.mp4'),`;
  const updatedBlock = block.replace(match[1], match[1] + insertLine);
  const updatedSource = source.slice(0, idIdx) + updatedBlock + source.slice(blockEnd);

  fs.writeFileSync(VOCAB_PATH, updatedSource);
  const kb = (fs.statSync(videoPath).size / 1024).toFixed(0);
  console.log(`Wired ${conceptId} → ${videoRel} (${kb} KB)`);
  console.log('Next: npm run validate-manifest && npm test');
}

main();
