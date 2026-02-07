import { Router, Request, Response } from 'express';
import { GoogleGenAI, Type } from '@google/genai';
import { SYSTEM_INSTRUCTION } from '../../shared/systemInstruction.js';
import { RESPONSE_SCHEMA } from '../../shared/responseSchema.js';

const router = Router();

function getClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not set');
  }
  return new GoogleGenAI({ apiKey });
}

router.post('/', async (req: Request, res: Response) => {
  const { text, platform, tone } = req.body;

  if (!text || !platform || !tone) {
    res.status(400).json({ error: 'Missing required fields: text, platform, tone' });
    return;
  }

  try {
    const ai = getClient();

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Platform: ${platform}\nTarget Tone: ${tone}\nRaw Input Text: ${text}`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            content: { type: Type.STRING },
            hashtags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            rationale: { type: Type.STRING },
            charCount: { type: Type.NUMBER },
            analysis: {
              type: Type.OBJECT,
              properties: {
                score: { type: Type.NUMBER },
                currentToneDescription: { type: Type.STRING },
                feedback: { type: Type.STRING },
                suggestions: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: ['score', 'currentToneDescription', 'feedback', 'suggestions'],
            },
          },
          required: ['content', 'hashtags', 'rationale', 'charCount', 'analysis'],
        },
      },
    });

    const responseText = response.text;
    if (!responseText) {
      res.status(502).json({ error: 'Empty response from AI model' });
      return;
    }

    const data = JSON.parse(responseText);
    res.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    const lower = message.toLowerCase();

    if (lower.includes('429') || lower.includes('rate') || lower.includes('quota')) {
      res.status(429).json({ error: message });
      return;
    }
    if (lower.includes('api key') || lower.includes('401') || lower.includes('unauthorized')) {
      res.status(401).json({ error: 'API configuration error' });
      return;
    }

    console.error('Optimize error:', message);
    res.status(500).json({ error: message });
  }
});

export default router;
