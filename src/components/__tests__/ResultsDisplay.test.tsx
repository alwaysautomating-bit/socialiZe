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

const defaultProps = {
  result: null as OptimizationResult | null,
  allResults: null as OptimizationResult[] | null,
  activeResultIndex: 0,
  onSelectResult: vi.fn(),
  isLoading: false,
  isLoadingAll: false,
  copied: false,
  onCopy: vi.fn(),
};

describe('ResultsDisplay', () => {
  it('renders nothing when no result and not loading', () => {
    const { container } = render(<ResultsDisplay {...defaultProps} />);
    expect(container.innerHTML).toBe('');
  });

  it('shows loading skeleton when loading', () => {
    render(<ResultsDisplay {...defaultProps} isLoading={true} />);
    const section = screen.getByText((_, el) => el?.id === 'results-section');
    expect(section).toBeInTheDocument();
  });

  it('displays optimized content', () => {
    render(<ResultsDisplay {...defaultProps} result={mockResult} />);
    expect(screen.getByText('Optimized content here')).toBeInTheDocument();
  });

  it('displays hashtags', () => {
    render(<ResultsDisplay {...defaultProps} result={mockResult} />);
    expect(screen.getByText('#leadership')).toBeInTheDocument();
    expect(screen.getByText('#business')).toBeInTheDocument();
  });

  it('displays rationale', () => {
    render(<ResultsDisplay {...defaultProps} result={mockResult} />);
    expect(screen.getByText('Professional tone for LinkedIn audience.')).toBeInTheDocument();
  });

  it('shows Copy button', () => {
    render(<ResultsDisplay {...defaultProps} result={mockResult} />);
    expect(screen.getByText('Copy')).toBeInTheDocument();
  });

  it('shows Copied when copied', () => {
    render(<ResultsDisplay {...defaultProps} result={mockResult} copied={true} />);
    expect(screen.getByText('Copied')).toBeInTheDocument();
  });

  it('calls onCopy when copy button is clicked', () => {
    const onCopy = vi.fn();
    render(<ResultsDisplay {...defaultProps} result={mockResult} onCopy={onCopy} />);

    fireEvent.click(screen.getByText('Copy'));
    expect(onCopy).toHaveBeenCalled();
  });

  it('displays tone analysis', () => {
    render(<ResultsDisplay {...defaultProps} result={mockResult} />);
    expect(screen.getByText('85%')).toBeInTheDocument();
    expect(screen.getByText('"Casual and direct"')).toBeInTheDocument();
  });

  it('shows platform tab strip when allResults provided', () => {
    const allResults = [mockResult, { ...mockResult, platform: Platform.X }];
    render(
      <ResultsDisplay
        {...defaultProps}
        allResults={allResults}
        activeResultIndex={0}
      />
    );
    expect(screen.getByText('2 platforms generated — select to view')).toBeInTheDocument();
  });
});
