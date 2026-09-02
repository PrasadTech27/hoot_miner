import React, { useState } from 'react';
import { Terminal, Home, FolderGit2, Menu, X, Play, Code2 } from 'lucide-react';

export function Navbar({ activeTab, setActiveTab }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-2xl border-b border-slate-200/80 shadow-sm transition-all">
      {/* Top subtle gradient accent line */}
      <div className="h-[3px] w-full bg-gradient-to-r from-purple-600 via-pink-500 to-sky-500" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo - Hoot Miner */}
        <div 
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-600 via-pink-500 to-sky-500 p-[1.5px] shadow-md shadow-purple-500/20 group-hover:scale-105 group-hover:shadow-purple-500/40 transition-all duration-300">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
              <Terminal className="w-5 h-5 text-purple-600 group-hover:text-pink-600 transition-colors" />
            </div>
          </div>
          <span className="font-black text-xl tracking-tight text-slate-900 group-hover:text-purple-700 transition-colors">
            Hoot <span className="gradient-text-purple">Miner</span>
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/80 shadow-inner">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-extrabold rounded-xl transition-all cursor-pointer ${
              activeTab === 'home'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
            }`}
          >
            <Home className={`w-4 h-4 ${activeTab === 'home' ? 'text-white' : 'text-purple-600'}`} />
            <span>Home</span>
          </button>

          <button
            onClick={() => setActiveTab('repos')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-extrabold rounded-xl transition-all cursor-pointer ${
              activeTab === 'repos' || activeTab === 'repo-detail'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
            }`}
          >
            <FolderGit2 className={`w-4 h-4 ${activeTab === 'repos' || activeTab === 'repo-detail' ? 'text-white' : 'text-pink-600'}`} />
            <span>Workspace</span>
          </button>
        </nav>

        {/* Right Action Bar - Compiler Button Replacing Quick Search */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => setActiveTab('compiler')}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-extrabold transition-all cursor-pointer shadow-sm ${
              activeTab === 'compiler'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/30'
                : 'bg-white border border-slate-200 text-slate-800 hover:border-purple-400 hover:text-purple-700 shadow-sm'
            }`}
          >
            <Code2 className="w-4 h-4 text-purple-600" />
            <span>Online Compiler</span>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setActiveTab('compiler')}
            className="p-2.5 rounded-2xl bg-white text-purple-600 hover:text-purple-800 border border-slate-200 shadow-sm"
          >
            <Code2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-2xl bg-white text-slate-600 hover:text-slate-900 border border-slate-200 shadow-sm"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-pink-600" /> : <Menu className="w-5 h-5 text-purple-600" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white p-4 space-y-2 animate-fade-in shadow-lg">
          <button
            onClick={() => {
              setActiveTab('home');
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold ${
              activeTab === 'home' ? 'bg-purple-50 text-purple-700 border border-purple-200' : 'text-slate-700'
            }`}
          >
            <Home className="w-4 h-4 text-purple-600" />
            Home
          </button>

          <button
            onClick={() => {
              setActiveTab('repos');
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold ${
              activeTab === 'repos' ? 'bg-purple-50 text-purple-700 border border-purple-200' : 'text-slate-700'
            }`}
          >
            <FolderGit2 className="w-4 h-4 text-pink-600" />
            Workspace Repositories
          </button>

          <button
            onClick={() => {
              setActiveTab('compiler');
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold ${
              activeTab === 'compiler' ? 'bg-purple-50 text-purple-700 border border-purple-200' : 'text-slate-700'
            }`}
          >
            <Code2 className="w-4 h-4 text-purple-600" />
            Online Compiler
          </button>
        </div>
      )}
    </header>
  );
}
