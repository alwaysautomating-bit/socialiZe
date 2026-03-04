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
        w-full px-6 py-2 text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300
        ${isActive
          ? 'bg-edit-red text-white shadow-sm scale-105'
          : 'text-ink-black/50 hover:text-ink-black/80'}
      `}
    >
      {config.id}
    </button>
  );
};
