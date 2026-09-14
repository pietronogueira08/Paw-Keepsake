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

const CURATED_FALLBACKS: Record<string, string[]> = {
  heartfelt: [
    'No longer by my side, but forever in my heart.',
    'You gave us a lifetime of love in too few years.',
    'My favorite hello, my hardest goodbye, my forever friend.',
  ],
  poetic: [
    "Until one has loved an animal, a part of one's soul remains unawakened.",
    'Running free beyond the stars, forever nestled in our souls.',
    'The bond with a faithful soul outlasts the bounds of time.',
  ],
  short: [
    'Forever loved, never forgotten.',
    'Always running free, always by our side.',
    'A piece of our hearts lives on in you.',
  ],
};

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();
    const { petName, breed, memory, tone } = RequestSchema.parse(body);

    // 1. Quota Enforcement: Limit to 5 uses per user
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
      console.warn('GEMINI_API_KEY is not configured; using curated fallbacks.');
      return NextResponse.json({
        quotes: CURATED_FALLBACKS[tone] || CURATED_FALLBACKS.heartfelt,
        remainingUses: Math.max(0, MAX_USES_PER_USER - quota.count - 1),
        totalLimit: MAX_USES_PER_USER,
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    const toneInstructions = {
      heartfelt: 'deeply comforting, emotional, sincere, focusing on lasting love and eternal gratitude',
      poetic: 'timeless, lyrical, touching on nature, stars, light, footprints, and enduring memory',
      short: 'concise (under 9 words), high impact, clean, and memorable for fine art canvas',
    }[tone] || 'deeply comforting, emotional, and warm';

    const prompt = `You are an empathetic, poetically gifted memorial art writer for "Paw & Keepsake", a premier American pet memorial studio.
Write 3 distinct, touching, unique, and deeply comforting one-sentence memorial tribute inscriptions for a personalized watercolor canvas.

Pet Name: ${petName}
${breed ? `Breed: ${breed}` : ''}
${memory ? `Special Personality / Memory / Traits: ${memory}` : ''}
Tone Style: ${toneInstructions}

Rules:
1. Return ONLY a valid JSON object with the key "quotes" containing exactly 3 distinct strings:
   { "quotes": ["quote 1", "quote 2", "quote 3"] }
2. Keep each quote concise (between 10 and 16 words, or under 9 words if short tone) so it fits elegantly on fine art canvas.
3. Use authentic, emotionally moving, native American English.
4. Avoid cheesy nursery-rhyme cadences.`;

    // Cascade through available Gemini models
    const candidateModels = [
      'gemini-3.5-flash-lite',
      'gemini-3.5-flash',
      'gemini-3.6-flash',
      'gemini-flash-lite-latest',
      'gemini-flash-latest',
    ];

    let generatedQuotes: string[] | null = null;

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
              generatedQuotes = sanitized.slice(0, 3);
              break;
            }
          }
        }
      } catch (err: unknown) {
        console.warn(`Gemini model ${model} attempt failed, trying fallback:`, (err as Error)?.message || err);
      }
    }

    const quotesToReturn = generatedQuotes && generatedQuotes.length > 0
      ? generatedQuotes
      : CURATED_FALLBACKS[tone] || CURATED_FALLBACKS.heartfelt;

    const nextCount = quota.count + 1;
    const remainingUses = Math.max(0, MAX_USES_PER_USER - nextCount);

    const res = NextResponse.json({
      quotes: quotesToReturn,
      remainingUses,
      totalLimit: MAX_USES_PER_USER,
    });

    // Set quota cookie for 7 days
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
    console.error('Error generating memorial tribute:', error);
    return NextResponse.json({
      quotes: CURATED_FALLBACKS.heartfelt,
      remainingUses: 5,
      totalLimit: MAX_USES_PER_USER,
    });
  }
}
