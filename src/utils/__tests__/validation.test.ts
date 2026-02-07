import { describe, it, expect } from 'vitest';
import { validateOptimizationInput } from '../validation';
import { Platform } from '../../types';
import { ErrorCode } from '../../services/errors';

describe('validateOptimizationInput', () => {
  it('returns invalid for empty text', () => {
    const result = validateOptimizationInput('', Platform.LINKEDIN);
    expect(result.valid).toBe(false);
    expect(result.error?.code).toBe(ErrorCode.VALIDATION_ERROR);
    expect(result.error?.detail).toContain('Content is required');
  });

  it('returns invalid for whitespace-only text', () => {
    const result = validateOptimizationInput('   ', Platform.LINKEDIN);
    expect(result.valid).toBe(false);
    expect(result.error?.code).toBe(ErrorCode.VALIDATION_ERROR);
  });

  it('returns invalid for null platform', () => {
    const result = validateOptimizationInput('Hello world', null);
    expect(result.valid).toBe(false);
    expect(result.error?.code).toBe(ErrorCode.VALIDATION_ERROR);
    expect(result.error?.detail).toContain('Platform selection required');
  });

  it('returns invalid when text exceeds platform char limit', () => {
    // X (Twitter) has a 280 char limit
    const longText = 'a'.repeat(281);
    const result = validateOptimizationInput(longText, Platform.X);
    expect(result.valid).toBe(false);
    expect(result.error?.code).toBe(ErrorCode.VALIDATION_ERROR);
    expect(result.error?.detail).toContain('280');
  });

  it('returns valid for correct input', () => {
    const result = validateOptimizationInput('Hello world', Platform.LINKEDIN);
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('returns valid for text at exactly the char limit', () => {
    const text = 'a'.repeat(280);
    const result = validateOptimizationInput(text, Platform.X);
    expect(result.valid).toBe(true);
  });
});
