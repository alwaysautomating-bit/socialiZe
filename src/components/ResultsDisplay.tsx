import React from 'react';
import { OptimizationResult } from '../types';
import { ToneAnalysisDisplay } from './ToneAnalysisDisplay';
import { LoadingSkeleton } from './LoadingSkeleton';

interface ResultsDisplayProps {
  result: OptimizationResult | null;
  isLoading: boolean;
  copied: boolean;
  onCopy: () => void;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  result,
  isLoading,
  copied,
  onCopy,
}) => {
  if (!result && !isLoading) return null;

  return (
    <section id="results-section" aria-live="polite" className="pt-32 border-t border-ink-black/5 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-16">
        <div className="md:col-span-7 space-y-16">
          {isLoading ? (
            <LoadingSkeleton />
          ) : result ? (
            <div className="space-y-16">
              <div className="serif text-3xl leading-relaxed whitespace-pre-wrap">
                {result.content}
              </div>

              <div className="flex flex-wrap gap-4 opacity-40">
                {result.hashtags.map((tag, idx) => (
                  <span key={idx} className="text-[10px] mono uppercase tracking-widest">
                    #{tag.replace('#', '')}
                  </span>
                ))}
              </div>

              <div className="space-y-10 pt-8 border-t border-ink-black/5">
                <div className="text-[11px] opacity-20 leading-relaxed italic serif max-w-md flex gap-4">
                  <span className="mono uppercase text-[9px] not-italic font-bold tracking-[0.2em]">Logic</span>
                  {result.rationale}
                </div>
                <button
                  onClick={onCopy}
                  aria-label={copied ? 'Copied to clipboard' : 'Copy result to clipboard'}
                  className={`
                    px-16 py-5 text-[10px] font-bold uppercase tracking-[0.3em] transition-all border
                    ${copied
                      ? 'bg-blue-50 text-blue-600 border-blue-200'
                      : 'bg-transparent border-ink-black hover:bg-ink-black hover:text-white'}
                  `}
                >
                  {copied ? 'Copied to Clipboard' : 'Copy Result'}
                </button>
              </div>
            </div>
          ) : null}
        </div>

        <div className="md:col-span-5">
          {result && !isLoading && <ToneAnalysisDisplay analysis={result.analysis} />}
        </div>
      </div>
    </section>
  );
};
