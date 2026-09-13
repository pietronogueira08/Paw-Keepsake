import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const BREEDS_DIR = path.join(process.cwd(), 'public', 'breeds');
if (!fs.existsSync(BREEDS_DIR)) fs.mkdirSync(BREEDS_DIR, { recursive: true });

const rawFiles = fs.readdirSync('raw_breeds');

const BREED_MAP = [
  // 1. Coat Variations (19 options)
  { slug: 'dachshund-red', pattern: 'Watercolor_portrait_of_sitting_D' },
  { slug: 'dachshund-black-tan', pattern: 'Dachshund_portrait_sitting_peace' },
  { slug: 'doberman-black-rust', pattern: 'Doberman_Pinscher_portrait_sitti' },
  { slug: 'doberman-red-rust', pattern: 'Doberman_Pinscher_sitting_peacef.*_2\\.jpeg' },
  { slug: 'siberian-husky-black-white', pattern: 'Siberian_Husky_portrait_sitting_.*_2\\.jpeg' },
  { slug: 'siberian-husky-copper-red', pattern: 'Siberian_Husky_portrait_sitting_.*(?<!_2)\\.jpeg' },
  { slug: 'labrador-yellow', pattern: 'Labrador_Retriever_sitting_peace.*_2\\.jpeg' },
  { slug: 'labrador-chocolate', pattern: 'Labrador_Retriever_portrait_pain' },
  { slug: 'labrador-black', pattern: 'Labrador_Retriever_sitting_peace.*_3\\.jpeg' },
  { slug: 'french-bulldog-fawn', pattern: 'French_Bulldog_portrait_sitting' },
  { slug: 'french-bulldog-brindle', pattern: 'French_Bulldog_sitting_peacefull' },
  { slug: 'poodle-white', pattern: 'Standard_Poodle_sitting_peaceful.*(?<!_2)\\.jpeg' },
  { slug: 'poodle-apricot', pattern: 'Standard_Poodle_portrait_sitting' },
  { slug: 'german-shepherd-black-tan', pattern: 'German_Shepherd_portrait_2026' },
  { slug: 'german-shepherd-all-black', pattern: 'German_Shepherd_portrait_waterco' },
  { slug: 'border-collie-black-white', pattern: 'Border_Collie_portrait_2026' },
  { slug: 'border-collie-blue-merle', pattern: 'Border_Collie_sitting_peacefully' },
  { slug: 'pembroke-welsh-corgi-red', pattern: 'Pembroke_Welsh_Corgi_sitting_pea.*(?<!_2|_3)\\.jpeg' },
  { slug: 'pembroke-welsh-corgi-tricolor', pattern: 'Pembroke_Welsh_Corgi_sitting_pea.*_3\\.jpeg' },

  // 2. Standard / Single Color (21 options)
  { slug: 'golden-retriever', pattern: 'Golden_Retriever_portrait_waterc' },
  { slug: 'bulldog', pattern: 'English_Bulldog_portrait_sitting' },
  { slug: 'beagle', pattern: 'Beagle_portrait_painting' },
  { slug: 'rottweiler', pattern: 'Rottweiler_sitting_peacefully' },
  { slug: 'german-shorthaired-pointer', pattern: 'German_Shorthaired_Pointer_sitting' },
  { slug: 'australian-shepherd', pattern: 'Australian_Shepherd_watercolor' },
  { slug: 'yorkshire-terrier', pattern: 'Yorkshire_Terrier_sitting_peacef' },
  { slug: 'cavalier-king-charles-spaniel', pattern: 'Cavalier_King_Charles_Spaniel' },
  { slug: 'boxer', pattern: 'Boxer_dog_portrait_painting' },
  { slug: 'great-dane', pattern: 'Great_Dane_portrait_sitting' },
  { slug: 'miniature-schnauzer', pattern: 'Miniature_Schnauzer_portrait' },
  { slug: 'shih-tzu', pattern: 'Shih_Tzu_portrait_painting' },
  { slug: 'boston-terrier', pattern: 'Boston_Terrier_portrait_sitting' },
  { slug: 'bernese-mountain-dog', pattern: 'Bernese_Mountain_Dog_sitting' },
  { slug: 'pomeranian', pattern: 'Pomeranian_portrait_watercolor' },
  { slug: 'havanese', pattern: 'Havanese_dog_watercolor_portrait' },
  { slug: 'shetland-sheepdog', pattern: 'Shetland_Sheepdog_sitting_peacef' },
  { slug: 'maltese', pattern: 'Maltese_dog_portrait' },
  { slug: 'weimaraner', pattern: 'Weimaraner_sitting_peacefully' },
  { slug: 'irish-setter', pattern: 'Irish_Setter_sitting_peacefully' },
  { slug: 'vizsla', pattern: 'Vizsla_sitting_portrait_watercolor' },

  // 3. Lulu (Lhasa Apso)
  { slug: 'lhasa-apso', directFile: 'Lulu, Lhasa Apso.jpeg' },
];

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

async function processSingleBreed(inputPath, outputPath) {
  const { data, info } = await sharp(inputPath).raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H, channels } = info;

  // 1. Measure paper background color from corners (10x10 patch each)
  let sumR = 0, sumG = 0, sumB = 0, count = 0;
  const cornerOffsets = [
    [4, 4], [W - 14, 4], [4, H - 14], [W - 14, H - 14]
  ];
  for (const [cx, cy] of cornerOffsets) {
    for (let dy = 0; dy < 10; dy++) {
      for (let dx = 0; dx < 10; dx++) {
        const idx = ((cy + dy) * W + (cx + dx)) * channels;
        sumR += data[idx]; sumG += data[idx+1]; sumB += data[idx+2];
        count++;
      }
    }
  }
  const pr = sumR / count, pg = sumG / count, pb = sumB / count;

  let maxVar = 0;
  for (const [cx, cy] of cornerOffsets) {
    for (let dy = 0; dy < 10; dy++) {
      for (let dx = 0; dx < 10; dx++) {
        const idx = ((cy + dy) * W + (cx + dx)) * channels;
        const d = Math.sqrt((data[idx]-pr)**2 + (data[idx+1]-pg)**2 + (data[idx+2]-pb)**2);
        if (d > maxVar) maxVar = d;
      }
    }
  }

  const paperThreshold = Math.min(16, Math.max(10, Math.round(maxVar + 4)));

  // 2. Compute pigment distance
  const dist = new Float32Array(W * H);
  const isPigment = new Uint8Array(W * H);
  for (let i = 0; i < W * H; i++) {
    const r = data[i*channels], g = data[i*channels+1], b = data[i*channels+2];
    const d = Math.sqrt((r-pr)**2 + (g-pg)**2 + (b-pb)**2);
    dist[i] = d;
    if (d > paperThreshold) isPigment[i] = 1;
  }

  // 3. Connected components on isPigment
  const labels = new Int32Array(W * H);
  let curLabel = 1;
  const compSizes = [0];
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const idx = y * W + x;
      if (isPigment[idx] && labels[idx] === 0) {
        const label = curLabel++;
        let size = 0;
        const q = [x, y];
        labels[idx] = label;
        let qh = 0;
        while (qh < q.length) {
          const qx = q[qh++];
          const qy = q[qh++];
          size++;
          for (const [dx, dy] of [[-1,0], [1,0], [0,-1], [0,1]]) {
            const nx = qx + dx, ny = qy + dy;
            if (nx >= 0 && nx < W && ny >= 0 && ny < H) {
              const nIdx = ny * W + nx;
              if (isPigment[nIdx] && labels[nIdx] === 0) {
                labels[nIdx] = label;
                q.push(nx, ny);
              }
            }
          }
        }
        compSizes.push(size);
      }
    }
  }

  // Largest component is dog body
  let maxComp = 1, maxSize = 0;
  for (let i = 1; i < compSizes.length; i++) {
    if (compSizes[i] > maxSize) {
      maxSize = compSizes[i];
      maxComp = i;
    }
  }

  const dogCore = new Uint8Array(W * H);
  for (let i = 0; i < W * H; i++) {
    if (labels[i] === maxComp) dogCore[i] = 1;
  }

  // 4. Close dogCore to bridge hair gaps on crown of head (R=16)
  const R = 16;
  const temp = new Uint8Array(W * H);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      let hit = 0;
      for (let dx = -R; dx <= R; dx++) {
        const nx = x + dx;
        if (nx >= 0 && nx < W && dogCore[y * W + nx]) { hit = 1; break; }
      }
      temp[y * W + x] = hit;
    }
  }
  const dilatedDog = new Uint8Array(W * H);
  for (let x = 0; x < W; x++) {
    for (let y = 0; y < H; y++) {
      let hit = 0;
      for (let dy = -R; dy <= R; dy++) {
        const ny = y + dy;
        if (ny >= 0 && ny < H && temp[ny * W + x]) { hit = 1; break; }
      }
      dilatedDog[y * W + x] = hit;
    }
  }

  // Flood fill outer background around dilated dog
  const outerAroundDog = new Uint8Array(W * H);
  const q = [];
  for (let x = 0; x < W; x++) {
    if (!dilatedDog[x]) { outerAroundDog[x] = 1; q.push(x, 0); }
    if (!dilatedDog[(H-1)*W + x]) { outerAroundDog[(H-1)*W + x] = 1; q.push(x, H-1); }
  }
  for (let y = 0; y < H; y++) {
    if (!dilatedDog[y*W]) { outerAroundDog[y*W] = 1; q.push(0, y); }
    if (!dilatedDog[y*W + W-1]) { outerAroundDog[y*W + W-1] = 1; q.push(W-1, y); }
  }
  let qh = 0;
  while (qh < q.length) {
    const cx = q[qh++];
    const cy = q[qh++];
    for (const [dx, dy] of [[-1,0], [1,0], [0,-1], [0,1]]) {
      const nx = cx + dx, ny = cy + dy;
      if (nx >= 0 && nx < W && ny >= 0 && ny < H) {
        const nIdx = ny * W + nx;
        if (!outerAroundDog[nIdx] && !dilatedDog[nIdx]) {
          outerAroundDog[nIdx] = 1;
          q.push(nx, ny);
        }
      }
    }
  }

  // Distance from outerAroundDog
  const distFromOuter = new Int32Array(W * H).fill(9999);
  const bq = [];
  for (let i = 0; i < W * H; i++) {
    if (outerAroundDog[i]) {
      distFromOuter[i] = 0;
      bq.push(i % W, Math.floor(i / W));
    }
  }
  let bqh = 0;
  while (bqh < bq.length) {
    const cx = bq[bqh++];
    const cy = bq[bqh++];
    const cd = distFromOuter[cy * W + cx];
    if (cd >= 24) continue;
    for (const [dx, dy] of [[-1,0], [1,0], [0,-1], [0,1]]) {
      const nx = cx + dx, ny = cy + dy;
      if (nx >= 0 && nx < W && ny >= 0 && ny < H) {
        const nIdx = ny * W + nx;
        if (distFromOuter[nIdx] > cd + 1) {
          distFromOuter[nIdx] = cd + 1;
          bq.push(nx, ny);
        }
      }
    }
  }

  // Distance from main dogCore for splash preservation
  const distFromDog = new Int32Array(W * H).fill(9999);
  const dq = [];
  for (let i = 0; i < W * H; i++) {
    if (dogCore[i]) {
      distFromDog[i] = 0;
      dq.push(i % W, Math.floor(i / W));
    }
  }
  let dqh = 0;
  while (dqh < dq.length) {
    const cx = dq[dqh++];
    const cy = dq[dqh++];
    const cd = distFromDog[cy * W + cx];
    if (cd >= 60) continue;
    for (const [dx, dy] of [[-1,0], [1,0], [0,-1], [0,1]]) {
      const nx = cx + dx, ny = cy + dy;
      if (nx >= 0 && nx < W && ny >= 0 && ny < H) {
        const nIdx = ny * W + nx;
        if (distFromDog[nIdx] > cd + 1) {
          distFromDog[nIdx] = cd + 1;
          dq.push(nx, ny);
        }
      }
    }
  }

  // 5. Alpha calculation:
  // - Internal white fur and body: 100% solid (alpha = 255)
  // - Outer fur transition: smooth fade
  // - Nearby watercolor splashes: preserved
  // - Outer background paper: 100% transparent (alpha = 0)
  const alpha = new Uint8Array(W * H);
  for (let i = 0; i < W * H; i++) {
    const d = dist[i];
    const df = distFromOuter[i];
    const dd = distFromDog[i];
    const lbl = labels[i];
    const cSize = lbl > 0 ? compSizes[lbl] : 0;

    if (df > 18) {
      // Solid interior (head crest, forehead, chest, face)
      alpha[i] = 255;
    } else if (dogCore[i]) {
      // Dog body
      alpha[i] = 255;
    } else if (dd <= 50 && cSize >= 8 && d > paperThreshold) {
      // Authentic splashes
      alpha[i] = Math.min(255, Math.round(((d - paperThreshold) / 8) * 255));
    } else if (d > paperThreshold + 2 && df > 5) {
      // Outer fur boundary
      alpha[i] = Math.min(255, Math.round(((d - (paperThreshold + 2)) / 8) * 255));
    } else {
      alpha[i] = 0;
    }
  }

  // 6. Smooth anti-alias boundary feathering
  const feathered = new Uint8Array(W * H);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const idx = y * W + x;
      const a = alpha[idx];
      if (a === 0 || a === 255) {
        let nSum = 0, nCount = 0;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const nx = x + dx, ny = y + dy;
            if (nx >= 0 && nx < W && ny >= 0 && ny < H) {
              nSum += alpha[ny * W + nx];
              nCount++;
            }
          }
        }
        const avg = nSum / nCount;
        if (a === 255 && avg < 250) feathered[idx] = Math.round(avg);
        else if (a === 0 && avg > 10) feathered[idx] = Math.round(avg * 0.4);
        else feathered[idx] = a;
      } else {
        feathered[idx] = a;
      }
    }
  }

  // 7. Output to transparent WebP (1024x1024)
  const rgba = Buffer.alloc(W * H * 4);
  for (let i = 0; i < W * H; i++) {
    rgba[i*4] = data[i*channels];
    rgba[i*4+1] = data[i*channels+1];
    rgba[i*4+2] = data[i*channels+2];
    rgba[i*4+3] = feathered[i];
  }

  await sharp(rgba, { raw: { width: W, height: H, channels: 4 } })
    .resize(1024, 1024, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .webp({ quality: 92, alphaQuality: 100, effort: 4 })
    .toFile(outputPath);
}

async function main() {
  console.log(`🐾 Processing ${BREED_MAP.length} breed watercolor portraits with smart white-fur preservation...`);

  let count = 0;
  for (const item of BREED_MAP) {
    let inputPath;
    if (item.directFile) {
      inputPath = item.directFile;
    } else {
      const reg = new RegExp(item.pattern, 'i');
      const match = rawFiles.find(f => reg.test(f));
      if (!match) {
        console.error(`❌ Missing raw file for ${item.slug} (pattern: ${item.pattern})`);
        continue;
      }
      inputPath = path.join('raw_breeds', match);
    }

    const outputPath = path.join(BREEDS_DIR, `${item.slug}.webp`);
    try {
      await processSingleBreed(inputPath, outputPath);
      count++;
      console.log(`[${count}/${BREED_MAP.length}] ✅ ${item.slug}.webp created from ${path.basename(inputPath)}`);
    } catch (err) {
      console.error(`❌ Error on ${item.slug}:`, err.message);
    }
  }

  console.log('\n🔗 Linking aliases...');
  for (const [alias, targetFile] of Object.entries(ALIASES)) {
    const src = path.join(BREEDS_DIR, targetFile);
    const dest = path.join(BREEDS_DIR, `${alias}.webp`);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
      console.log(`   Linked ${alias}.webp -> ${targetFile}`);
    }
  }

  console.log('\n🎉 ALL DONE! All breeds successfully reprocessed with solid white fur and transparent background!');
}

main().catch(console.error);
