import React, { useState, useCallback } from 'react';
import { Platform } from '../types';
import { PLATFORMS } from '../constants';
import { PlatformCard } from './PlatformCard';

interface PlatformSelectorProps {
  selectedPlatform: Platform | null;
  onPlatformSelect: (platform: Platform) => void;
  onOptimize: () => void;
  onOptimizeAll: () => void;
  isLoading: boolean;
  isLoadingAll: boolean;
  canOptimize: boolean;
  canOptimizeAll: boolean;
}

export const PlatformSelector: React.FC<PlatformSelectorProps> = ({
  selectedPlatform,
  onPlatformSelect,
  onOptimize,
  onOptimizeAll,
  isLoading,
  isLoadingAll,
  canOptimize,
  canOptimizeAll,
}) => {
  const anyLoading = isLoading || isLoadingAll;
  const [penActive, setPenActive] = useState(false);

  const handleOptimize = useCallback(() => {
    if (canOptimize && !anyLoading) {
      setPenActive(true);
      setTimeout(() => setPenActive(false), 900);
      onOptimize();
    }
  }, [canOptimize, anyLoading, onOptimize]);

  return (
    <section className="ink-dry ink-dry-3">
      {/* Editorial instruction callout */}
      <div className="py-5 mb-10">
        <div className="relative inline-flex items-center gap-2">
          <p className="text-base font-light tracking-[0.06em]">
            select platform. get
          </p>
          <div className="h-12 flex-shrink-0 overflow-hidden">
            <img src="/bigZlogo.png" alt="socialiZe" className="h-[162px] w-auto -mt-[18px]" />
          </div>
          {penActive && (
            <span className="pen-strike absolute -bottom-1 left-0 h-[2px] bg-edit-red" />
          )}
        </div>
      </div>

      {/* Platform grid — 2 cols on mobile, 3 cols on sm+ */}
      <div role="group" aria-label="Social media platforms" className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-10">
        {PLATFORMS.map((platform) => (
          <PlatformCard
            key={platform.id}
            config={platform}
            isActive={selectedPlatform === platform.id}
            onClick={() => onPlatformSelect(platform.id)}
          />
        ))}
      </div>

      {/* Action buttons — centered, stacked */}
      <div className="flex flex-col items-center gap-3">
        {/* Single platform button */}
        <button
          onClick={handleOptimize}
          disabled={!canOptimize || anyLoading}
          className={`
            w-full max-w-sm py-3 text-[11px] font-black uppercase tracking-[0.35em] transition-all duration-300 border-2
            ${canOptimize && !anyLoading
              ? 'bg-edit-red border-edit-red text-white hover:bg-ink-black hover:border-ink-black active:scale-[0.98]'
              : 'bg-transparent border-ink-black/15 text-ink-black/25 cursor-not-allowed'}
          `}
        >
          {isLoading
            ? 'Processing...'
            : selectedPlatform
              ? `socialiZe → ${selectedPlatform}`
              : 'Select a Platform'}
        </button>

        {/* Generate all platforms button */}
        <button
          onClick={onOptimizeAll}
          disabled={!canOptimizeAll || anyLoading}
          className={`
            w-full max-w-sm py-3 text-[10px] font-black uppercase tracking-[0.25em] transition-all duration-300 border-2
            ${canOptimizeAll && !anyLoading
              ? 'bg-ink-black border-ink-black text-white hover:bg-edit-red hover:border-edit-red active:scale-[0.98]'
              : 'bg-transparent border-ink-black/15 text-ink-black/25 cursor-not-allowed'}
          `}
        >
          {isLoadingAll ? 'Generating All...' : 'socialiZe Everything'}
        </button>
      </div>
    </section>
  );
};
