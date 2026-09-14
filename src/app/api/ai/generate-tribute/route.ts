import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';

export const runtime = 'nodejs';

const RequestSchema = z.object({
  petName: z.string().min(1, 'Pet name is required').max(30),
  breed: z.string().optional(),
  memory: z.string().max(200).optional(),
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

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY is not configured; using curated fallbacks.');
      return NextResponse.json({ quotes: CURATED_FALLBACKS[tone] });
    }

    const ai = new GoogleGenAI({ apiKey });

    const toneInstructions = {
      heartfelt: 'deeply comforting, emotional, sincere, focusing on lasting love and gratitude',
      poetic: 'timeless, lyrical, touching on nature, stars, light, and enduring memory',
      short: 'concise (under 8 words), high impact, clean, and memorable for an art piece',
    }[tone];

    const prompt = `You are an empathetic, poetically gifted memorial art writer for "Paw & Keepsake", a premier American pet memorial brand.
Your task is to write 3 touching, unique, and deeply comforting memorial tribute inscriptions for a personalized watercolor canvas.

Pet Name: ${petName}
${breed ? `Breed: ${breed}` : ''}
${memory ? `Special Personality / Memory: ${memory}` : ''}
Tone Style: ${toneInstructions}

Rules:
1. Return ONLY a valid JSON array of exactly 3 distinct strings.
2. Keep each quote concise (under 14 words) so it fits elegantly on a fine art canvas.
3. Use authentic, native American English. Avoid generic clichés.
4. Focus on celebrating the dog's soul, companionship, and the eternal bond.
5. Example format: ["quote 1", "quote 2", "quote 3"]`;

    // Cascade through reliable Gemini models (gemini-3.5-flash-lite first for free tier speed and stability)
    const candidateModels = ['gemini-3.5-flash-lite', 'gemini-3.5-flash', 'gemini-3.6-flash', 'gemini-flash-lite-latest', 'gemini-flash-latest'];
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
          const parsed = JSON.parse(response.text);
          if (Array.isArray(parsed) && parsed.length > 0) {
            generatedQuotes = parsed.map((q: unknown) => String(q).trim().replace(/^["']|["']$/g, ''));
            break;
          }
        }
      } catch (err: unknown) {
        console.warn(`Gemini model ${model} attempt failed, trying fallback:`, (err as Error)?.message || err);
      }
    }

    if (generatedQuotes && generatedQuotes.length > 0) {
      return NextResponse.json({ quotes: generatedQuotes });
    }

    // Graceful fallback if temporary rate limit or network glitch
    return NextResponse.json({ quotes: CURATED_FALLBACKS[tone] });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
    }
    console.error('Error generating memorial tribute:', error);
    return NextResponse.json({ quotes: CURATED_FALLBACKS.heartfelt });
  }
}
