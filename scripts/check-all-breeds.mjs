import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function generateAllOnBlack() {
  const breedsDir = path.join(process.cwd(), 'public', 'breeds');
  const outDir = 'C:/Users/pietr/.gemini/antigravity/brain/844864bd-fabf-4fa4-a746-258d50934da7/all-on-black';
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const files = fs.readdirSync(breedsDir).filter(f => f.endsWith('.webp'));
  console.log('Testing', files.length, 'breed images on black...');

  const bg = await sharp({
    create: { width: 300, height: 300, channels: 4, background: { r: 36, g: 36, b: 36, alpha: 1 } }
  }).png().toBuffer();

  for (const f of files) {
    try {
      const dog = await sharp(path.join(breedsDir, f))
        .resize(220, 220, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png()
        .toBuffer();

      await sharp(bg)
        .composite([{ input: dog, gravity: 'center' }])
        .png()
        .toFile(path.join(outDir, f.replace('.webp', '.png')));
    } catch (e) {
      console.error('Error on', f, e.message);
    }
  }
  console.log('Finished rendering all breeds on black.');
}
generateAllOnBlack();
