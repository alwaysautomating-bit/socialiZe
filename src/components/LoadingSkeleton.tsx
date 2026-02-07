import React from 'react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="space-y-8 opacity-10">
      <div className="h-[1px] bg-ink-black w-full"></div>
      <div className="h-[1px] bg-ink-black w-3/4"></div>
      <div className="h-[1px] bg-ink-black w-5/6"></div>
    </div>
  );
};
