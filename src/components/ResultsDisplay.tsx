import React, { useState, useEffect, useCallback } from 'react';
import { OptimizationResult } from '../types';
import { ToneAnalysisDisplay } from './ToneAnalysisDisplay';
import { LoadingSkeleton } from './LoadingSkeleton';

interface ResultsDisplayProps {
  result: OptimizationResult | null;
  isLoading: boolean;
  copied: boolean;
  onCopy: () => void;
}

const BindingHoles: React.FC = () => (
  <div
    className="absolute left-0 top-0 bottom-0 w-10 z-20 pointer-events-none flex flex-col justify-around items-center py-8"
    style={{ background: 'rgba(240, 237, 220, 0.75)' }}
    aria-hidden="true"
  >
    {[...Array(9)].map((_, i) => (
      <div
        key={i}
        className="w-3 h-3 rounded-full"
        style={{
          border: '1px solid #C8C3A8',
          background: 'radial-gradient(circle at 40% 35%, #fff 30%, #e0dcc8 100%)',
          boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.14)',
        }}
      />
    ))}
  </div>
);

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  result,
  isLoading,
  copied,
  onCopy,
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [swipeStartX, setSwipeStartX] = useState<number | null>(null);

  // Reset to page 0 whenever a new result arrives
  useEffect(() => {
    if (result) setCurrentPage(0);
  }, [result]);

  const goNext = useCallback(() => {
    setCurrentPage(p => Math.min(p + 1, 1));
  }, []);

  const goPrev = useCallback(() => {
    setCurrentPage(p => Math.max(p - 1, 0));
  }, []);

  // Keyboard navigation (arrow keys)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!result && !isLoading) return;
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [result, isLoading, goNext, goPrev]);

  const handlePointerDown = (e: React.PointerEvent) => {
    setSwipeStartX(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (swipeStartX === null) return;
    const diff = e.clientX - swipeStartX;
    if (Math.abs(diff) > 60) {
      if (diff < 0) goNext();
      else goPrev();
    }
    setSwipeStartX(null);
  };

  const handlePointerCancel = () => setSwipeStartX(null);

  if (!result && !isLoading) return null;

  const pageProps = (page: number) => ({
    className: 'absolute inset-0 overflow-y-auto notebook-paper transition-transform duration-500 ease-in-out',
    style: {
      transform: `translateX(${currentPage === page ? '0%' : page === 0 ? '-108%' : '108%'})`,
    } as React.CSSProperties,
    'aria-hidden': currentPage !== page,
  });

  return (
    <section
      id="results-section"
      aria-live="polite"
      className="pt-32 animate-in fade-in slide-in-from-bottom-4 duration-1000"
    >
      {/* Outer wrapper: full-width, relative for the side tab */}
      <div className="relative">
        {/* Platform side tab (sticks out right of the page) */}
        {result && (
          <div
            className="absolute top-10 right-0 z-30 hidden md:flex"
            style={{ transform: 'translateX(100%)' }}
            aria-hidden="true"
          >
            <div
              className="bg-edit-red text-white text-[8px] mono uppercase tracking-[0.18em] font-bold px-[5px] py-3 select-none"
              style={{ writingMode: 'vertical-rl' }}
            >
              {result.platform}
            </div>
          </div>
        )}

        {/* Notebook page container */}
        <div
          className="relative overflow-hidden rounded-sm shadow-md"
          style={{ minHeight: '65vh', touchAction: 'pan-y' } as React.CSSProperties}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
        >
          {/* Binding holes — always on top */}
          <BindingHoles />

          {/* ── Page 0: Draft ─────────────────────────────── */}
          <div {...pageProps(0)}>
            <div style={{ paddingLeft: '3.5rem', paddingRight: '1.5rem', paddingTop: '2rem', paddingBottom: '5rem' }}>
              {/* Page header */}
              {(result || isLoading) && (
                <div className="flex items-center justify-between mb-6">
                  <span className="text-[9px] mono uppercase tracking-[0.3em] text-edit-red font-bold">
                    {result?.platform ?? ''}
                  </span>
                  <span className="text-[9px] mono uppercase tracking-widest opacity-25">Draft</span>
                </div>
              )}

              {isLoading ? (
                <LoadingSkeleton />
              ) : result ? (
                <div className="space-y-8">
                  {/* Main content */}
                  <div className="serif text-xl leading-8 whitespace-pre-wrap ink-dry ink-dry-1">
                    {result.content}
                  </div>

                  {/* Hashtags */}
                  <div className="flex flex-wrap gap-4 opacity-40 ink-dry ink-dry-2">
                    {result.hashtags.map((tag, idx) => (
                      <span key={idx} className="text-[10px] mono uppercase tracking-widest">
                        #{tag.replace('#', '')}
                      </span>
                    ))}
                  </div>

                  {/* Rationale + copy */}
                  <div className="pt-4 border-t border-ink-black/5 space-y-6 ink-dry ink-dry-3">
                    <div className="text-[11px] opacity-20 leading-relaxed italic serif max-w-md flex gap-4">
                      <span className="mono uppercase text-[9px] not-italic font-bold tracking-[0.2em]">Logic</span>
                      {result.rationale}
                    </div>
                    <button
                      onClick={onCopy}
                      aria-label={copied ? 'Copied to clipboard' : 'Copy result to clipboard'}
                      className={`
                        px-12 py-4 text-[10px] font-bold uppercase tracking-[0.3em] transition-all border hover:scale-105
                        ${copied
                          ? 'bg-edit-red-light text-edit-red border-edit-red/20'
                          : 'bg-transparent border-ink-black hover:bg-ink-black hover:text-white'}
                      `}
                    >
                      {copied ? 'Copied to Clipboard' : 'Copy Result'}
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          {/* ── Page 1: Analysis ──────────────────────────── */}
          <div {...pageProps(1)}>
            <div style={{ paddingLeft: '3.5rem', paddingRight: '1.5rem', paddingTop: '2rem', paddingBottom: '5rem' }}>
              {result && (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-[9px] mono uppercase tracking-[0.3em] text-edit-red font-bold">
                      {result.platform}
                    </span>
                    <span className="text-[9px] mono uppercase tracking-widest opacity-25">Analysis</span>
                  </div>
                  <ToneAnalysisDisplay analysis={result.analysis} />
                </>
              )}
            </div>
          </div>

          {/* Page indicator — bottom center, above corner curls */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center gap-6 z-20 pointer-events-none">
            <span className="text-[9px] mono uppercase tracking-widest opacity-30">
              {currentPage + 1} / 2
            </span>
          </div>

          {/* Desktop corner curls */}
          {result && currentPage < 1 && (
            <div
              className="corner-curl-next hidden md:block"
              onClick={goNext}
              title="Analysis →"
              aria-label="Next page: Analysis"
            />
          )}
          {currentPage > 0 && (
            <div
              className="corner-curl-prev hidden md:block"
              onClick={goPrev}
              title="← Draft"
              aria-label="Previous page: Draft"
            />
          )}
        </div>

        {/* Mobile swipe hint — shown briefly on first result */}
        {result && (
          <p className="mt-3 text-center text-[9px] mono uppercase tracking-widest opacity-20 md:hidden">
            Swipe to flip page
          </p>
        )}
      </div>
    </section>
  );
};
