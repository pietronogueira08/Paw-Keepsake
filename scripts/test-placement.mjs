import sharp from 'sharp';
import path from 'path';

async function testPlacement() {
  const w = 400, h = 500;
  // Let's test 3 scaling tiers for all 4 sizes:
  // Set 1 (Current): 8x12=75x112, 12x16=100x133, 16x20=135x169, 16x24=155x232
  // Set 2 (Moderate reduction ~20%): 8x12=60x90, 12x16=80x107, 16x20=108x135, 16x24=124x186
  // Set 3 (Photorealistic ~35% reduction): 8x12=50x75, 12x16=66x88, 16x20=90x112, 16x24=100x150

  const sets = {
    'opt-moderate': [
      { name: '8x12', w: 60, h: 90, top: 0.35, imgH: 46, nameSize: 7.5, dateSize: 5.5, pad: 4 },
      { name: '12x16', w: 80, h: 107, top: 0.33, imgH: 58, nameSize: 8.5, dateSize: 6, pad: 5 },
      { name: '16x20', w: 108, h: 135, top: 0.31, imgH: 74, nameSize: 10, dateSize: 7, pad: 6 },
      { name: '16x24', w: 124, h: 186, top: 0.31, imgH: 104, nameSize: 11, dateSize: 8, pad: 7 },
    ],
    'opt-realistic': [
      { name: '8x12', w: 50, h: 75, top: 0.36, imgH: 38, nameSize: 6.5, dateSize: 5, pad: 3 },
      { name: '12x16', w: 66, h: 88, top: 0.35, imgH: 48, nameSize: 7.5, dateSize: 5.5, pad: 4 },
      { name: '16x20', w: 90, h: 112, top: 0.33, imgH: 62, nameSize: 9, dateSize: 6.5, pad: 5 },
      { name: '16x24', w: 102, h: 153, top: 0.33, imgH: 84, nameSize: 10, dateSize: 7, pad: 6 },
    ],
  };

  for (const [setName, configs] of Object.entries(sets)) {
    for (const c of configs) {
      const cx = 0.67 * w;
      const cy = c.top * h;
      const x1 = Math.round(cx - c.w / 2);
      const y1 = Math.round(cy - c.h / 2);

      // SVG with drop shadow and typography
      const svg = Buffer.from(
        `<svg width="${w}" height="${h}">
          <defs>
            <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="12" stdDeviation="8" flood-color="rgba(0,0,0,0.40)" />
              <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="rgba(0,0,0,0.25)" />
            </filter>
          </defs>
          <rect x="${x1}" y="${y1}" width="${c.w}" height="${c.h}" rx="2" fill="#FAF7F0" filter="url(#shadow)" stroke="rgba(0,0,0,0.06)" />
          <rect x="${x1 + c.w - 3}" y="${y1}" width="3" height="${c.h}" fill="rgba(0,0,0,0.18)" />
          <text x="${cx}" y="${y1 + c.h - c.pad - 12}" text-anchor="middle" fill="#242424" font-size="${c.nameSize}" font-family="Georgia, serif" font-weight="bold">Cooper</text>
          <text x="${cx}" y="${y1 + c.h - c.pad - 4}" text-anchor="middle" fill="#736E65" font-size="${c.dateSize}" font-style="italic" font-family="Georgia, serif">2014 — 2025</text>
        </svg>`
      );

      // Resize dog image to composite
      const dogBuffer = await sharp(path.join(process.cwd(), 'public', 'breeds', 'golden-retriever.webp'))
        .resize({ height: c.imgH, fit: 'inside' })
        .toBuffer();

      const dogMeta = await sharp(dogBuffer).metadata();
      const dogLeft = Math.round(cx - (dogMeta.width || 40) / 2);
      const dogTop = Math.round(y1 + c.pad + 3);

      await sharp(path.join(process.cwd(), 'public', 'images', 'room-background.webp'))
        .resize(w, h, { fit: 'cover' })
        .composite([
          { input: svg },
          { input: dogBuffer, left: dogLeft, top: dogTop }
        ])
        .toFile(`C:/Users/pietr/.gemini/antigravity/brain/844864bd-fabf-4fa4-a746-258d50934da7/${setName}-${c.name}.jpg`);
      console.log(`Saved ${setName}-${c.name}.jpg`);
    }
  }
}
testPlacement();
