import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

async function testTribute() {
  const prompt = `You are an empathetic, poetically gifted memorial art writer for "Paw & Keepsake", a premium American pet memorial brand.
Write 3 touching, deeply comforting, and authentic memorial tribute inscriptions for a pet memorial canvas.
Pet Name: Cooper
Breed: Golden Retriever
Special Memories: loved running on the beach and greeting everyone with a wagging tail.
Guidelines:
- Return a valid JSON array of 3 strings.
- Keep each quote concise (under 15 words).
- Native, heartfelt American English, never generic or cliché.
Format: ["quote 1", "quote 2", "quote 3"]`;

  const modelsToTry = ['gemini-2.5-flash', 'gemini-flash-latest', 'gemini-flash-lite-latest', 'gemini-3.5-flash', 'gemini-2.5-pro'];
  for (const model of modelsToTry) {
    try {
      console.log(`Trying model: ${model}...`);
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });
      console.log(`SUCCESS with ${model}! Response:\n`, response.text);
      break;
    } catch (err) {
      console.log(`Model ${model} failed:`, err.message?.slice(0, 100) || err);
    }
  }
}

testTribute();
