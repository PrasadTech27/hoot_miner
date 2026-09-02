import React from 'react';
import { Rocket, Code2, ArrowRight, Zap } from 'lucide-react';

export function LandingHero({ onLaunchWorkspace, onOpenCompiler, repoCount, questionCount }) {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
      {/* Soft colorful radial glow backdrop */}
      <div className="gradient-glow-bg"></div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
        
        {/* Top pill badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100/90 border border-purple-300/80 backdrop-blur-md mb-8 text-xs font-bold text-purple-900 shadow-sm">
          <Zap className="w-3.5 h-3.5 text-purple-600 animate-pulse" />
          <span>Realtime Solution Mining Engine & Online Compiler</span>
        </div>

        {/* High-Impact Hero Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-slate-900 mb-6 leading-[1.15]">
          Mine Clean Code & <br />
          <span className="gradient-text-purple">Execute Solutions Live</span>
        </h1>

        {/* Subtitle / Intro */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 mb-10 font-medium leading-relaxed">
          An intuitive, vibrant platform for developers. Access code solutions for C, Python, Java, and run code instantly in our interactive Online Compiler!
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14 max-w-xl mx-auto">
          <button
            onClick={onLaunchWorkspace}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white font-extrabold text-base shadow-xl shadow-purple-600/30 hover:shadow-purple-600/50 hover:scale-[1.03] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 group cursor-pointer"
          >
            <Rocket className="w-5 h-5 text-purple-100 group-hover:translate-x-0.5 transition-transform" />
            <span>Launch Workspace</span>
            <ArrowRight className="w-4 h-4 text-purple-100" />
          </button>

          <button
            onClick={onOpenCompiler}
            className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white border border-slate-200 text-slate-700 font-bold text-sm hover:border-purple-400 hover:text-purple-700 transition-all flex items-center justify-center gap-3 backdrop-blur-md shadow-sm cursor-pointer"
          >
            <Code2 className="w-4 h-4 text-purple-600" />
            <span>Open Online Compiler</span>
          </button>
        </div>

        {/* Bright Stat Counters Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-slate-200">
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 backdrop-blur-md shadow-sm hover:shadow-md transition-shadow">
            <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-1">{repoCount}+</div>
            <div className="text-xs text-slate-600 font-bold">Language Repositories</div>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 backdrop-blur-md shadow-sm hover:shadow-md transition-shadow">
            <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-blue-600 mb-1">{questionCount}+</div>
            <div className="text-xs text-slate-600 font-bold">Q&A Solutions</div>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 backdrop-blur-md shadow-sm hover:shadow-md transition-shadow">
            <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-rose-600 mb-1">4</div>
            <div className="text-xs text-slate-600 font-bold">Compiler Engines</div>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 backdrop-blur-md shadow-sm hover:shadow-md transition-shadow">
            <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 mb-1">&lt; 1ms</div>
            <div className="text-xs text-slate-600 font-bold">1-Click Execution</div>
          </div>
        </div>

      </div>
    </section>
  );
}
