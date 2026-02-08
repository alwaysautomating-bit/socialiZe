import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PlatformCard } from '../PlatformCard';
import { Platform } from '../../types';

describe('PlatformCard', () => {
  const config = {
    id: Platform.LINKEDIN,
    maxChars: 3000,
    icon: '💼',
    description: 'Professional, insight-driven.',
  };

  it('renders platform name', () => {
    render(<PlatformCard config={config} isActive={false} onClick={vi.fn()} />);
    expect(screen.getByText('LinkedIn')).toBeInTheDocument();
  });

  it('applies active styles when isActive is true', () => {
    render(<PlatformCard config={config} isActive={true} onClick={vi.fn()} />);
    const button = screen.getByText('LinkedIn');
    expect(button.className).toContain('bg-edit-red');
    expect(button.className).toContain('text-white');
  });

  it('applies inactive styles when isActive is false', () => {
    render(<PlatformCard config={config} isActive={false} onClick={vi.fn()} />);
    const button = screen.getByText('LinkedIn');
    expect(button.className).not.toContain('bg-edit-red');
  });

  it('calls onClick when clicked', () => {
    const onClick = vi.fn();
    render(<PlatformCard config={config} isActive={false} onClick={onClick} />);

    fireEvent.click(screen.getByText('LinkedIn'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
