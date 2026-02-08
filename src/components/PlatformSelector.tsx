import React from 'react';
import { Platform } from '../types';
import { PLATFORMS } from '../constants';
import { PlatformCard } from './PlatformCard';

interface PlatformSelectorProps {
  selectedPlatform: Platform | null;
  onPlatformSelect: (platform: Platform) => void;
  onOptimize: () => void;
  isLoading: boolean;
  canOptimize: boolean;
}

export const PlatformSelector: React.FC<PlatformSelectorProps> = ({
  selectedPlatform,
  onPlatformSelect,
  onOptimize,
  isLoading,
  canOptimize,
}) => {
  return (
    <section className="pt-8 flex flex-col items-center gap-12 ink-dry ink-dry-3">
      <div role="group" aria-label="Social media platforms" className="flex flex-wrap justify-center gap-px">
        {PLATFORMS.map((platform) => (
          <PlatformCard
            key={platform.id}
            config={platform}
            isActive={selectedPlatform === platform.id}
            onClick={() => onPlatformSelect(platform.id)}
          />
        ))}
      </div>

      <button
        onClick={onOptimize}
        disabled={!canOptimize}
        className={`
          w-full max-w-sm py-6 text-[11px] font-bold uppercase tracking-[0.5em] transition-all duration-500
          ${!selectedPlatform
            ? 'bg-transparent border border-ink-black/10 text-ink-black/30 cursor-not-allowed'
            : !canOptimize
              ? 'bg-ink-black/10 text-ink-black/30 cursor-not-allowed'
              : 'bg-edit-red text-white hover:bg-edit-red/90 shadow-lg shadow-edit-red/10 active:scale-95'}
        `}
      >
        {isLoading ? 'Processing...' : 'Socialize'}
      </button>
    </section>
  );
};
