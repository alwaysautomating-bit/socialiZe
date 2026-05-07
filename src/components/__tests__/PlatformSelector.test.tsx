import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PlatformSelector } from '../PlatformSelector';
import { Platform } from '../../types';

describe('PlatformSelector', () => {
  const defaultProps = {
    selectedPlatform: null as Platform | null,
    onPlatformSelect: vi.fn(),
    onOptimize: vi.fn(),
    onOptimizeAll: vi.fn(),
    isLoading: false,
    isLoadingAll: false,
    canOptimize: false,
    canOptimizeAll: false,
  };

  it('renders all platform buttons', () => {
    render(<PlatformSelector {...defaultProps} />);

    expect(screen.getByText('LinkedIn')).toBeInTheDocument();
    expect(screen.getByText('X (Twitter)')).toBeInTheDocument();
    expect(screen.getByText('Instagram')).toBeInTheDocument();
    expect(screen.getByText('Facebook')).toBeInTheDocument();
    expect(screen.getByText('TikTok')).toBeInTheDocument();
    expect(screen.getByText('YouTube')).toBeInTheDocument();
  });

  it('calls onPlatformSelect when a platform is clicked', () => {
    const onPlatformSelect = vi.fn();
    render(<PlatformSelector {...defaultProps} onPlatformSelect={onPlatformSelect} />);

    fireEvent.click(screen.getByText('LinkedIn'));
    expect(onPlatformSelect).toHaveBeenCalledWith(Platform.LINKEDIN);
  });

  it('renders the primary action button', () => {
    render(<PlatformSelector {...defaultProps} />);
    expect(screen.getByRole('button', { name: 'Select a Platform' })).toBeInTheDocument();
  });

  it('disables the primary action button when canOptimize is false', () => {
    render(<PlatformSelector {...defaultProps} canOptimize={false} />);
    expect(screen.getByRole('button', { name: 'Select a Platform' })).toBeDisabled();
  });

  it('enables the primary action button when canOptimize is true', () => {
    render(
      <PlatformSelector
        {...defaultProps}
        selectedPlatform={Platform.LINKEDIN}
        canOptimize={true}
      />
    );
    expect(screen.getByRole('button', { name: 'socialiZe → LinkedIn' })).toBeEnabled();
  });

  it('shows Processing text when loading', () => {
    render(
      <PlatformSelector
        {...defaultProps}
        selectedPlatform={Platform.LINKEDIN}
        isLoading={true}
        canOptimize={false}
      />
    );
    expect(screen.getByText('Processing...')).toBeInTheDocument();
  });

  it('calls onOptimize when the primary action button is clicked', () => {
    const onOptimize = vi.fn();
    render(
      <PlatformSelector
        {...defaultProps}
        selectedPlatform={Platform.LINKEDIN}
        canOptimize={true}
        onOptimize={onOptimize}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'socialiZe → LinkedIn' }));
    expect(onOptimize).toHaveBeenCalled();
  });
});
