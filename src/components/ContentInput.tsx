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
      <div className="relative border-2 border-ink-black/15 hover:border-ink-black/30 focus-within:border-ink-black/50 transition-colors duration-200">
        <textarea
          aria-label="Content to optimize"
          className="w-full min-h-[40vh] bg-transparent focus:outline-none resize-none serif text-xl leading-8 placeholder:opacity-20 px-6 pt-5 pb-4"
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

      <div className="flex items-center justify-between px-1">
        <ToneSelector selectedTone={selectedTone} onSelect={onToneChange} />
        <div className="text-[10px] mono uppercase tracking-widest opacity-20">
          {inputText.length} chars
        </div>
      </div>
    </section>
  );
};
