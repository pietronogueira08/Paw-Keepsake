import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';

export const runtime = 'nodejs';

const RequestSchema = z.object({
  petName: z.string().min(1, 'Pet name is required').max(50),
  breed: z.string().optional(),
});

const CURATED_FALLBACKS = [
  'No longer by my side, but forever in my heart.',
  'You were my favorite hello and my hardest goodbye.',
  'Forever running free, always loved and never forgotten.',
];

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();
    const { petName, breed } = RequestSchema.parse(body);

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('[generate-quote] GEMINI_API_KEY not found; using fallback quotes.');
      return NextResponse.json({ quotes: CURATED_FALLBACKS });
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `You are a compassionate writer for a fine art pet memorial studio. Generate 3 distinct, deeply touching, respectful one-sentence memorial quotes for a beloved pet named ${petName}${breed ? ` (breed: ${breed})` : ''}.
Constraints:
- Max 15 to 18 words per quote.
- Heartfelt, comforting, timeless North American English.
- Avoid cheesy rhyming.
- Return clean JSON format: { "quotes": ["quote 1", "quote 2", "quote 3"] }.`;

    // Try gemini-3.5-flash-lite first (recommended free tier flash), cascade to gemini-3.5-flash, gemini-flash-latest, etc.
    const candidateModels = ['gemini-3.5-flash-lite', 'gemini-3.5-flash', 'gemini-3.6-flash', 'gemini-flash-latest', 'gemini-flash-lite-latest', 'gemini-1.5-flash'];
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
          const parsed = JSON.parse(response.text);
          if (Array.isArray(parsed?.quotes) && parsed.quotes.length > 0) {
            quotes = parsed.quotes.map((q: unknown) => String(q).trim().replace(/^["']|["']$/g, ''));
            break;
          } else if (Array.isArray(parsed) && parsed.length > 0) {
            quotes = parsed.map((q: unknown) => String(q).trim().replace(/^["']|["']$/g, ''));
            break;
          }
        }
      } catch (err: unknown) {
        console.warn(`[generate-quote] Model ${model} failed, attempting next available model:`, (err as Error)?.message || err);
      }
    }

    if (quotes && quotes.length > 0) {
      return NextResponse.json({ quotes: quotes.slice(0, 3) });
    }

    return NextResponse.json({ quotes: CURATED_FALLBACKS });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
    }
    console.error('[generate-quote] Error:', error);
    return NextResponse.json({ quotes: CURATED_FALLBACKS });
  }
}
