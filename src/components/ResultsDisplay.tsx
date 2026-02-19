import React from 'react';
import { OptimizationResult } from '../types';
import { LoadingSkeleton } from './LoadingSkeleton';

interface ResultsDisplayProps {
  result: OptimizationResult | null;
  isLoading: boolean;
  copied: boolean;
  onCopy: () => void;
}

/* ── Reusable field label ───────────────────────────────────── */
const FieldLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="block text-[8px] mono uppercase tracking-[0.25em] opacity-40 mb-1">
    {children}
  </span>
);

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  result,
  isLoading,
  copied,
  onCopy,
}) => {
  if (!result && !isLoading) return null;

  return (
    <section
      id="results-section"
      aria-live="polite"
      className="pt-32 animate-in fade-in slide-in-from-bottom-4 duration-1000"
    >
      {/* ── Archive card ───────────────────────────────────────── */}
      <div
        className="border border-ink-black/80"
        style={{ background: '#F4F0E0' }}
      >

        {/* ── Row 1: Header ──────────────────────────────────── */}
        <div className="flex items-stretch border-b border-ink-black/80">
          {/* Diagonal corner mark */}
          <div className="px-3 py-3 border-r border-ink-black/80 flex items-center justify-center select-none opacity-40">
            <span className="mono text-base leading-none" aria-hidden="true">/</span>
          </div>

          {/* Platform name */}
          <div className="flex-1 px-5 py-3 flex items-center gap-3">
            <FieldLabel>Platform</FieldLabel>
            <span className="mono text-sm font-bold uppercase tracking-[0.2em]">
              {result?.platform ?? ''}
            </span>
          </div>

          {/* Institution stamp */}
          <div className="border-l border-ink-black/80 px-5 py-3 flex flex-col justify-center items-end">
            <span className="mono text-[8px] uppercase tracking-[0.3em] opacity-30 leading-tight">
              socialiZe
            </span>
            <span className="mono text-[8px] uppercase tracking-[0.3em] opacity-20 leading-tight">
              Blue Dot Tech
            </span>
          </div>
        </div>

        {/* ── Row 2: Metadata strip ──────────────────────────── */}
        <div className="flex border-b border-ink-black/80 divide-x divide-ink-black/80">
          <div className="px-5 py-3 min-w-[120px]">
            <FieldLabel>Voice</FieldLabel>
            <span className="mono text-[11px]">{result?.targetTone ?? ''}</span>
          </div>
          <div className="px-5 py-3 min-w-[110px]">
            <FieldLabel>Resonance</FieldLabel>
            <span className="mono text-[11px]">
              {result ? `${result.analysis.score}%` : '—'}
            </span>
          </div>
          <div className="px-5 py-3 min-w-[90px]">
            <FieldLabel>Chars</FieldLabel>
            <span className="mono text-[11px]">
              {result ? result.charCount : '—'}
            </span>
          </div>
          <div className="flex-1 px-5 py-3">
            <FieldLabel>Tone read</FieldLabel>
            <span className="mono text-[11px] italic opacity-70">
              {result ? `"${result.analysis.currentToneDescription}"` : ''}
            </span>
          </div>
        </div>

        {/* ── Row 3: Main content ────────────────────────────── */}
        <div className="border-b border-ink-black/80">
          {isLoading ? (
            <div className="px-6 py-8">
              <LoadingSkeleton />
            </div>
          ) : result ? (
            <div className="px-6 py-8">
              <FieldLabel>Content</FieldLabel>
              <div className="serif text-lg leading-8 whitespace-pre-wrap mt-2">
                {result.content}
              </div>
            </div>
          ) : null}
        </div>

        {/* ── Row 4: Tags + Drafting notes ───────────────────── */}
        {result && !isLoading && (
          <div className="flex border-b border-ink-black/80 divide-x divide-ink-black/80">
            {/* Tags */}
            <div className="flex-1 px-5 py-4">
              <FieldLabel>Tags</FieldLabel>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                {result.hashtags.map((tag, idx) => (
                  <span key={idx} className="mono text-[10px] opacity-60">
                    #{tag.replace('#', '')}
                  </span>
                ))}
              </div>
            </div>

            {/* Drafting notes */}
            <div className="flex-1 px-5 py-4">
              <FieldLabel>Drafting notes</FieldLabel>
              <ul className="mt-1 space-y-1">
                {result.analysis.suggestions.map((s, idx) => (
                  <li key={idx} className="mono text-[10px] opacity-55 leading-relaxed flex gap-2">
                    <span className="opacity-40 shrink-0">/0{idx + 1}</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* ── Row 5: Logic + Copy ────────────────────────────── */}
        {result && !isLoading && (
          <div className="flex items-stretch divide-x divide-ink-black/80">
            {/* Logic / rationale */}
            <div className="flex-1 px-5 py-4">
              <FieldLabel>Logic</FieldLabel>
              <p className="mono text-[10px] opacity-50 leading-relaxed mt-1 max-w-lg">
                {result.rationale}
              </p>
            </div>

            {/* Feedback */}
            <div className="flex-1 px-5 py-4 hidden md:block">
              <FieldLabel>Feedback</FieldLabel>
              <p className="mono text-[10px] opacity-50 leading-relaxed mt-1">
                {result.analysis.feedback}
              </p>
            </div>

            {/* Copy action */}
            <div className="px-5 py-4 flex items-center justify-center">
              <button
                onClick={onCopy}
                aria-label={copied ? 'Copied to clipboard' : 'Copy result to clipboard'}
                className={`
                  px-8 py-3 text-[9px] mono font-bold uppercase tracking-[0.3em] transition-all border
                  ${copied
                    ? 'bg-edit-red-light text-edit-red border-edit-red/40'
                    : 'border-ink-black/60 hover:bg-ink-black hover:text-white'}
                `}
              >
                {copied ? 'Copied to Clipboard' : 'Copy Result'}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
