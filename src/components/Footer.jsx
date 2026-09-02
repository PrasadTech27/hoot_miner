import React from 'react';
import { Terminal } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200/80 bg-white py-8 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-3">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-purple-600 to-sky-500 p-[1.5px] shadow-sm">
            <div className="w-full h-full bg-white rounded-[9px] flex items-center justify-center">
              <Terminal className="w-3.5 h-3.5 text-purple-600" />
            </div>
          </div>
          <span className="font-extrabold text-slate-900 text-sm tracking-tight">
            Hoot <span className="gradient-text-purple">Miner</span>
          </span>
          <span className="text-slate-300">•</span>
          <span className="text-xs text-slate-500 font-medium">© 2026 Code Repository Platform. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
