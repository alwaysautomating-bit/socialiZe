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
        {/* Textarea */}
        <textarea
          aria-label="Content to optimize"
          className="w-full min-h-[40vh] bg-transparent focus:outline-none resize-none serif text-xl leading-8 placeholder:opacity-15"
          style={{ paddingLeft: '1.5rem', paddingRight: '1.5rem', paddingTop: '8px', paddingBottom: '1rem' }}
          placeholder="What's the thought?"
          value={inputText}
          onChange={(e) => onInputChange(e.target.value)}
          autoFocus
        />

        {error && (
          <div className="absolute bottom-2 left-6">
            <ErrorMessage error={error} onRetry={onRetry} />
          </div>
        )}
      </div>

      <div className="flex items-center justify-between" style={{ paddingLeft: '1.5rem' }}>
        <ToneSelector selectedTone={selectedTone} onSelect={onToneChange} />
        <div className="text-[10px] mono uppercase tracking-widest opacity-20">
          {inputText.length} chars
        </div>
      </div>
    </section>
  );
};
