import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  isAwake?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, isAwake = false }) => {
  return (
    <div className="min-h-screen bg-[#FDFCF0] selection:bg-edit-red-light selection:text-edit-red">
      <div className="max-w-screen-xl mx-auto px-6 py-8">
        <header className="mb-12 flex justify-between items-center opacity-40 hover:opacity-100 transition-opacity ink-dry ink-dry-1">
          <h1 className="h-10 overflow-hidden">
            <img
              src="/bigZlogo.png"
              alt="socialiZe"
              className="h-[135px] w-auto -mt-[15px]"
            />
          </h1>
          <div className="text-[9px] mono uppercase tracking-widest">
            Blue Dot Tech / v1.0
          </div>
        </header>

        <main className={`max-w-4xl mx-auto transition-all duration-700 ${isAwake ? 'opacity-100' : 'opacity-80'}`}>
          {children}
        </main>

        <footer className="mt-48 pb-12 flex justify-between items-center text-[9px] mono uppercase tracking-[0.3em] opacity-20">
          <p>Blue Dot Tech</p>
          <p>© {new Date().getFullYear()}</p>
        </footer>
      </div>
    </div>
  );
};
