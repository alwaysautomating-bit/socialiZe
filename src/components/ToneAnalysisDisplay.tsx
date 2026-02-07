
import React from 'react';
import { ToneAnalysis } from '../types';

interface ToneAnalysisDisplayProps {
  analysis: ToneAnalysis;
}

export const ToneAnalysisDisplay: React.FC<ToneAnalysisDisplayProps> = ({ analysis }) => {
  return (
    <div className="space-y-12 pl-8 border-l border-[#E5E4D3]">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-[10px] mono uppercase tracking-[0.2em] opacity-40">Resonance</h3>
          <span className="text-[10px] mono font-bold">{analysis.score}%</span>
        </div>
        <div className="w-full h-[1px] bg-[#E5E4D3]">
          <div 
            className="h-full bg-ink-black transition-all duration-1000" 
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
