import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ToneAnalysisDisplay } from '../ToneAnalysisDisplay';

const mockAnalysis = {
  score: 72,
  currentToneDescription: 'Warm and conversational',
  feedback: 'The tone matches the target audience well.',
  suggestions: ['Shorten the opening hook', 'Add a stronger CTA'],
};

describe('ToneAnalysisDisplay', () => {
  it('displays the score', () => {
    render(<ToneAnalysisDisplay analysis={mockAnalysis} />);
    expect(screen.getByText('72%')).toBeInTheDocument();
  });

  it('displays the tone description', () => {
    render(<ToneAnalysisDisplay analysis={mockAnalysis} />);
    expect(screen.getByText('"Warm and conversational"')).toBeInTheDocument();
  });

  it('displays the feedback', () => {
    render(<ToneAnalysisDisplay analysis={mockAnalysis} />);
    expect(screen.getByText('The tone matches the target audience well.')).toBeInTheDocument();
  });

  it('displays suggestions with numbered labels', () => {
    render(<ToneAnalysisDisplay analysis={mockAnalysis} />);
    expect(screen.getByText('Shorten the opening hook')).toBeInTheDocument();
    expect(screen.getByText('Add a stronger CTA')).toBeInTheDocument();
    expect(screen.getByText('/01')).toBeInTheDocument();
    expect(screen.getByText('/02')).toBeInTheDocument();
  });

  it('renders Resonance heading', () => {
    render(<ToneAnalysisDisplay analysis={mockAnalysis} />);
    expect(screen.getByText('Resonance')).toBeInTheDocument();
  });

  it('renders Critique heading', () => {
    render(<ToneAnalysisDisplay analysis={mockAnalysis} />);
    expect(screen.getByText('Critique')).toBeInTheDocument();
  });

  it('renders Drafting Notes heading', () => {
    render(<ToneAnalysisDisplay analysis={mockAnalysis} />);
    expect(screen.getByText('Drafting Notes')).toBeInTheDocument();
  });
});
