import sharp from 'sharp';
import path from 'path';

async function run() {
  const w = 400, h = 500;
  let lines = '';
  for (let x = 10; x < 100; x += 10) {
    const px = (x / 100) * w;
    lines += '<line x1=\"' + px + '\" y1=\"0\" x2=\"' + px + '\" y2=\"' + h + '\" stroke=\"rgba(255,0,0,0.6)\" stroke-width=\"1\" />';
    lines += '<text x=\"' + (px + 2) + '\" y=\"15\" fill=\"red\" font-size=\"10\">' + x + '%</text>';
  }
  for (let y = 10; y < 100; y += 10) {
    const py = (y / 100) * h;
    lines += '<line x1=\"0\" y1=\"' + py + '\" x2=\"' + w + '\" y2=\"' + py + '\" stroke=\"rgba(0,0,255,0.6)\" stroke-width=\"1\" />';
    lines += '<text x=\"5\" y=\"' + (py - 2) + '\" fill=\"blue\" font-size=\"10\">' + y + '%</text>';
  }
  const svg = Buffer.from('<svg width=\"' + w + '\" height=\"' + h + '\">' + lines + '</svg>');

  await sharp(path.join(process.cwd(), 'public', 'images', 'room-background.webp'))
    .resize(w, h, { fit: 'cover' })
    .composite([{ input: svg }])
    .toFile('C:/Users/pietr/.gemini/antigravity/brain/844864bd-fabf-4fa4-a746-258d50934da7/grid-test.jpg');
  console.log('Saved grid-test.jpg');
}
run();
