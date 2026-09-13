import sharp from 'sharp';
import path from 'path';

async function testMethods() {
  const breedImgPath = path.join(process.cwd(), 'public', 'breeds', 'shih-tzu.webp');
  const w = 400, h = 400;

  const bg = await sharp({
    create: { width: w, height: h, channels: 4, background: { r: 36, g: 36, b: 36, alpha: 1 } }
  }).png().toBuffer();

  const dog = await sharp(breedImgPath)
    .resize(260, 260, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  // Method 1: Soft luminous glow / rim light behind dog
  const glow = await sharp(dog)
    .ensureAlpha()
    .linear([0,0,0,1], [255,255,255,0])
    .blur(8)
    .png()
    .toBuffer();

  await sharp(bg)
    .composite([
      { input: glow, gravity: 'center' },
      { input: dog, gravity: 'center' }
    ])
    .png()
    .toFile('C:/Users/pietr/.gemini/antigravity/brain/844864bd-fabf-4fa4-a746-258d50934da7/method-glow.png');

  // Method 2: Soft antique paper vignette circle behind the watercolor
  const circleSvg = Buffer.from(
    '<svg width=\"' + w + '\" height=\"' + h + '\">' +
      '<defs>' +
        '<radialGradient id=\"paperGrad\" cx=\"50%\" cy=\"50%\" r=\"50%\">' +
          '<stop offset=\"0%\" stop-color=\"#FAF6EE\" stop-opacity=\"0.95\" />' +
          '<stop offset=\"65%\" stop-color=\"#FAF6EE\" stop-opacity=\"0.80\" />' +
          '<stop offset=\"85%\" stop-color=\"#FAF6EE\" stop-opacity=\"0.35\" />' +
          '<stop offset=\"100%\" stop-color=\"#FAF6EE\" stop-opacity=\"0\" />' +
        '</radialGradient>' +
      '</defs>' +
      '<circle cx=\"' + (w/2) + '\" cy=\"' + (h/2) + '\" r=\"130\" fill=\"url(#paperGrad)\" />' +
    '</svg>'
  );
  await sharp(bg)
    .composite([
      { input: circleSvg, gravity: 'center' },
      { input: dog, gravity: 'center' }
    ])
    .png()
    .toFile('C:/Users/pietr/.gemini/antigravity/brain/844864bd-fabf-4fa4-a746-258d50934da7/method-paper-circle.png');

  // Method 3: Clean cream-colored underbase with soft 2px rim
  const underbase = await sharp(dog)
    .ensureAlpha()
    .linear([0,0,0,1], [245,242,236,0])
    .blur(2)
    .png()
    .toBuffer();

  await sharp(bg)
    .composite([
      { input: underbase, gravity: 'center' },
      { input: dog, gravity: 'center' }
    ])
    .png()
    .toFile('C:/Users/pietr/.gemini/antigravity/brain/844864bd-fabf-4fa4-a746-258d50934da7/method-underbase.png');

  console.log('Finished generating methods');
}
testMethods().catch(console.error);
