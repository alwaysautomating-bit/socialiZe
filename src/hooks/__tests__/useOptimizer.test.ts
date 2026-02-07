import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useOptimizer } from '../useOptimizer';
import { Platform, Tone } from '../../types';
import { ErrorCode } from '../../services/errors';

vi.mock('../../services/gemini', () => ({
  optimizeContent: vi.fn(),
}));

describe('useOptimizer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('has correct initial state', () => {
    const { result } = renderHook(() => useOptimizer());

    expect(result.current.state.inputText).toBe('');
    expect(result.current.state.selectedPlatform).toBeNull();
    expect(result.current.state.selectedTone).toBe(Tone.PROFESSIONAL);
    expect(result.current.state.isLoading).toBe(false);
    expect(result.current.state.result).toBeNull();
    expect(result.current.state.error).toBeNull();
    expect(result.current.canOptimize).toBe(false);
  });

  it('updates inputText', () => {
    const { result } = renderHook(() => useOptimizer());

    act(() => {
      result.current.setInputText('Hello world');
    });

    expect(result.current.state.inputText).toBe('Hello world');
  });

  it('updates selectedPlatform', () => {
    const { result } = renderHook(() => useOptimizer());

    act(() => {
      result.current.setSelectedPlatform(Platform.LINKEDIN);
    });

    expect(result.current.state.selectedPlatform).toBe(Platform.LINKEDIN);
  });

  it('updates selectedTone', () => {
    const { result } = renderHook(() => useOptimizer());

    act(() => {
      result.current.setSelectedTone(Tone.HUMOROUS);
    });

    expect(result.current.state.selectedTone).toBe(Tone.HUMOROUS);
  });

  it('canOptimize is true when text and platform are set', () => {
    const { result } = renderHook(() => useOptimizer());

    act(() => {
      result.current.setInputText('Hello');
      result.current.setSelectedPlatform(Platform.X);
    });

    expect(result.current.canOptimize).toBe(true);
  });

  it('canOptimize is false with no text', () => {
    const { result } = renderHook(() => useOptimizer());

    act(() => {
      result.current.setSelectedPlatform(Platform.X);
    });

    expect(result.current.canOptimize).toBe(false);
  });

  it('canOptimize is false with no platform', () => {
    const { result } = renderHook(() => useOptimizer());

    act(() => {
      result.current.setInputText('Hello');
    });

    expect(result.current.canOptimize).toBe(false);
  });

  it('shows validation error when optimizing with empty text', async () => {
    const { result } = renderHook(() => useOptimizer());

    act(() => {
      result.current.setSelectedPlatform(Platform.LINKEDIN);
    });

    await act(async () => {
      await result.current.handleOptimize();
    });

    expect(result.current.state.error?.code).toBe(ErrorCode.VALIDATION_ERROR);
    expect(result.current.state.isLoading).toBe(false);
  });

  it('shows validation error when optimizing with no platform', async () => {
    const { result } = renderHook(() => useOptimizer());

    act(() => {
      result.current.setInputText('Hello world');
    });

    await act(async () => {
      await result.current.handleOptimize();
    });

    expect(result.current.state.error?.code).toBe(ErrorCode.VALIDATION_ERROR);
  });

  it('handles successful optimization', async () => {
    const { optimizeContent } = await import('../../services/gemini');
    const mockResult = {
      platform: Platform.LINKEDIN,
      targetTone: Tone.PROFESSIONAL,
      content: 'Optimized',
      hashtags: ['test'],
      rationale: 'Good',
      charCount: 9,
      analysis: {
        score: 80,
        currentToneDescription: 'Casual',
        feedback: 'Nice',
        suggestions: ['Improve'],
      },
    };
    vi.mocked(optimizeContent).mockResolvedValueOnce(mockResult);

    const { result } = renderHook(() => useOptimizer());

    act(() => {
      result.current.setInputText('Hello world');
      result.current.setSelectedPlatform(Platform.LINKEDIN);
    });

    await act(async () => {
      await result.current.handleOptimize();
    });

    expect(result.current.state.result).toEqual(mockResult);
    expect(result.current.state.isLoading).toBe(false);
    expect(result.current.state.error).toBeNull();
  });

  it('handles API error', async () => {
    const { optimizeContent } = await import('../../services/gemini');
    const appError = {
      code: ErrorCode.NETWORK_ERROR,
      message: 'Network error',
      retryable: true,
    };
    vi.mocked(optimizeContent).mockRejectedValueOnce(appError);

    const { result } = renderHook(() => useOptimizer());

    act(() => {
      result.current.setInputText('Hello world');
      result.current.setSelectedPlatform(Platform.LINKEDIN);
    });

    await act(async () => {
      await result.current.handleOptimize();
    });

    expect(result.current.state.error).toEqual(appError);
    expect(result.current.state.isLoading).toBe(false);
  });

  it('clears error', async () => {
    const { result } = renderHook(() => useOptimizer());

    act(() => {
      result.current.setSelectedPlatform(Platform.LINKEDIN);
    });

    await act(async () => {
      await result.current.handleOptimize();
    });

    expect(result.current.state.error).not.toBeNull();

    act(() => {
      result.current.clearError();
    });

    expect(result.current.state.error).toBeNull();
  });
});
