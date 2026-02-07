import { describe, it, expect } from 'vitest';
import { createAppError, ErrorCode } from '../errors';

describe('createAppError', () => {
  it('returns correct message for NETWORK_ERROR', () => {
    const err = createAppError(ErrorCode.NETWORK_ERROR);
    expect(err.code).toBe(ErrorCode.NETWORK_ERROR);
    expect(err.message).toBe('Network error. Check your connection and try again.');
    expect(err.retryable).toBe(true);
  });

  it('returns correct message for API_KEY_INVALID', () => {
    const err = createAppError(ErrorCode.API_KEY_INVALID);
    expect(err.code).toBe(ErrorCode.API_KEY_INVALID);
    expect(err.message).toBe('Invalid API key. Check your configuration.');
    expect(err.retryable).toBe(false);
  });

  it('returns correct message for RATE_LIMITED', () => {
    const err = createAppError(ErrorCode.RATE_LIMITED);
    expect(err.code).toBe(ErrorCode.RATE_LIMITED);
    expect(err.retryable).toBe(true);
  });

  it('returns correct message for RESPONSE_PARSE_ERROR', () => {
    const err = createAppError(ErrorCode.RESPONSE_PARSE_ERROR);
    expect(err.retryable).toBe(true);
  });

  it('returns correct message for EMPTY_RESPONSE', () => {
    const err = createAppError(ErrorCode.EMPTY_RESPONSE);
    expect(err.retryable).toBe(true);
  });

  it('returns correct message for VALIDATION_ERROR', () => {
    const err = createAppError(ErrorCode.VALIDATION_ERROR);
    expect(err.retryable).toBe(false);
  });

  it('returns correct message for CLIPBOARD_ERROR', () => {
    const err = createAppError(ErrorCode.CLIPBOARD_ERROR);
    expect(err.retryable).toBe(false);
  });

  it('returns correct message for UNKNOWN_ERROR', () => {
    const err = createAppError(ErrorCode.UNKNOWN_ERROR);
    expect(err.retryable).toBe(true);
  });

  it('includes detail when provided', () => {
    const err = createAppError(ErrorCode.NETWORK_ERROR, 'fetch failed');
    expect(err.detail).toBe('fetch failed');
  });

  it('has undefined detail when not provided', () => {
    const err = createAppError(ErrorCode.NETWORK_ERROR);
    expect(err.detail).toBeUndefined();
  });
});
