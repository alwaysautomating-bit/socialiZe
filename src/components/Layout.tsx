import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#FDFCF0] selection:bg-blue-100 selection:text-blue-900">
      <div className="max-w-screen-xl mx-auto px-6 py-8">
        <header className="mb-12 flex justify-between items-center opacity-40 hover:opacity-100 transition-opacity">
          <h1 className="text-xl font-normal tracking-tighter serif italic">socialiZe</h1>
          <div className="text-[9px] mono uppercase tracking-widest">
            Blue Dot Tech / v1.0
          </div>
        </header>
        
        <main className="max-w-4xl mx-auto">{children}</main>
        
        <footer className="mt-48 pb-12 flex justify-between items-center text-[9px] mono uppercase tracking-[0.3em] opacity-20">
          <p>Blue Dot Tech</p>
          <p>© {new Date().getFullYear()}</p>
        </footer>
      </div>
    </div>
  );
};