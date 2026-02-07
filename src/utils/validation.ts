import { Platform } from '../types';
import { PLATFORMS } from '../constants';
import { createAppError, ErrorCode, AppError } from '../services/errors';

interface ValidationResult {
  valid: boolean;
  error?: AppError;
}

export function validateOptimizationInput(
  text: string,
  platform: Platform | null
): ValidationResult {
  if (!text.trim()) {
    return {
      valid: false,
      error: createAppError(ErrorCode.VALIDATION_ERROR, 'Content is required.'),
    };
  }

  if (!platform) {
    return {
      valid: false,
      error: createAppError(ErrorCode.VALIDATION_ERROR, 'Platform selection required.'),
    };
  }

  const config = PLATFORMS.find((p) => p.id === platform);
  if (config && text.length > config.maxChars) {
    return {
      valid: false,
      error: createAppError(
        ErrorCode.VALIDATION_ERROR,
        `Text exceeds ${config.maxChars} character limit for ${platform}.`
      ),
    };
  }

  return { valid: true };
}
