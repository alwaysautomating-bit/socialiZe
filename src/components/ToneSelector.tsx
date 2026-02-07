import React from 'react';
import { Tone } from '../types';
import { TONES } from '../constants';

interface ToneSelectorProps {
  selectedTone: Tone;
  onSelect: (tone: Tone) => void;
}

export const ToneSelector: React.FC<ToneSelectorProps> = ({ selectedTone, onSelect }) => {
  return (
    <div className="flex items-center gap-2 text-[11px] mono uppercase tracking-widest opacity-30 hover:opacity-80 transition-opacity">
      <label htmlFor="tone-select">Voice:</label>
      <div className="relative group flex items-center">
        <select
          id="tone-select"
          value={selectedTone}
          onChange={(e) => onSelect(e.target.value as Tone)}
          className="appearance-none bg-transparent border-none pr-4 focus:outline-none cursor-pointer font-bold text-ink-black"
        >
          {TONES.map((tone) => (
            <option key={tone.id} value={tone.id} className="bg-[#FDFCF0]">
              {tone.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute right-0 flex items-center">
          <svg className="h-2 w-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
};