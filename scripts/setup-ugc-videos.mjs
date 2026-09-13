import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import sharp from 'sharp';

const TARGET_DIR = path.join(process.cwd(), 'public', 'videos');
if (!fs.existsSync(TARGET_DIR)) fs.mkdirSync(TARGET_DIR, { recursive: true });

// Locate source directory
const srcDirs = fs.readdirSync(process.cwd()).filter(d => d.startsWith('Depoimento'));
if (srcDirs.length === 0) {
  console.error('Source directory for videos not found!');
  process.exit(1);
}
const SRC_DIR = path.join(process.cwd(), srcDirs[0]);
console.log('Source video dir:', SRC_DIR);

const VIDEO_FILES = [
  {
    raw: 'Filming_watercolor_dog_art_indoors_20260913155518.mp4',
    dest: 'ugc-video-1.mp4',
    poster: 'ugc-poster-1.webp',
    author: 'Sarah M.',
    location: 'Austin, TX',
    dogName: 'Max',
    breed: 'Golden Retriever',
    verified: true,
    caption: '“I opened the box and immediately started crying. Seeing Max on our wall feels like he never left.”',
    rating: 5,
  },
  {
    raw: 'Hands_lifting_canvas_print_1080p_20260913151256.mp4',
    dest: 'ugc-video-2.mp4',
    poster: 'ugc-poster-2.webp',
    author: 'Jessica & David',
    location: 'Denver, CO',
    dogName: 'Bella',
    breed: 'French Bulldog',
    verified: true,
    caption: '“The texture of the canvas and the 1.5” solid oak frame... the craftsmanship is unbelievable.”',
    rating: 5,
  },
  {
    raw: 'Hand_stroking_dog_revealing_artwork_20260913154925.mp4',
    dest: 'ugc-video-3.mp4',
    poster: 'ugc-poster-3.webp',
    author: 'Michael B.',
    location: 'Seattle, WA',
    dogName: 'Cooper',
    breed: 'Labrador Retriever',
    verified: true,
    caption: '“The best tribute we could ever give to our sweet boy. Forever our family guardian.”',
    rating: 5,
  },
];

async function main() {
  for (let i = 0; i < VIDEO_FILES.length; i++) {
    const item = VIDEO_FILES[i];
    const srcPath = path.join(SRC_DIR, item.raw);
    const destPath = path.join(TARGET_DIR, item.dest);
    const tempJpg = path.join(TARGET_DIR, `temp-poster-${i + 1}.jpg`);
    const posterPath = path.join(TARGET_DIR, item.poster);

    console.log(`\nProcessing Video ${i + 1}: ${item.raw}...`);

    // Copy video file
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied to ${item.dest} (${(fs.statSync(destPath).size / (1024 * 1024)).toFixed(2)} MB)`);

    // Extract first frame
    try {
      execSync(`ffmpeg -y -ss 00:00:00.05 -i "${destPath}" -vframes 1 -q:v 2 "${tempJpg}"`, { stdio: 'pipe' });
      // Convert to optimized WebP
      await sharp(tempJpg)
        .resize({ width: 720, withoutEnlargement: true })
        .webp({ quality: 88 })
        .toFile(posterPath);

      fs.unlinkSync(tempJpg);
      console.log(`Generated poster: ${item.poster} (${(fs.statSync(posterPath).size / 1024).toFixed(1)} KB)`);
    } catch (e) {
      console.error(`Error extracting frame for ${item.dest}:`, e.message);
    }
  }

  console.log('\nAll UGC videos and posters processed successfully!');
}

main().catch(console.error);
