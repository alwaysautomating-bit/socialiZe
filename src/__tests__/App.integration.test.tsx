import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { Platform, Tone } from '../types';
import { ErrorCode } from '../services/errors';

vi.mock('../services/gemini', () => ({
  optimizeContent: vi.fn(),
}));

describe('App integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the main UI elements', () => {
    render(<App />);

    expect(screen.getByPlaceholderText("What's the thought?")).toBeInTheDocument();
    expect(screen.getByText('LinkedIn')).toBeInTheDocument();
    expect(screen.getByText('Socialize')).toBeInTheDocument();
    expect(screen.getByText('Voice:')).toBeInTheDocument();
  });

  it('happy path: type text, select platform, optimize, see results', async () => {
    const { optimizeContent } = await import('../services/gemini');
    const mockResult = {
      platform: Platform.LINKEDIN,
      targetTone: Tone.PROFESSIONAL,
      content: 'Professional thought leadership post.',
      hashtags: ['leadership', 'growth'],
      rationale: 'Formatted for LinkedIn readability.',
      charCount: 37,
      analysis: {
        score: 90,
        currentToneDescription: 'Confident and clear',
        feedback: 'Strong opening, good flow.',
        suggestions: ['Add a question at the end', 'Break into shorter paragraphs'],
      },
    };
    vi.mocked(optimizeContent).mockResolvedValueOnce(mockResult);

    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByPlaceholderText("What's the thought?"), 'My raw thought');
    await user.click(screen.getByText('LinkedIn'));
    await user.click(screen.getByText('Socialize'));

    await waitFor(() => {
      expect(screen.getByText('Professional thought leadership post.')).toBeInTheDocument();
    });

    expect(screen.getByText('#leadership')).toBeInTheDocument();
    expect(screen.getByText('#growth')).toBeInTheDocument();
    expect(screen.getByText('90%')).toBeInTheDocument();
  });

  it('validation: button is disabled when no text is entered', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Select platform but don't type text
    await user.click(screen.getByText('Instagram'));

    // Socialize button should be disabled
    expect(screen.getByText('Socialize')).toBeDisabled();
  });

  it('validation: button is disabled when no platform is selected', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Type text but don't select platform
    await user.type(screen.getByPlaceholderText("What's the thought?"), 'Some text');

    // Socialize button should be disabled
    expect(screen.getByText('Socialize')).toBeDisabled();
  });

  it('API error: shows error with retry option', async () => {
    const { optimizeContent } = await import('../services/gemini');
    vi.mocked(optimizeContent).mockRejectedValueOnce({
      code: ErrorCode.NETWORK_ERROR,
      message: 'Network error. Check your connection and try again.',
      detail: 'fetch failed',
      retryable: true,
    });

    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByPlaceholderText("What's the thought?"), 'Test content');
    await user.click(screen.getByText('X (Twitter)'));
    await user.click(screen.getByText('Socialize'));

    await waitFor(() => {
      expect(screen.getByText('fetch failed')).toBeInTheDocument();
    });

    expect(screen.getByText('Retry')).toBeInTheDocument();
  });
});
