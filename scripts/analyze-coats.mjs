import sharp from 'sharp';
import fs from 'fs';

const multiBreeds = [
  'Dachshund',
  'Doberman',
  'Siberian_Husky',
  'Labrador',
  'French_Bulldog',
  'Standard_Poodle',
  'German_Shepherd',
  'Border_Collie',
  'Pembroke_Welsh'
];

async function analyzeMultiBreeds() {
  const allFiles = fs.readdirSync('extracted_breeds');
  
  for (const prefix of multiBreeds) {
    console.log(`\n=== ${prefix} ===`);
    const matches = allFiles.filter(f => f.startsWith(prefix));
    for (const f of matches) {
      const img = sharp(`extracted_breeds/${f}`);
      const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
      
      // Sample center region 300x300 around (width/2, height/2)
      let rSum = 0, gSum = 0, bSum = 0, count = 0;
      const startX = Math.floor(info.width * 0.35);
      const endX = Math.floor(info.width * 0.65);
      const startY = Math.floor(info.height * 0.35);
      const endY = Math.floor(info.height * 0.65);
      
      for (let y = startY; y < endY; y++) {
        for (let x = startX; x < endX; x++) {
          const idx = (y * info.width + x) * info.channels;
          rSum += data[idx];
          gSum += data[idx + 1];
          bSum += data[idx + 2];
          count++;
        }
      }
      const rAvg = Math.round(rSum / count);
      const gAvg = Math.round(gSum / count);
      const bAvg = Math.round(bSum / count);
      const brightness = Math.round((rAvg + gAvg + bAvg) / 3);
      console.log(`${f} -> RGB(${rAvg}, ${gAvg}, ${bAvg}) brightness=${brightness}`);
    }
  }
}

analyzeMultiBreeds();
