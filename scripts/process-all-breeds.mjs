import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

// Output directories
const BREEDS_DIR = path.join(process.cwd(), 'public', 'breeds');
const IMAGES_DIR = path.join(process.cwd(), 'public', 'images');

if (!fs.existsSync(BREEDS_DIR)) fs.mkdirSync(BREEDS_DIR, { recursive: true });
if (!fs.existsSync(IMAGES_DIR)) fs.mkdirSync(IMAGES_DIR, { recursive: true });

/**
 * High-quality watercolor background removal:
 * Performs boundary flood-fill with color tolerance, keeping internal white fur intact,
 * and softly feathering transitions into transparent WebP.
 */
async function processWatercolor(inputPath, outputPath) {
  const image = sharp(inputPath);
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  const alpha = new Uint8Array(width * height);
  alpha.fill(255);

  const visited = new Uint8Array(width * height);
  const queue = [];

  const getIdx = (x, y) => y * width + x;

  function isPaper(x, y) {
    const pIdx = (y * width + x) * channels;
    const r = data[pIdx];
    const g = data[pIdx + 1];
    const b = data[pIdx + 2];

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const saturation = max === 0 ? 0 : (max - min) / max;
    const brightness = (r + g + b) / 3;

    // Paper background is very bright with very low saturation
    return brightness > 248 || (brightness > 236 && saturation < 0.08);
  }

  // Seed boundary pixels
  for (let x = 0; x < width; x++) {
    if (isPaper(x, 0)) {
      visited[getIdx(x, 0)] = 1;
      queue.push(x, 0);
    }
    if (isPaper(x, height - 1)) {
      visited[getIdx(x, height - 1)] = 1;
      queue.push(x, height - 1);
    }
  }

  for (let y = 0; y < height; y++) {
    if (isPaper(0, y)) {
      const idx = getIdx(0, y);
      if (!visited[idx]) {
        visited[idx] = 1;
        queue.push(0, y);
      }
    }
    if (isPaper(width - 1, y)) {
      const idx = getIdx(width - 1, y);
      if (!visited[idx]) {
        visited[idx] = 1;
        queue.push(width - 1, y);
      }
    }
  }

  let head = 0;
  const neighbors = [[-1, 0], [1, 0], [0, -1], [0, 1]];

  while (head < queue.length) {
    const cx = queue[head++];
    const cy = queue[head++];
    const cIdx = getIdx(cx, cy);

    alpha[cIdx] = 0;

    for (let i = 0; i < 4; i++) {
      const nx = cx + neighbors[i][0];
      const ny = cy + neighbors[i][1];

      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        const nIdx = getIdx(nx, ny);
        if (!visited[nIdx]) {
          visited[nIdx] = 1;
          if (isPaper(nx, ny)) {
            queue.push(nx, ny);
          } else {
            // Soft transition on boundary
            const pIdx = (ny * width + nx) * channels;
            const r = data[pIdx];
            const g = data[pIdx + 1];
            const b = data[pIdx + 2];
            const brightness = (r + g + b) / 3;
            if (brightness > 230) {
              alpha[nIdx] = Math.max(0, Math.min(255, Math.round((255 - brightness) * 10)));
            }
          }
        }
      }
    }
  }

  const rgba = Buffer.alloc(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    rgba[i * 4] = data[i * channels];
    rgba[i * 4 + 1] = data[i * channels + 1];
    rgba[i * 4 + 2] = data[i * channels + 2];
    rgba[i * 4 + 3] = alpha[i];
  }

  await sharp(rgba, { raw: { width, height, channels: 4 } })
    .resize(1024, 1024, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .webp({ quality: 92, alphaQuality: 98, effort: 4 })
    .toFile(outputPath);
}

// ---------------------------------------------------------------------------
// Breed Mapping
// ---------------------------------------------------------------------------
const BREED_MAP = [
  // 1. Variações de Pelagem (19 opções)
  { slug: 'dachshund-red', file: 'Watercolor_portrait_of_sitting_D…_20260912220151.jpeg' },
  { slug: 'dachshund-black-tan', file: 'Dachshund_portrait_sitting_peace…_20260912220151.jpeg' },
  { slug: 'doberman-black-rust', file: 'Doberman_Pinscher_portrait_sitti…_20260912220151.jpeg' },
  { slug: 'doberman-red-rust', file: 'Doberman_Pinscher_sitting_peacef…_20260912220151.jpeg' },
  { slug: 'siberian-husky-black-white', file: 'Siberian_Husky_portrait_sitting_…_20260912220151_2.jpeg' },
  { slug: 'siberian-husky-copper-red', file: 'Siberian_Husky_portrait_sitting_…_20260912220151.jpeg' },
  { slug: 'labrador-yellow', file: 'Labrador_Retriever_sitting_peace…_20260912220151_2.jpeg' },
  { slug: 'labrador-chocolate', file: 'Labrador_Retriever_portrait_pain…_20260912220151.jpeg' },
  { slug: 'labrador-black', file: 'Labrador_Retriever_sitting_peace…_20260912220151_3.jpeg' },
  { slug: 'french-bulldog-fawn', file: 'French_Bulldog_portrait_sitting_…_20260912220150.jpeg' },
  { slug: 'french-bulldog-brindle', file: 'French_Bulldog_sitting_peacefull…_20260912220151.jpeg' },
  { slug: 'poodle-white', file: 'Standard_Poodle_sitting_peaceful…_20260912220151.jpeg' },
  { slug: 'poodle-apricot', file: 'Standard_Poodle_portrait_sitting…_20260912220151.jpeg' },
  { slug: 'german-shepherd-black-tan', file: 'German_Shepherd_portrait_20260912220151.jpeg' },
  { slug: 'german-shepherd-all-black', file: 'German_Shepherd_portrait_waterco…_20260912220151.jpeg' },
  { slug: 'border-collie-black-white', file: 'Border_Collie_portrait_20260912220151.jpeg' },
  { slug: 'border-collie-blue-merle', file: 'Border_Collie_sitting_peacefully_20260912220151.jpeg' },
  { slug: 'pembroke-welsh-corgi-red', file: 'Pembroke_Welsh_Corgi_sitting_pea…_20260912220151.jpeg' },
  { slug: 'pembroke-welsh-corgi-tricolor', file: 'Pembroke_Welsh_Corgi_sitting_pea…_20260912220151_3.jpeg' },

  // 2. Cor Padrão / Única (21 opções)
  { slug: 'golden-retriever', file: 'Golden_Retriever_portrait_waterc…_20260912220151.jpeg' },
  { slug: 'bulldog', file: 'English_Bulldog_portrait_sitting…_20260912220151.jpeg' },
  { slug: 'beagle', file: 'Beagle_portrait_painting_20260912220151.jpeg' },
  { slug: 'rottweiler', file: 'Rottweiler_sitting_peacefully_20260912220151.jpeg' },
  { slug: 'german-shorthaired-pointer', file: 'German_Shorthaired_Pointer_sitting_20260912220151.jpeg' },
  { slug: 'australian-shepherd', file: 'Australian_Shepherd_watercolor_p…_20260912220151.jpeg' },
  { slug: 'yorkshire-terrier', file: 'Yorkshire_Terrier_sitting_peacef…_20260912220151.jpeg' },
  { slug: 'cavalier-king-charles-spaniel', file: 'Cavalier_King_Charles_Spaniel_po…_20260912220151.jpeg' },
  { slug: 'boxer', file: 'Boxer_dog_portrait_painting_20260912220151.jpeg' },
  { slug: 'great-dane', file: 'Great_Dane_portrait_sitting_peac…_20260912220151.jpeg' },
  { slug: 'miniature-schnauzer', file: 'Miniature_Schnauzer_portrait_wat…_20260912220151.jpeg' },
  { slug: 'shih-tzu', file: 'Shih_Tzu_portrait_painting_20260912220151.jpeg' },
  { slug: 'boston-terrier', file: 'Boston_Terrier_portrait_sitting_20260912220151.jpeg' },
  { slug: 'bernese-mountain-dog', file: 'Bernese_Mountain_Dog_sitting_pea…_20260912220151.jpeg' },
  { slug: 'pomeranian', file: 'Pomeranian_portrait_watercolor_p…_20260912220151.jpeg' },
  { slug: 'havanese', file: 'Havanese_dog_watercolor_portrait…_20260912220151.jpeg' },
  { slug: 'shetland-sheepdog', file: 'Shetland_Sheepdog_sitting_peacef…_20260912220151.jpeg' },
  { slug: 'maltese', file: 'Maltese_dog_portrait_20260912220151.jpeg' },
  { slug: 'weimaraner', file: 'Weimaraner_sitting_peacefully_po…_20260912220151.jpeg' },
  { slug: 'irish-setter', file: 'Irish_Setter_sitting_peacefully_…_20260912220151.jpeg' },
  { slug: 'vizsla', file: 'Vizsla_sitting_portrait_watercolor_20260912220151.jpeg' },
];

// Fallback / standard aliases
const ALIASES = {
  'dachshund': 'dachshund-red.webp',
  'doberman-pinscher': 'doberman-black-rust.webp',
  'siberian-husky': 'siberian-husky-black-white.webp',
  'labrador-retriever': 'labrador-yellow.webp',
  'french-bulldog': 'french-bulldog-fawn.webp',
  'poodle': 'poodle-white.webp',
  'german-shepherd': 'german-shepherd-black-tan.webp',
  'border-collie': 'border-collie-black-white.webp',
  'pembroke-welsh-corgi': 'pembroke-welsh-corgi-red.webp',
};

async function main() {
  console.log('🖼️ 1. Processing Background Oficial.jpeg -> room-background.webp...');
  if (fs.existsSync('Background Oficial.jpeg')) {
    await sharp('Background Oficial.jpeg')
      .resize({ width: 1792, withoutEnlargement: true })
      .webp({ quality: 86, effort: 5 })
      .toFile(path.join(IMAGES_DIR, 'room-background.webp'));
    console.log('✅ Room background created: public/images/room-background.webp');
  } else {
    console.warn('⚠️ Background Oficial.jpeg not found!');
  }

  console.log('\n🐾 2. Processing all 40 breed watercolor portraits with background removal...');
  let count = 0;
  for (const item of BREED_MAP) {
    const inputPath = path.join('extracted_breeds', item.file);
    const outputPath = path.join(BREEDS_DIR, `${item.slug}.webp`);

    if (!fs.existsSync(inputPath)) {
      console.warn(`⚠️ Source file missing: ${item.file}`);
      continue;
    }

    await processWatercolor(inputPath, outputPath);
    count++;
    console.log(`[${count}/${BREED_MAP.length}] ✅ ${item.slug}.webp created`);
  }

  console.log('\n🔗 3. Creating standard aliases for primary slugs...');
  for (const [alias, targetFile] of Object.entries(ALIASES)) {
    const src = path.join(BREEDS_DIR, targetFile);
    const dest = path.join(BREEDS_DIR, `${alias}.webp`);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
      console.log(`   Linked ${alias}.webp -> ${targetFile}`);
    }
  }

  console.log('\n🎉 ALL DONE! 40 breeds + room background converted to WebP with transparent backgrounds!');
}

main().catch(err => {
  console.error('Fatal error processing images:', err);
  process.exit(1);
});
