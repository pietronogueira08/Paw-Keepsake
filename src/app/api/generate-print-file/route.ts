import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import { uploadPrintFile } from '@/lib/r2';
import { generateId } from '@/lib/utils';
import type { PrintFilePayload } from '@/types/ecommerce';

export const runtime = 'nodejs';
export const maxDuration = 30;

// Size to pixel dimensions at 300 DPI (width x height in pixels)
const SIZE_DIMENSIONS: Record<string, { width: number; height: number }> = {
  '8x12':  { width: 2400, height: 3600 },
  '12x16': { width: 3600, height: 4800 },
  '16x20': { width: 4800, height: 6000 },
  '16x24': { width: 4800, height: 7200 },
  // Backward compatibility
  '8x10':  { width: 2400, height: 3000 },
  '18x24': { width: 5400, height: 7200 },
  '24x36': { width: 7200, height: 10800 },
};

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function buildSvgTemplate(payload: PrintFilePayload, dims: { width: number; height: number }): string {
  const { width, height } = dims;
  const scale = width / 200;
  const breedScale = Math.min(width, height) * 0.003;
  const svgX = width / 2 - 100 * breedScale;
  const svgY = height * 0.18;
  const quoteTruncated = escapeXml(payload.quote.slice(0, 90));
  const petNameEscaped = escapeXml(payload.petName || 'In Loving Memory');
  const dateRangeEscaped = escapeXml(payload.dateRange);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <!-- Background: warm linen -->
  <rect width="${width}" height="${height}" fill="#FAF8F5"/>

  <!-- Outer decorative border -->
  <rect
    x="${width * 0.04}" y="${height * 0.03}"
    width="${width * 0.92}" height="${height * 0.94}"
    fill="none" stroke="#EBE6DE" stroke-width="${Math.round(width * 0.003)}"
    rx="${width * 0.008}"
  />

  <!-- Inner decorative border -->
  <rect
    x="${width * 0.06}" y="${height * 0.05}"
    width="${width * 0.88}" height="${height * 0.90}"
    fill="none" stroke="#EBE6DE" stroke-width="${Math.round(width * 0.001)}"
    rx="${width * 0.006}"
  />

  <!-- Breed silhouette - centered in upper portion -->
  <g transform="translate(${svgX}, ${svgY}) scale(${breedScale})">
    <path d="${payload.breed.svgPath}" fill="#B88A58" opacity="0.75"/>
    <path d="${payload.breed.svgPath}" fill="#D4A96A" opacity="0.25" transform="scale(0.95) translate(5,5)"/>
  </g>

  <!-- Pet name -->
  <text
    x="${width / 2}" y="${height * 0.70}"
    font-family="Georgia, 'Times New Roman', serif"
    font-size="${Math.round(width * 0.055)}"
    font-weight="300"
    fill="#242424"
    text-anchor="middle"
    letter-spacing="${Math.round(width * 0.002)}"
  >${petNameEscaped}</text>

  <!-- Divider ornament -->
  <line
    x1="${width * 0.38}" y1="${height * 0.745}"
    x2="${width * 0.62}" y2="${height * 0.745}"
    stroke="#B88A58" stroke-width="${Math.round(width * 0.001)}" opacity="0.5"
  />

  <!-- Date range -->
  <text
    x="${width / 2}" y="${height * 0.785}"
    font-family="Georgia, 'Times New Roman', serif"
    font-size="${Math.round(width * 0.028)}"
    font-style="italic"
    fill="#736E65"
    text-anchor="middle"
    letter-spacing="${Math.round(width * 0.003)}"
  >${dateRangeEscaped}</text>

  <!-- Memorial quote -->
  <text
    x="${width / 2}" y="${height * 0.855}"
    font-family="Georgia, 'Times New Roman', serif"
    font-size="${Math.round(width * 0.020)}"
    font-style="italic"
    fill="#736E65"
    text-anchor="middle"
    opacity="0.85"
  >"${quoteTruncated}"</text>

  <!-- Paw & Keepsake branding -->
  <text
    x="${width / 2}" y="${height * 0.925}"
    font-family="Georgia, 'Times New Roman', serif"
    font-size="${Math.round(width * 0.014)}"
    fill="#B88A58"
    text-anchor="middle"
    letter-spacing="${Math.round(width * 0.004)}"
    opacity="0.6"
  >PAW &amp; KEEPSAKE</text>
</svg>`;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const payload = await req.json() as PrintFilePayload;

    if (!payload.breed?.svgPath) {
      return NextResponse.json({ error: 'Breed SVG path is required' }, { status: 400 });
    }

    const dims = SIZE_DIMENSIONS[payload.size] ?? SIZE_DIMENSIONS['12x16'];
    const svgString = buildSvgTemplate(payload, dims);

    const pngBuffer = await sharp(Buffer.from(svgString))
      .png({ quality: 100, compressionLevel: 1 })
      .toBuffer();

    const fileKey = `prints/${generateId()}-${payload.size}-${payload.productType}.png`;
    const publicUrl = await uploadPrintFile(fileKey, pngBuffer, 'image/png');

    return NextResponse.json({
      url: publicUrl,
      key: fileKey,
      dimensions: dims,
      sizeLabel: payload.size,
    });
  } catch (error) {
    console.error('Print file generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate print file' },
      { status: 500 },
    );
  }
}
