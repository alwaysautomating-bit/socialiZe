import { GoogleGenAI, Type } from '@google/genai';
import { SYSTEM_INSTRUCTION } from '../../shared/systemInstruction.js';

export const handler = async (event: { httpMethod: string; body: string | null }) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing request body' }),
    };
  }

  let text: string, platform: string, tone: string;
  try {
    ({ text, platform, tone } = JSON.parse(event.body));
  } catch {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid JSON body' }),
    };
  }

  if (!text || !platform || !tone) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing required fields: text, platform, tone' }),
    };
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'API configuration error' }),
    };
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

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
                diagnosisType: { type: Type.STRING },
              },
              required: ['score', 'currentToneDescription', 'feedback', 'suggestions', 'diagnosisType'],
            },
          },
          required: ['content', 'hashtags', 'rationale', 'charCount', 'analysis'],
        },
      },
    });

    const responseText = response.text;
    if (!responseText) {
      return {
        statusCode: 502,
        body: JSON.stringify({ error: 'Empty response from AI model' }),
      };
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: responseText,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    const lower = message.toLowerCase();

    if (lower.includes('429') || lower.includes('rate') || lower.includes('quota')) {
      return { statusCode: 429, body: JSON.stringify({ error: message }) };
    }
    if (lower.includes('api key') || lower.includes('401') || lower.includes('unauthorized')) {
      return { statusCode: 401, body: JSON.stringify({ error: 'API configuration error' }) };
    }

    console.error('Translate error:', message);
    return { statusCode: 500, body: JSON.stringify({ error: message }) };
  }
};
