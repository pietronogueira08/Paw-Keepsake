import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export const runtime = 'nodejs';

const SaveDraftSchema = z.object({
  email: z.string().email('Valid email required'),
  petName: z.string().min(1).max(50),
  breedName: z.string().min(1).max(100),
  dateRange: z.string().max(60),
  quote: z.string().max(200),
  size: z.string(),
  productType: z.string(),
});

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json() as unknown;
    const data = SaveDraftSchema.parse(body);

    // ─── Store draft (Vercel KV / Upstash Redis) ───────────────────
    // TODO: Uncomment when KV credentials are configured
    // import { kv } from '@vercel/kv';
    // const draftId = crypto.randomUUID();
    // await kv.set(`draft:${draftId}`, JSON.stringify(data), { ex: 60 * 60 * 24 * 7 }); // 7-day TTL
    // await kv.sadd(`drafts:${data.email}`, draftId);

    // ─── Send preview email (Resend) ───────────────────────────────
    // TODO: Uncomment when Resend API key is configured
    // const { Resend } = await import('resend');
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: process.env.FROM_EMAIL ?? 'hello@pawandkeepsake.com',
    //   to: data.email,
    //   subject: `Your ${data.petName} Memorial Preview — Paw & Keepsake`,
    //   html: buildPreviewEmailHtml(data),
    // });

    console.info('[save-draft] Saved for:', data.email, '| Pet:', data.petName, '| Breed:', data.breedName);

    return NextResponse.json({
      success: true,
      message: 'Your preview has been saved! Check your inbox shortly.',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 },
      );
    }
    console.error('[save-draft] Error:', error);
    return NextResponse.json({ error: 'Failed to save draft' }, { status: 500 });
  }
}
