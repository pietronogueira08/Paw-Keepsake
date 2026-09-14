import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';

export const runtime = 'nodejs';

const MAX_USES_PER_USER = 5;
const QUOTA_WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours

interface QuotaData {
  count: number;
  resetAt: number;
}

const RequestSchema = z.object({
  petName: z.string().min(1, 'Pet name is required').max(50),
  breed: z.string().optional(),
  memory: z.string().max(300).optional(),
  tone: z.enum(['heartfelt', 'poetic', 'short']).optional().default('heartfelt'),
});

const CURATED_FALLBACKS = [
  'No longer by my side, but forever in my heart.',
  'You were my favorite hello and my hardest goodbye.',
  'Forever running free, always loved and never forgotten.',
];

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();
    const { petName, breed, memory, tone } = RequestSchema.parse(body);

    // Quota Enforcement: Limit to 5 uses per user
    const quotaCookie = req.cookies.get('paw_ai_quota')?.value;
    let quota: QuotaData = { count: 0, resetAt: Date.now() + QUOTA_WINDOW_MS };

    if (quotaCookie) {
      try {
        const parsed = JSON.parse(quotaCookie);
        if (parsed && typeof parsed.count === 'number') {
          if (Date.now() < (parsed.resetAt || 0)) {
            quota = parsed;
          }
        }
      } catch {
        // use default quota
      }
    }

    if (quota.count >= MAX_USES_PER_USER) {
      return NextResponse.json(
        {
          error: 'RATE_LIMIT_EXCEEDED',
          message: 'You have reached the limit of 5 free AI generations. Please select from your favorite generated tributes or customize your message.',
          remainingUses: 0,
          totalLimit: MAX_USES_PER_USER,
        },
        { status: 429 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('[generate-quote] GEMINI_API_KEY not found; using fallback quotes.');
      return NextResponse.json({
        quotes: CURATED_FALLBACKS,
        remainingUses: Math.max(0, MAX_USES_PER_USER - quota.count - 1),
        totalLimit: MAX_USES_PER_USER,
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `You are a compassionate writer for a fine art pet memorial studio. Generate 3 distinct, deeply touching, respectful one-sentence memorial quotes for a beloved pet named ${petName}${breed ? ` (breed: ${breed})` : ''}.
${memory ? `Special Personality / Memory / Traits: ${memory}` : ''}
Tone Style: ${tone || 'heartfelt & comforting'}

Constraints:
- Max 14 to 18 words per quote.
- Heartfelt, comforting, timeless North American English.
- Avoid cheesy rhyming.
- Return clean JSON format: { "quotes": ["quote 1", "quote 2", "quote 3"] }.`;

    const candidateModels = [
      'gemini-3.5-flash-lite',
      'gemini-3.5-flash',
      'gemini-3.6-flash',
      'gemini-flash-lite-latest',
      'gemini-flash-latest',
    ];

    let quotes: string[] | null = null;

    for (const model of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        if (response.text) {
          let parsed: unknown;
          try {
            parsed = JSON.parse(response.text);
          } catch {
            const cleaned = response.text.replace(/```(?:json)?\n?|\n?```/g, '').trim();
            parsed = JSON.parse(cleaned);
          }

          let candidateList: unknown[] | null = null;
          if (Array.isArray(parsed)) {
            candidateList = parsed;
          } else if (parsed && typeof parsed === 'object') {
            const record = parsed as Record<string, unknown>;
            for (const key of ['quotes', 'tributes', 'inscriptions', 'results', 'data']) {
              if (Array.isArray(record[key])) {
                candidateList = record[key] as unknown[];
                break;
              }
            }
            if (!candidateList) {
              const firstArr = Object.values(record).find((val) => Array.isArray(val));
              if (firstArr) candidateList = firstArr as unknown[];
            }
          }

          if (candidateList && candidateList.length > 0) {
            const sanitized = candidateList
              .map((q: unknown) => {
                if (typeof q === 'string') return q.trim().replace(/^["']|["']$/g, '');
                if (q && typeof q === 'object' && 'text' in q) return String((q as Record<string, unknown>).text).trim();
                if (q && typeof q === 'object' && 'quote' in q) return String((q as Record<string, unknown>).quote).trim();
                return String(q).trim();
              })
              .filter(Boolean);

            if (sanitized.length > 0) {
              quotes = sanitized.slice(0, 3);
              break;
            }
          }
        }
      } catch (err: unknown) {
        console.warn(`[generate-quote] Model ${model} failed, attempting next available model:`, (err as Error)?.message || err);
      }
    }

    const nextCount = quota.count + 1;
    const remainingUses = Math.max(0, MAX_USES_PER_USER - nextCount);

    const res = NextResponse.json({
      quotes: quotes && quotes.length > 0 ? quotes : CURATED_FALLBACKS,
      remainingUses,
      totalLimit: MAX_USES_PER_USER,
    });

    res.cookies.set('paw_ai_quota', JSON.stringify({ count: nextCount, resetAt: quota.resetAt }), {
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
      sameSite: 'lax',
    });

    return res;
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
    }
    console.error('[generate-quote] Error:', error);
    return NextResponse.json({
      quotes: CURATED_FALLBACKS,
      remainingUses: 5,
      totalLimit: MAX_USES_PER_USER,
    });
  }
}
