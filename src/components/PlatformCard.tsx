import React from 'react';
import { PlatformConfig } from '../types';

interface PlatformCardProps {
  config: PlatformConfig;
  isActive: boolean;
  onClick: () => void;
}

export const PlatformCard: React.FC<PlatformCardProps> = ({ config, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      aria-pressed={isActive}
      aria-label={`Select ${config.id} platform`}
      className={`
        px-5 py-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-200 border-2
        ${isActive
          ? 'bg-edit-red border-edit-red text-white shadow-sm'
          : 'bg-transparent border-ink-black/20 text-ink-black/50 hover:border-ink-black hover:text-ink-black hover:bg-ink-black/5'}
      `}
    >
      {config.id}
    </button>
  );
};
