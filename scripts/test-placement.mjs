import sharp from 'sharp';
import path from 'path';

async function testPlacement() {
  const w = 400, h = 500;
  const configs = [
    {
      name: '8x12',
      w: 75,
      h: 112,
      top: 0.32,
      imgH: 56,
      nameSize: 8,
      dateSize: 6,
      quoteSize: 5.5,
      pad: 4,
    },
    {
      name: '12x16',
      w: 100,
      h: 133,
      top: 0.30,
      imgH: 74,
      nameSize: 9.5,
      dateSize: 7,
      quoteSize: 6,
      pad: 6,
    },
    {
      name: '16x20',
      w: 135,
      h: 169,
      top: 0.28,
      imgH: 96,
      nameSize: 11,
      dateSize: 8,
      quoteSize: 7,
      pad: 8,
    },
    {
      name: '16x24',
      w: 155,
      h: 232,
      top: 0.28,
      imgH: 136,
      nameSize: 12.5,
      dateSize: 9,
      quoteSize: 7.5,
      pad: 10,
    },
  ];

  for (const c of configs) {
    const cx = 0.67 * w;
    const cy = c.top * h;
    const x1 = cx - c.w / 2;
    const y1 = cy - c.h / 2;

    // Load dog image and resize
    const dogImgBuffer = await sharp(path.join(process.cwd(), 'public', 'breeds', 'golden-retriever.webp'))
      .resize({ height: c.imgH, fit: 'inside' })
      .toBuffer();

    const dogBase64 = `data:image/webp;base64,${dogImgBuffer.toString('base64')}`;

    const svg = Buffer.from(
      `<svg width="${w}" height="${h}">
        <defs>
          <filter id="shadow-${c.name}" x="-20%" y="-20%" width="150%" height="150%">
            <feDropShadow dx="0" dy="16" stdDeviation="12" flood-color="rgba(0,0,0,0.45)" />
            <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="rgba(0,0,0,0.3)" />
          </filter>
        </defs>
        <!-- Canvas Frame -->
        <rect x="${x1}" y="${y1}" width="${c.w}" height="${c.h}" rx="2" fill="#FAF7F0" filter="url(#shadow-${c.name})" stroke="rgba(0,0,0,0.06)" />
        <rect x="${x1 + c.w - 3}" y="${y1}" width="3" height="${c.h}" fill="rgba(0,0,0,0.18)" />
        
        <!-- Artwork image -->
        <image href="${dogBase64}" x="${cx - (c.w * 0.8) / 2}" y="${y1 + c.pad + 2}" width="${c.w * 0.8}" height="${c.imgH}" preserveAspectRatio="xMidYMid meet" />
        
        <!-- Typography -->
        <text x="${cx}" y="${y1 + c.h - c.pad - 16}" text-anchor="middle" fill="#242424" font-size="${c.nameSize}" font-family="Georgia, serif" font-weight="bold">Cooper</text>
        <text x="${cx}" y="${y1 + c.h - c.pad - 8}" text-anchor="middle" fill="#736E65" font-size="${c.dateSize}" font-style="italic" font-family="Georgia, serif">2014 — 2025</text>
        <text x="${cx}" y="${y1 + c.h - c.pad}" text-anchor="middle" fill="#615B52" font-size="${c.quoteSize}" font-style="italic" font-family="Georgia, serif">“Forever in our hearts”</text>
      </svg>`
    );

    await sharp(path.join(process.cwd(), 'public', 'images', 'room-background.webp'))
      .resize(w, h, { fit: 'cover' })
      .composite([{ input: svg }])
      .toFile(`C:/Users/pietr/.gemini/antigravity/brain/844864bd-fabf-4fa4-a746-258d50934da7/test-full-${c.name}.jpg`);
    console.log(`Rendered test-full-${c.name}.jpg (y1=${y1.toFixed(1)}, y2=${(y1 + c.h).toFixed(1)})`);
  }
}
testPlacement();
