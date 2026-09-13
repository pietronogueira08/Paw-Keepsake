import sharp from 'sharp';
import path from 'path';

async function testPlacement() {
  const w = 400, h = 500;
  const scales = [
    { name: '8x12', scale: 0.72 },
    { name: '12x16', scale: 0.86 },
    { name: '16x20', scale: 0.98 },
    { name: '16x24', scale: 1.12 }
  ];

  for (const s of scales) {
    const cw = 124 * s.scale;
    const ch = 166 * s.scale;
    const cx = 0.67 * w;
    const cy = 0.25 * h;
    const x1 = cx - cw / 2;
    const y1 = cy - ch / 2;

    const svg = Buffer.from(
      '<svg width=\"' + w + '\" height=\"' + h + '\">' +
        '<rect x=\"' + x1 + '\" y=\"' + y1 + '\" width=\"' + cw + '\" height=\"' + ch + '\" fill=\"rgba(255, 255, 255, 0.9)\" stroke=\"#B88A58\" stroke-width=\"2\" rx=\"2\" />' +
        '<text x=\"' + cx + '\" y=\"' + cy + '\" text-anchor=\"middle\" fill=\"#242424\" font-size=\"12\" font-family=\"sans-serif\" font-weight=\"bold\">' + s.name + '</text>' +
      '</svg>'
    );

    await sharp(path.join(process.cwd(), 'public', 'images', 'room-background.webp'))
      .resize(w, h, { fit: 'cover' })
      .composite([{ input: svg }])
      .toFile('C:/Users/pietr/.gemini/antigravity/brain/844864bd-fabf-4fa4-a746-258d50934da7/test-' + s.name + '.jpg');
    console.log('Generated test-' + s.name + '.jpg: x1=' + x1.toFixed(1) + ', y1=' + y1.toFixed(1) + ', x2=' + (x1+cw).toFixed(1) + ', y2=' + (y1+ch).toFixed(1));
  }
}
testPlacement();
