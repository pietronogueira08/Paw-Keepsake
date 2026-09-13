import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function createMontage() {
  const inDir = 'C:/Users/pietr/.gemini/antigravity/brain/844864bd-fabf-4fa4-a746-258d50934da7/all-on-black';
  const files = fs.readdirSync(inDir).filter(f => f.endsWith('.png'));

  const cols = 5;
  const rows = Math.ceil(files.length / cols);
  const cellW = 160;
  const cellH = 180;
  const totalW = cols * cellW;
  const totalH = rows * cellH;

  const canvas = await sharp({
    create: { width: totalW, height: totalH, channels: 4, background: { r: 24, g: 24, b: 24, alpha: 1 } }
  }).png().toBuffer();

  const composites = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const col = i % cols;
    const row = Math.floor(i / cols);
    const left = col * cellW;
    const top = row * cellH;

    const imgBuf = await sharp(path.join(inDir, file))
      .resize(140, 140, { fit: 'contain' })
      .png()
      .toBuffer();

    composites.push({
      input: imgBuf,
      left: left + 10,
      top: top + 5
    });

    const label = file.replace('.png', '').slice(0, 20);
    const svgLabel = Buffer.from(
      '<svg width=\"' + cellW + '\" height=\"30\">' +
        '<text x=\"' + (cellW/2) + '\" y=\"20\" fill=\"#B88A58\" font-size=\"10\" font-family=\"sans-serif\" text-anchor=\"middle\">' + label + '</text>' +
      '</svg>'
    );
    composites.push({
      input: svgLabel,
      left: left,
      top: top + 145
    });
  }

  await sharp(canvas)
    .composite(composites)
    .jpeg({ quality: 85 })
    .toFile('C:/Users/pietr/.gemini/antigravity/brain/844864bd-fabf-4fa4-a746-258d50934da7/all-breeds-montage.jpg');

  console.log('Montage created: all-breeds-montage.jpg');
}
createMontage().catch(console.error);
