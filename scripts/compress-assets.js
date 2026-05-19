const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const IMAGE_ROOT = path.join(ROOT, 'assets/images');

/** Directories to scan recursively for PNGs (relative to assets/images). */
const SCAN_DIRS = ['concepts', 'explainers', 'pathways', 'ui'];

async function compressPng(filePath) {
  const originalSize = fs.statSync(filePath).size;
  const buffer = fs.readFileSync(filePath);
  const outputBuffer = await sharp(buffer)
    .png({ quality: 65, compressionLevel: 9, palette: true })
    .toBuffer();

  if (outputBuffer.length < originalSize) {
    fs.writeFileSync(filePath, outputBuffer);
    return { saved: originalSize - outputBuffer.length, originalSize, newSize: outputBuffer.length };
  }
  return { saved: 0, originalSize, newSize: originalSize };
}

function collectPngs(dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectPngs(full));
    } else if (entry.name.endsWith('.png') && !entry.name.includes('-pilot-')) {
      // Skip pilot comparison files — not wired in app
      results.push(full);
    }
  }
  return results;
}

(async () => {
  let totalSaved = 0;
  let processed = 0;
  console.log('Starting compression...');

  for (const sub of SCAN_DIRS) {
    const dirPath = path.join(IMAGE_ROOT, sub);
    const files = collectPngs(dirPath);
    if (!files.length) continue;

    console.log(`Processing ${sub}/ (${files.length} PNGs)...`);

    for (const filePath of files) {
      const rel = path.relative(ROOT, filePath);
      try {
        const { saved, originalSize, newSize } = await compressPng(filePath);
        processed += 1;
        if (saved > 0) {
          totalSaved += saved;
          console.log(
            `  ✓ ${rel}: ${(originalSize / 1024).toFixed(1)}KB -> ${(newSize / 1024).toFixed(1)}KB`
          );
        } else {
          console.log(`  - ${rel}: No reduction`);
        }
      } catch (err) {
        console.error(`  ✗ ${rel}: ${err.message}`);
      }
    }
  }

  console.log(`\nProcessed ${processed} files. Total saved: ${(totalSaved / 1024 / 1024).toFixed(2)} MB`);
})();
