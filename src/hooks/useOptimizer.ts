import { useReducer, useCallback } from 'react';
import { Platform, Tone, OptimizationResult } from '../types';
import { optimizeContent } from '../services/gemini';
import { validateOptimizationInput } from '../utils/validation';
import { AppError } from '../services/errors';

interface OptimizerState {
  inputText: string;
  selectedPlatform: Platform | null;
  selectedTone: Tone;
  isLoading: boolean;
  result: OptimizationResult | null;
  error: AppError | null;
}

type OptimizerAction =
  | { type: 'SET_INPUT'; payload: string }
  | { type: 'SET_PLATFORM'; payload: Platform }
  | { type: 'SET_TONE'; payload: Tone }
  | { type: 'OPTIMIZE_START' }
  | { type: 'OPTIMIZE_SUCCESS'; payload: OptimizationResult }
  | { type: 'OPTIMIZE_ERROR'; payload: AppError }
  | { type: 'CLEAR_ERROR' };

const initialState: OptimizerState = {
  inputText: '',
  selectedPlatform: null,
  selectedTone: Tone.PROFESSIONAL,
  isLoading: false,
  result: null,
  error: null,
};

function reducer(state: OptimizerState, action: OptimizerAction): OptimizerState {
  switch (action.type) {
    case 'SET_INPUT':
      return { ...state, inputText: action.payload };
    case 'SET_PLATFORM':
      return { ...state, selectedPlatform: action.payload };
    case 'SET_TONE':
      return { ...state, selectedTone: action.payload };
    case 'OPTIMIZE_START':
      return { ...state, isLoading: true, error: null, result: null };
    case 'OPTIMIZE_SUCCESS':
      return { ...state, isLoading: false, result: action.payload };
    case 'OPTIMIZE_ERROR':
      return { ...state, isLoading: false, error: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
  }
}

export function useOptimizer() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setInputText = useCallback((text: string) => {
    dispatch({ type: 'SET_INPUT', payload: text });
  }, []);

  const setSelectedPlatform = useCallback((platform: Platform) => {
    dispatch({ type: 'SET_PLATFORM', payload: platform });
  }, []);

  const setSelectedTone = useCallback((tone: Tone) => {
    dispatch({ type: 'SET_TONE', payload: tone });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const handleOptimize = useCallback(async () => {
    const validation = validateOptimizationInput(state.inputText, state.selectedPlatform);
    if (!validation.valid) {
      dispatch({ type: 'OPTIMIZE_ERROR', payload: validation.error! });
      return;
    }

    dispatch({ type: 'OPTIMIZE_START' });

    try {
      const result = await optimizeContent(
        state.inputText,
        state.selectedPlatform!,
        state.selectedTone
      );
      dispatch({ type: 'OPTIMIZE_SUCCESS', payload: result });
      setTimeout(() => {
        document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    } catch (err) {
      dispatch({ type: 'OPTIMIZE_ERROR', payload: err as AppError });
    }
  }, [state.inputText, state.selectedPlatform, state.selectedTone]);

  const canOptimize = !state.isLoading && !!state.selectedPlatform && !!state.inputText.trim();

  return {
    state,
    setInputText,
    setSelectedPlatform,
    setSelectedTone,
    handleOptimize,
    clearError,
    canOptimize,
  };
}
