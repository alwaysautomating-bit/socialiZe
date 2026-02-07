import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ResultsDisplay } from '../ResultsDisplay';
import { Platform, Tone, OptimizationResult } from '../../types';

const mockResult: OptimizationResult = {
  platform: Platform.LINKEDIN,
  targetTone: Tone.PROFESSIONAL,
  content: 'Optimized content here',
  hashtags: ['leadership', 'business'],
  rationale: 'Professional tone for LinkedIn audience.',
  charCount: 22,
  analysis: {
    score: 85,
    currentToneDescription: 'Casual and direct',
    feedback: 'Good foundation, needs polish.',
    suggestions: ['Use more formal language', 'Add a call to action'],
  },
};

describe('ResultsDisplay', () => {
  it('renders nothing when no result and not loading', () => {
    const { container } = render(
      <ResultsDisplay result={null} isLoading={false} copied={false} onCopy={vi.fn()} />
    );
    expect(container.innerHTML).toBe('');
  });

  it('shows loading skeleton when loading', () => {
    render(
      <ResultsDisplay result={null} isLoading={true} copied={false} onCopy={vi.fn()} />
    );
    // Loading skeleton renders 3 div lines
    const section = screen.getByText((_, el) => el?.id === 'results-section');
    expect(section).toBeInTheDocument();
  });

  it('displays optimized content', () => {
    render(
      <ResultsDisplay result={mockResult} isLoading={false} copied={false} onCopy={vi.fn()} />
    );
    expect(screen.getByText('Optimized content here')).toBeInTheDocument();
  });

  it('displays hashtags', () => {
    render(
      <ResultsDisplay result={mockResult} isLoading={false} copied={false} onCopy={vi.fn()} />
    );
    expect(screen.getByText('#leadership')).toBeInTheDocument();
    expect(screen.getByText('#business')).toBeInTheDocument();
  });

  it('displays rationale', () => {
    render(
      <ResultsDisplay result={mockResult} isLoading={false} copied={false} onCopy={vi.fn()} />
    );
    expect(screen.getByText('Professional tone for LinkedIn audience.')).toBeInTheDocument();
  });

  it('shows Copy Result button', () => {
    render(
      <ResultsDisplay result={mockResult} isLoading={false} copied={false} onCopy={vi.fn()} />
    );
    expect(screen.getByText('Copy Result')).toBeInTheDocument();
  });

  it('shows Copied to Clipboard when copied', () => {
    render(
      <ResultsDisplay result={mockResult} isLoading={false} copied={true} onCopy={vi.fn()} />
    );
    expect(screen.getByText('Copied to Clipboard')).toBeInTheDocument();
  });

  it('calls onCopy when copy button is clicked', () => {
    const onCopy = vi.fn();
    render(
      <ResultsDisplay result={mockResult} isLoading={false} copied={false} onCopy={onCopy} />
    );

    fireEvent.click(screen.getByText('Copy Result'));
    expect(onCopy).toHaveBeenCalled();
  });

  it('displays tone analysis', () => {
    render(
      <ResultsDisplay result={mockResult} isLoading={false} copied={false} onCopy={vi.fn()} />
    );
    expect(screen.getByText('85%')).toBeInTheDocument();
    expect(screen.getByText('"Casual and direct"')).toBeInTheDocument();
  });
});
