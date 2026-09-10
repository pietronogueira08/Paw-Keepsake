/**
 * r2.ts
 *
 * Cloudflare R2 upload adapter (S3-compatible).
 * Uses the AWS SDK v3 S3Client pointed at the R2 endpoint.
 *
 * Required environment variables:
 *   CLOUDFLARE_R2_ACCOUNT_ID  — found in the Cloudflare dashboard
 *   R2_ACCESS_KEY_ID          — R2 API token access key
 *   R2_SECRET_ACCESS_KEY      — R2 API token secret
 *   R2_BUCKET_NAME            — bucket name (default: paw-keepsake-prints)
 *   R2_PUBLIC_URL             — public CDN base URL (default: https://cdn.pawandkeepsake.com)
 */

import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Warn at module load — throw lazily inside each function so Next.js can
// still import this module without crashing during a cold start if env vars
// are not yet set (e.g., in CI or local dev without R2 credentials).
if (!process.env.CLOUDFLARE_R2_ACCOUNT_ID) {
  console.warn(
    '[r2] CLOUDFLARE_R2_ACCOUNT_ID not set — R2 uploads will fail',
  );
}

// ---------------------------------------------------------------------------
// Client factory (lazy — instantiated per call to avoid stale credentials)
// ---------------------------------------------------------------------------

function getR2Client(): S3Client {
  const accountId = process.env.CLOUDFLARE_R2_ACCOUNT_ID;
  if (!accountId) {
    throw new Error(
      'CLOUDFLARE_R2_ACCOUNT_ID is required to use R2 storage',
    );
  }
  return new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID ?? '',
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ?? '',
    },
  });
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const BUCKET = process.env.R2_BUCKET_NAME ?? 'paw-keepsake-prints';
const PUBLIC_URL_BASE =
  process.env.R2_PUBLIC_URL ?? 'https://cdn.pawandkeepsake.com';

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Uploads a print file buffer to R2 and returns its public CDN URL.
 *
 * @param key         - Object key / path inside the bucket (e.g. "prints/abc123.png")
 * @param buffer      - File data as a Node.js Buffer
 * @param contentType - MIME type of the file (default: image/png)
 * @returns           The public CDN URL of the uploaded file
 */
export async function uploadPrintFile(
  key: string,
  buffer: Buffer,
  contentType: 'image/png' | 'image/jpeg' = 'image/png',
): Promise<string> {
  const client = getR2Client();

  await client.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      // Print files are immutable — hash is part of the key
      CacheControl: 'public, max-age=31536000, immutable',
    }),
  );

  return `${PUBLIC_URL_BASE}/${key}`;
}

/**
 * Generates a time-limited pre-signed GET URL for a private R2 object.
 * Useful for giving artists or customers temporary access to high-res files.
 *
 * @param key       - Object key inside the bucket
 * @param expiresIn - Validity window in seconds (default: 1 hour)
 * @returns         A pre-signed URL string
 */
export async function getPresignedUrl(
  key: string,
  expiresIn = 3600,
): Promise<string> {
  const client = getR2Client();

  return getSignedUrl(
    client,
    new GetObjectCommand({ Bucket: BUCKET, Key: key }),
    { expiresIn },
  );
}
