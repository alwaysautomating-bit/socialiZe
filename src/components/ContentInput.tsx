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
    <section className="space-y-4">
      <div className="relative group">
        <textarea
          aria-label="Content to optimize"
          className="w-full min-h-[40vh] bg-transparent border-b border-ink-black/10 focus:border-ink-black p-0 serif text-3xl leading-relaxed focus:outline-none placeholder:opacity-10 resize-none transition-all"
          placeholder="What's the thought?"
          value={inputText}
          onChange={(e) => onInputChange(e.target.value)}
          autoFocus
        />
        {error && (
          <div className="absolute -bottom-6 left-0">
            <ErrorMessage error={error} onRetry={onRetry} />
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <ToneSelector selectedTone={selectedTone} onSelect={onToneChange} />
        <div className="text-[10px] mono uppercase tracking-widest opacity-20">
          {inputText.length} chars
        </div>
      </div>
    </section>
  );
};
