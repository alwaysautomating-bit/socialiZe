import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ErrorCode } from '../errors';
import { Platform, Tone } from '../../types';

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

function jsonResponse(data: unknown, status = 200) {
  return Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(data),
  });
}

function errorResponse(status: number, error: string) {
  return Promise.resolve({
    ok: false,
    status,
    json: () => Promise.resolve({ error }),
  });
}

describe('optimizeContent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  it('returns parsed result on success', async () => {
    const mockData = {
      content: 'Optimized content',
      hashtags: ['test'],
      rationale: 'Good reasoning',
      charCount: 17,
      analysis: {
        score: 85,
        currentToneDescription: 'Casual',
        feedback: 'Good tone',
        suggestions: ['Be more formal'],
      },
    };

    mockFetch.mockReturnValueOnce(jsonResponse(mockData));

    const { optimizeContent } = await import('../gemini');
    const result = await optimizeContent('Test text', Platform.LINKEDIN, Tone.PROFESSIONAL);

    expect(result.content).toBe('Optimized content');
    expect(result.platform).toBe(Platform.LINKEDIN);
    expect(result.targetTone).toBe(Tone.PROFESSIONAL);
    expect(result.analysis.score).toBe(85);
    expect(mockFetch).toHaveBeenCalledWith('/.netlify/functions/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: 'Test text', platform: Platform.LINKEDIN, tone: Tone.PROFESSIONAL }),
    });
  });

  it('throws EMPTY_RESPONSE for response missing required fields', async () => {
    mockFetch.mockReturnValueOnce(jsonResponse({}));

    const { optimizeContent } = await import('../gemini');

    await expect(
      optimizeContent('Test', Platform.X, Tone.FRIENDLY)
    ).rejects.toMatchObject({ code: ErrorCode.RESPONSE_PARSE_ERROR });
  });

  it('throws RESPONSE_PARSE_ERROR for non-JSON response', async () => {
    mockFetch.mockReturnValueOnce(
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.reject(new Error('invalid json')),
      })
    );

    const { optimizeContent } = await import('../gemini');

    await expect(
      optimizeContent('Test', Platform.INSTAGRAM, Tone.HUMOROUS)
    ).rejects.toMatchObject({ code: ErrorCode.RESPONSE_PARSE_ERROR });
  });

  it('throws RESPONSE_PARSE_ERROR for missing required fields', async () => {
    mockFetch.mockReturnValueOnce(jsonResponse({ content: 'Only content' }));

    const { optimizeContent } = await import('../gemini');

    await expect(
      optimizeContent('Test', Platform.FACEBOOK, Tone.INFORMATIVE)
    ).rejects.toMatchObject({ code: ErrorCode.RESPONSE_PARSE_ERROR });
  });

  it('classifies network errors', async () => {
    mockFetch.mockRejectedValueOnce(new TypeError('fetch failed'));

    const { optimizeContent } = await import('../gemini');

    await expect(
      optimizeContent('Test', Platform.LINKEDIN, Tone.PROFESSIONAL)
    ).rejects.toMatchObject({ code: ErrorCode.NETWORK_ERROR });
  });

  it('classifies 429 rate limit responses', async () => {
    mockFetch.mockReturnValueOnce(errorResponse(429, '429 Too Many Requests'));

    const { optimizeContent } = await import('../gemini');

    await expect(
      optimizeContent('Test', Platform.LINKEDIN, Tone.PROFESSIONAL)
    ).rejects.toMatchObject({ code: ErrorCode.RATE_LIMITED });
  });

  it('classifies 401 unauthorized responses', async () => {
    mockFetch.mockReturnValueOnce(errorResponse(401, 'API configuration error'));

    const { optimizeContent } = await import('../gemini');

    await expect(
      optimizeContent('Test', Platform.LINKEDIN, Tone.PROFESSIONAL)
    ).rejects.toMatchObject({ code: ErrorCode.API_KEY_INVALID });
  });
});
