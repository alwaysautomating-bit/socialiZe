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

/* ── Coaching questions by diagnosis type ───────────────────── */
const COACHING_QUESTIONS: Record<string, string[]> = {
  too_general: [
    "What specific angle or 'hard truth' would make this advice unique to you?",
    "Who exactly is this for? Name a real person or archetype — not 'everyone'.",
    "What's one concrete example, story, or data point that proves your point?",
    "What's the counter-intuitive take that only you could offer on this?",
  ],
  no_audience: [
    "Who should read this? (Be specific — 'founders' vs 'solo founders building while working full-time')",
    "What stage or situation is your ideal reader in right now?",
    "What does this person already believe that you're challenging or confirming?",
    "Why would THIS specific person care about this today — not tomorrow, today?",
  ],
  missing_outcome: [
    "What should someone DO differently after reading this?",
    "What should they THINK differently after reading this?",
    "What's the single thing you want them to walk away with?",
    "How will their week or business look different if they apply this?",
  ],
  too_broad: [
    "What's the ONE core point you want to make here?",
    "If you had to cut this to a single sentence, what would it be?",
    "Which idea is strongest — and can the others wait for another post?",
    "What's the most surprising or counterintuitive thing you're trying to say?",
  ],
};

const DEFAULT_COACHING_QUESTIONS = [
  "What specific angle or 'hard truth' would make this advice unique?",
  "Who exactly is this for? (Be specific — 'founders' vs 'solo founders building while working full-time')",
  "What should someone DO or THINK differently after reading this?",
  "What's the ONE core point you want to make here?",
];

const DIAGNOSIS_LABELS: Record<string, string> = {
  too_general: "Input lacks a specific angle or unique perspective — reads as generic advice",
  no_audience: "Target audience is undefined — 'everyone' ends up reaching no one",
  missing_outcome: "No clear outcome — what should the reader do or think differently?",
  too_broad: "Scope too broad — too many ideas competing for the reader's attention",
};

/* ── Coach Section component ────────────────────────────────── */
const CoachSection: React.FC<{ diagnosisType: string }> = ({ diagnosisType }) => {
  const questions = COACHING_QUESTIONS[diagnosisType] ?? DEFAULT_COACHING_QUESTIONS;
  const diagnosisLabel = DIAGNOSIS_LABELS[diagnosisType] ?? null;

  return (
    <div className="border-b border-ink-black/80">
      <div className="px-6 py-5">

        {/* Section header */}
        <div className="flex items-center gap-3 mb-4">
          <span className="mono text-[8px] uppercase tracking-[0.3em] text-edit-red opacity-80">
            // Improve Your Input
          </span>
          <div className="flex-1 h-px bg-ink-black/15" />
          <span className="mono text-[8px] uppercase tracking-[0.2em] opacity-25">
            Content Coach
          </span>
        </div>

        {/* Diagnosis label */}
        {diagnosisLabel && (
          <p className="mono text-[9px] opacity-45 italic mb-4 leading-relaxed">
            ↳ {diagnosisLabel}
          </p>
        )}

        {/* Clarifying questions */}
        <div className="space-y-3">
          {questions.map((q, i) => (
            <div key={i} className="flex gap-3 items-start">
              <span className="mono text-[8px] opacity-25 shrink-0 mt-0.5 font-bold">
                /0{i + 1}
              </span>
              <p className="mono text-[10px] opacity-65 leading-relaxed">{q}</p>
            </div>
          ))}
        </div>

        {/* Coaching footer */}
        <p className="mono text-[8px] opacity-30 mt-5 leading-relaxed italic">
          Answer these, then try again. You'll get better output AND better at creating input.
        </p>

      </div>
    </div>
  );
};

/* ── Main ResultsDisplay component ─────────────────────────── */
export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  result,
  isLoading,
  copied,
  onCopy,
}) => {
  if (!result && !isLoading) return null;

  const isLowResonance = result && result.analysis.score < 30;

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
            <span className={`mono text-[11px] ${isLowResonance ? 'text-edit-red font-bold' : ''}`}>
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

        {/* ── Row 2.5: Coach Section (low resonance only) ────── */}
        {result && !isLoading && isLowResonance && (
          <CoachSection diagnosisType={result.analysis.diagnosisType} />
        )}

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
