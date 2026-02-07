import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ToneSelector } from '../ToneSelector';
import { Tone } from '../../types';

describe('ToneSelector', () => {
  it('renders the Voice label', () => {
    render(<ToneSelector selectedTone={Tone.PROFESSIONAL} onSelect={vi.fn()} />);
    expect(screen.getByText('Voice:')).toBeInTheDocument();
  });

  it('renders all tone options', () => {
    render(<ToneSelector selectedTone={Tone.PROFESSIONAL} onSelect={vi.fn()} />);
    const select = screen.getByRole('combobox');
    const options = select.querySelectorAll('option');
    expect(options).toHaveLength(5);
  });

  it('shows selected tone', () => {
    render(<ToneSelector selectedTone={Tone.HUMOROUS} onSelect={vi.fn()} />);
    const select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select.value).toBe(Tone.HUMOROUS);
  });

  it('calls onSelect when tone changes', () => {
    const onSelect = vi.fn();
    render(<ToneSelector selectedTone={Tone.PROFESSIONAL} onSelect={onSelect} />);

    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: Tone.FRIENDLY },
    });

    expect(onSelect).toHaveBeenCalledWith(Tone.FRIENDLY);
  });
});
