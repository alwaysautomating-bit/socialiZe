import { GoogleGenAI, Type } from '@google/genai';
import { RESPONSE_SCHEMA } from './responseSchema.js';
import { SYSTEM_INSTRUCTION } from './systemInstruction.js';

export interface TranslatePayload {
  text: string;
  platform: string;
  tone: string;
}

export interface TranslateErrorResponse {
  status: number;
  body: {
    error: string;
  };
}

export function parseTranslatePayload(input: unknown): TranslatePayload | null {
  if (!input || typeof input !== 'object') {
    return null;
  }

  const { text, platform, tone } = input as Record<string, unknown>;
  if (typeof text !== 'string' || typeof platform !== 'string' || typeof tone !== 'string') {
    return null;
  }

  if (!text || !platform || !tone) {
    return null;
  }

  return { text, platform, tone };
}

export function getMissingConfigError(): TranslateErrorResponse | null {
  if (!process.env.GEMINI_API_KEY) {
    return {
      status: 500,
      body: { error: 'API configuration error' },
    };
  }

  return null;
}

export async function generateTranslation(payload: TranslatePayload) {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Platform: ${payload.platform}\nTarget Tone: ${payload.tone}\nRaw Input Text: ${payload.text}`,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: 'application/json',
      responseSchema: mapResponseSchema(RESPONSE_SCHEMA),
    },
  });

  if (!response.text) {
    return {
      status: 502,
      body: { error: 'Empty response from AI model' },
    };
  }

  return {
    status: 200,
    body: JSON.parse(response.text),
  };
}

export function mapTranslateError(err: unknown): TranslateErrorResponse {
  const message = err instanceof Error ? err.message : String(err);
  const lower = message.toLowerCase();

  if (lower.includes('429') || lower.includes('rate') || lower.includes('quota')) {
    return { status: 429, body: { error: message } };
  }
  if (lower.includes('api key') || lower.includes('401') || lower.includes('unauthorized')) {
    return { status: 401, body: { error: 'API configuration error' } };
  }

  console.error('Translate error:', message);
  return { status: 500, body: { error: message } };
}

function mapResponseSchema(schema: typeof RESPONSE_SCHEMA) {
  return {
    ...schema,
    type: Type[schema.type],
    properties: {
      content: { type: Type[schema.properties.content.type] },
      hashtags: {
        type: Type[schema.properties.hashtags.type],
        items: { type: Type[schema.properties.hashtags.items.type] },
      },
      rationale: { type: Type[schema.properties.rationale.type] },
      charCount: { type: Type[schema.properties.charCount.type] },
      analysis: {
        type: Type[schema.properties.analysis.type],
        properties: {
          score: { type: Type[schema.properties.analysis.properties.score.type] },
          currentToneDescription: { type: Type[schema.properties.analysis.properties.currentToneDescription.type] },
          feedback: { type: Type[schema.properties.analysis.properties.feedback.type] },
          suggestions: {
            type: Type[schema.properties.analysis.properties.suggestions.type],
            items: { type: Type[schema.properties.analysis.properties.suggestions.items.type] },
          },
          diagnosisType: { type: Type[schema.properties.analysis.properties.diagnosisType.type] },
        },
        required: schema.properties.analysis.required,
      },
    },
    required: schema.required,
  };
}
