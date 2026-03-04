
import React from 'react';
import { ToneAnalysis } from '../types';

interface ToneAnalysisDisplayProps {
  analysis: ToneAnalysis;
}

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

export const ToneAnalysisDisplay: React.FC<ToneAnalysisDisplayProps> = ({ analysis }) => {
  const isLowResonance = analysis.score < 30;
  const questions = COACHING_QUESTIONS[analysis.diagnosisType] ?? DEFAULT_COACHING_QUESTIONS;
  const diagnosisLabel = DIAGNOSIS_LABELS[analysis.diagnosisType] ?? null;

  return (
    <div className="space-y-12 pl-8 border-l border-[#E5E4D3]">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-[10px] mono uppercase tracking-[0.2em] opacity-40">Resonance</h3>
          <span className={`text-[10px] mono font-bold ${isLowResonance ? 'text-edit-red' : ''}`}>
            {analysis.score}%
          </span>
        </div>
        <div className="w-full h-[1px] bg-[#E5E4D3]">
          <div
            className="h-full bg-edit-red transition-all duration-1000"
            style={{ width: `${analysis.score}%` }}
          />
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-[9px] mono uppercase font-bold tracking-widest opacity-30">Critique</label>
        <div className="text-[12px] leading-relaxed serif italic opacity-70">
          "{analysis.currentToneDescription}"
        </div>
        <p className="text-[12px] opacity-60 leading-relaxed serif">
          {analysis.feedback}
        </p>
      </div>

      {/* ── Coach Section (low resonance only) ─────────────── */}
      {isLowResonance && (
        <div className="space-y-4 border-l-2 border-edit-red/30 pl-4">
          <div className="flex items-center gap-2">
            <label className="text-[9px] mono uppercase font-bold tracking-widest text-edit-red opacity-70">
              // Improve Your Input
            </label>
          </div>

          {diagnosisLabel && (
            <p className="text-[10px] mono opacity-45 italic leading-relaxed">
              ↳ {diagnosisLabel}
            </p>
          )}

          <ul className="space-y-3">
            {questions.map((q, idx) => (
              <li key={idx} className="flex gap-3 items-start">
                <span className="mono text-[8px] opacity-25 shrink-0 mt-0.5 font-bold">
                  /0{idx + 1}
                </span>
                <p className="text-[11px] mono opacity-60 leading-relaxed">{q}</p>
              </li>
            ))}
          </ul>

          <p className="text-[8px] mono opacity-30 leading-relaxed italic">
            Answer these, then try again. You'll get better output AND better at creating input.
          </p>
        </div>
      )}

      <div className="space-y-6">
        <label className="text-[9px] mono uppercase font-bold tracking-widest opacity-30">Drafting Notes</label>
        <ul className="space-y-4">
          {analysis.suggestions.map((suggestion, idx) => (
            <li key={idx} className="flex gap-4 text-[12px] opacity-60 items-start serif">
              <span className="text-ink-black opacity-20 text-[9px] mt-1 mono font-bold">/0{idx + 1}</span>
              <span className="leading-relaxed italic">{suggestion}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
