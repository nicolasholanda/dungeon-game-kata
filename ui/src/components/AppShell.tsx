import React from 'react';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-slate-900">
            Dungeon Game Visualizer
          </h1>
          <p className="text-slate-600 mt-1">
            Dynamic Programming solution with step-by-step visualization
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
        <div className="max-w-7xl w-full flex items-center justify-center">
          {children}
        </div>
      </main>

      <footer className="border-t bg-white/80 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-slate-600">
            <span>© 2025 Dungeon Game Visualizer</span>
            <span>Created by Blue Team</span>
          </div>
        </div>
      </footer>
    </div>
  );
}