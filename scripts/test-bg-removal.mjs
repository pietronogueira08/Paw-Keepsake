import sharp from 'sharp';
import fs from 'fs';

/**
 * High-quality background remover tailored for watercolor illustrations on light paper:
 * Uses boundary flood-fill with color tolerance, keeping the dog's internal white highlights intact,
 * and feathering the edge so watercolor transitions are smooth.
 */
async function removeWatercolorBackground(inputPath, outputPath) {
  const image = sharp(inputPath);
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  // Create alpha channel buffer
  // 0 = transparent, 255 = opaque
  const alpha = new Uint8Array(width * height);
  alpha.fill(255);

  // Visited array for BFS flood fill
  const visited = new Uint8Array(width * height);
  const queue = [];

  // Helper to get pixel index
  const getIdx = (x, y) => y * width + x;

  // Check if pixel is "paper background"
  // Paper background is very bright and very low saturation
  function isPaper(x, y) {
    const pIdx = (y * width + x) * channels;
    const r = data[pIdx];
    const g = data[pIdx + 1];
    const b = data[pIdx + 2];

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const saturation = max === 0 ? 0 : (max - min) / max;
    const brightness = (r + g + b) / 3;

    // Paper criteria: brightness > 238 and saturation < 0.12
    // Or extremely bright > 248
    return brightness > 248 || (brightness > 236 && saturation < 0.08);
  }

  // Seed boundary pixels (top, bottom, left, right edges)
  for (let x = 0; x < width; x++) {
    if (isPaper(x, 0)) {
      const idx = getIdx(x, 0);
      visited[idx] = 1;
      queue.push(x, 0);
    }
    if (isPaper(x, height - 1)) {
      const idx = getIdx(x, height - 1);
      visited[idx] = 1;
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

  // BFS flood fill from outside inward
  let head = 0;
  const neighbors = [
    [-1, 0], [1, 0], [0, -1], [0, 1]
  ];

  while (head < queue.length) {
    const cx = queue[head++];
    const cy = queue[head++];
    const cIdx = getIdx(cx, cy);

    // This is confirmed background
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
            // Near-boundary transition: soft alpha feather
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

  // Build RGBA output
  const rgba = Buffer.alloc(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    rgba[i * 4] = data[i * channels];
    rgba[i * 4 + 1] = data[i * channels + 1];
    rgba[i * 4 + 2] = data[i * channels + 2];
    rgba[i * 4 + 3] = alpha[i];
  }

  await sharp(rgba, { raw: { width, height, channels: 4 } })
    .webp({ quality: 90, alphaQuality: 95, lossless: false })
    .toFile(outputPath);

  console.log(`Saved transparent webp: ${outputPath}`);
}

async function run() {
  await removeWatercolorBackground(
    'extracted_breeds/Golden_Retriever_portrait_waterc…_20260912220151.jpeg',
    'test-golden.webp'
  );
  await removeWatercolorBackground(
    'extracted_breeds/Maltese_dog_portrait_20260912220151.jpeg',
    'test-maltese.webp'
  );
}

run();
