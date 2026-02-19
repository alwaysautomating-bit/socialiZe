import React from 'react';
import { Tone } from '../types';
import { AppError } from '../services/errors';
import { ToneSelector } from './ToneSelector';
import { ErrorMessage } from './ErrorMessage';

interface ContentInputProps {
  inputText: string;
  onInputChange: (text: string) => void;
  selectedTone: Tone;
  onToneChange: (tone: Tone) => void;
  error: AppError | null;
  onRetry?: () => void;
}

export const ContentInput: React.FC<ContentInputProps> = ({
  inputText,
  onInputChange,
  selectedTone,
  onToneChange,
  error,
  onRetry,
}) => {
  return (
    <section className="space-y-4 ink-dry ink-dry-2">
      <div className="relative rounded-sm shadow-sm overflow-hidden">
        {/* Binding holes strip */}
        <div
          className="absolute left-0 top-0 bottom-0 w-10 z-10 pointer-events-none flex flex-col justify-around items-center py-6"
          style={{ background: 'rgba(240, 237, 220, 0.7)' }}
          aria-hidden="true"
        >
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              className="w-3 h-3 rounded-full"
              style={{
                border: '1px solid #D0CBB0',
                background: 'radial-gradient(circle at 40% 35%, #fff 30%, #e8e4d4 100%)',
                boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.12)',
              }}
            />
          ))}
        </div>

        {/* Notebook paper textarea */}
        <textarea
          aria-label="Content to optimize"
          className="notebook-paper w-full min-h-[40vh] bg-transparent focus:outline-none resize-none serif text-xl leading-8 placeholder:opacity-15"
          style={{ paddingLeft: '3.5rem', paddingRight: '1.5rem', paddingTop: '8px', paddingBottom: '1rem' }}
          placeholder="What's the thought?"
          value={inputText}
          onChange={(e) => onInputChange(e.target.value)}
          autoFocus
        />

        {error && (
          <div className="absolute bottom-2" style={{ left: '3.5rem' }}>
            <ErrorMessage error={error} onRetry={onRetry} />
          </div>
        )}
      </div>

      <div className="flex items-center justify-between" style={{ paddingLeft: '3.5rem' }}>
        <ToneSelector selectedTone={selectedTone} onSelect={onToneChange} />
        <div className="text-[10px] mono uppercase tracking-widest opacity-20">
          {inputText.length} chars
        </div>
      </div>
    </section>
  );
};
