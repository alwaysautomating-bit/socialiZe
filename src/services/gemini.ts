import { Platform, Tone, OptimizationResult } from "../types";
import { createAppError, ErrorCode, AppError } from "./errors";

function isAppError(err: unknown): err is AppError {
  return typeof err === 'object' && err !== null && 'code' in err && 'retryable' in err;
}

function classifyError(err: unknown): AppError {
  if (isAppError(err)) return err;

  const message = err instanceof Error ? err.message : String(err);
  const lower = message.toLowerCase();

  if (lower.includes('api key') || lower.includes('401') || lower.includes('unauthorized') || lower.includes('permission')) {
    return createAppError(ErrorCode.API_KEY_INVALID, message);
  }
  if (lower.includes('429') || lower.includes('rate') || lower.includes('quota')) {
    return createAppError(ErrorCode.RATE_LIMITED, message);
  }
  if (lower.includes('fetch') || lower.includes('network') || lower.includes('econnrefused') || lower.includes('timeout')) {
    return createAppError(ErrorCode.NETWORK_ERROR, message);
  }
  return createAppError(ErrorCode.UNKNOWN_ERROR, message);
}

function validateResponse(data: unknown): asserts data is Omit<OptimizationResult, 'platform' | 'targetTone'> {
  if (!data || typeof data !== 'object') {
    throw createAppError(ErrorCode.EMPTY_RESPONSE);
  }
  const obj = data as Record<string, unknown>;
  const required = ['content', 'hashtags', 'rationale', 'charCount', 'analysis'];
  for (const field of required) {
    if (!(field in obj)) {
      throw createAppError(ErrorCode.RESPONSE_PARSE_ERROR, `Missing field: ${field}`);
    }
  }
}

export const optimizeAllPlatforms = async (
  text: string,
  targetTone: Tone
): Promise<OptimizationResult[]> => {
  const platforms = Object.values(Platform);
  const settled = await Promise.allSettled(
    platforms.map(platform => optimizeContent(text, platform, targetTone))
  );
  const results = settled
    .filter((r): r is PromiseFulfilledResult<OptimizationResult> => r.status === 'fulfilled')
    .map(r => r.value);
  if (results.length === 0) {
    throw createAppError(ErrorCode.UNKNOWN_ERROR, 'All platform optimizations failed.');
  }
  return results;
};

export const optimizeContent = async (
  text: string,
  platform: Platform,
  targetTone: Tone
): Promise<OptimizationResult> => {
  try {
    const response = await fetch('/.netlify/functions/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, platform, tone: targetTone }),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      const message = body.error || `Server error: ${response.status}`;
      if (response.status === 429) {
        throw createAppError(ErrorCode.RATE_LIMITED, message);
      }
      if (response.status === 401) {
        throw createAppError(ErrorCode.API_KEY_INVALID, message);
      }
      throw createAppError(ErrorCode.UNKNOWN_ERROR, message);
    }

    let data: unknown;
    try {
      data = await response.json();
    } catch {
      throw createAppError(ErrorCode.RESPONSE_PARSE_ERROR, 'Response was not valid JSON.');
    }

    validateResponse(data);

    return {
      ...data,
      platform,
      targetTone,
    };
  } catch (err) {
    throw classifyError(err);
  }
};
