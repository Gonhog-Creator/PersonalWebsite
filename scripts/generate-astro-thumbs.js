/**
 * Generates sized derivatives for astrophotography images.
 *
 *   public/img/Astro/thumbs/<name>  - max 1200px wide, JPEG q78 (grid cards / masonry)
 *   public/img/Astro/medium/<name>  - max 2560px wide, JPEG q85 (detail view / lightbox)
 *
 * The site serves images unoptimized (see next.config.js), so every <Image>
 * downloads the full file. These derivatives keep grids fast and prevent
 * mobile browsers from running out of memory decoding 50MP+ originals.
 *
 * Re-run after adding new photos: node scripts/generate-astro-thumbs.js
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const SRC_DIR = path.join(__dirname, '..', 'public', 'img', 'Astro');
const TIERS = [
  { dir: 'thumbs', width: 1200, quality: 78 },
  { dir: 'medium', width: 2560, quality: 85 },
];

async function needsBuild(src, dest) {
  try {
    const s = fs.statSync(src);
    const d = fs.statSync(dest);
    return d.mtimeMs < s.mtimeMs;
  } catch {
    return true; // dest missing
  }
}

async function main() {
  const files = fs
    .readdirSync(SRC_DIR)
    .filter(f => /\.(jpe?g|png)$/i.test(f) && fs.statSync(path.join(SRC_DIR, f)).isFile());

  let built = 0;
  let skipped = 0;

  for (const tier of TIERS) {
    const outDir = path.join(SRC_DIR, tier.dir);
    fs.mkdirSync(outDir, { recursive: true });

    for (const file of files) {
      const src = path.join(SRC_DIR, file);
      const dest = path.join(outDir, file.replace(/\.png$/i, '.jpg'));

      if (!(await needsBuild(src, dest))) {
        skipped++;
        continue;
      }

      await sharp(src)
        .rotate() // respect EXIF orientation
        .resize({ width: tier.width, withoutEnlargement: true })
        .jpeg({ quality: tier.quality, mozjpeg: true })
        .toFile(dest);
      built++;
      console.log(`[${tier.dir}] ${file}`);
    }
  }

  console.log(`Done. ${built} generated, ${skipped} up-to-date.`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
