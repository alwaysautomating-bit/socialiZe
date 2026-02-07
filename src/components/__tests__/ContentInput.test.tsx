import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ContentInput } from '../ContentInput';
import { Tone } from '../../types';
import { createAppError, ErrorCode } from '../../services/errors';

describe('ContentInput', () => {
  const defaultProps = {
    inputText: '',
    onInputChange: vi.fn(),
    selectedTone: Tone.PROFESSIONAL,
    onToneChange: vi.fn(),
    error: null,
  };

  it('renders the textarea', () => {
    render(<ContentInput {...defaultProps} />);
    expect(screen.getByPlaceholderText("What's the thought?")).toBeInTheDocument();
  });

  it('displays the input text', () => {
    render(<ContentInput {...defaultProps} inputText="Hello" />);
    expect(screen.getByDisplayValue('Hello')).toBeInTheDocument();
  });

  it('fires onInputChange when typing', () => {
    const onInputChange = vi.fn();
    render(<ContentInput {...defaultProps} onInputChange={onInputChange} />);

    fireEvent.change(screen.getByPlaceholderText("What's the thought?"), {
      target: { value: 'New text' },
    });

    expect(onInputChange).toHaveBeenCalledWith('New text');
  });

  it('shows character count', () => {
    render(<ContentInput {...defaultProps} inputText="Hello" />);
    expect(screen.getByText('5 chars')).toBeInTheDocument();
  });

  it('shows error when present', () => {
    const error = createAppError(ErrorCode.VALIDATION_ERROR, 'Content is required.');
    render(<ContentInput {...defaultProps} error={error} />);
    expect(screen.getByText('Content is required.')).toBeInTheDocument();
  });

  it('shows retry button for retryable errors', () => {
    const error = createAppError(ErrorCode.NETWORK_ERROR, 'Network failed');
    const onRetry = vi.fn();
    render(<ContentInput {...defaultProps} error={error} onRetry={onRetry} />);

    const retryButton = screen.getByText('Retry');
    expect(retryButton).toBeInTheDocument();
    fireEvent.click(retryButton);
    expect(onRetry).toHaveBeenCalled();
  });

  it('does not show retry button for non-retryable errors', () => {
    const error = createAppError(ErrorCode.VALIDATION_ERROR, 'Invalid input');
    render(<ContentInput {...defaultProps} error={error} />);
    expect(screen.queryByText('Retry')).not.toBeInTheDocument();
  });
});
