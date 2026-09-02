import React, { useState, useEffect, useRef } from 'react';
import { Search, X, FolderGit2, HelpCircle, ArrowRight, CornerDownLeft } from 'lucide-react';

export function QuickSearchModal({ isOpen, onClose, repositories, questions, onSelectRepo, onSelectQuestion }) {
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef(null);

  // Auto-focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setSearchTerm('');
    }
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Filter matching repos and questions
  const filteredRepos = repositories.filter(
    r => r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
         r.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
         r.description.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 4);

  const filteredQuestions = questions.filter(
    q => q.questionTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
         q.explanation.toLowerCase().includes(searchTerm.toLowerCase()) ||
         q.language.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 6);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      {/* Modal backdrop click */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Content */}
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden z-10">
        
        {/* Search Header Input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-200 bg-slate-50/80">
          <Search className="w-5 h-5 text-purple-600 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search repositories, questions, or language tags..."
            className="w-full bg-transparent text-slate-900 placeholder-slate-400 text-sm font-semibold focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {searchTerm.trim() === '' ? (
            <div className="py-8 text-center text-slate-500 text-sm font-medium">
              Type keywords like <span className="text-purple-600 font-mono font-bold">"Python"</span>, <span className="text-sky-600 font-mono font-bold">"Async"</span>, or <span className="text-emerald-600 font-mono font-bold">"SQL"</span> to mine solutions...
            </div>
          ) : (
            <>
              {/* Matching Repositories Section */}
              {filteredRepos.length > 0 && (
                <div>
                  <div className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-2 px-2">
                    Repositories ({filteredRepos.length})
                  </div>
                  <div className="space-y-1.5">
                    {filteredRepos.map((repo) => (
                      <div
                        key={repo.id}
                        onClick={() => {
                          onSelectRepo(repo);
                          onClose();
                        }}
                        className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-purple-50 border border-slate-200 hover:border-purple-300 cursor-pointer group transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-xl bg-white border border-slate-200 group-hover:border-purple-300 shadow-sm">
                            <FolderGit2 className="w-4 h-4 text-purple-600" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-slate-900 group-hover:text-purple-700">
                              {repo.title}
                            </div>
                            <div className="text-xs text-slate-500 line-clamp-1 font-medium">{repo.description}</div>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 text-[10px] font-extrabold bg-purple-100 text-purple-800 border border-purple-200 rounded-lg">
                          {repo.category}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Matching Questions Section */}
              {filteredQuestions.length > 0 && (
                <div>
                  <div className="text-xs font-bold text-sky-600 uppercase tracking-wider mb-2 px-2">
                    Questions & Solutions ({filteredQuestions.length})
                  </div>
                  <div className="space-y-1.5">
                    {filteredQuestions.map((q) => (
                      <div
                        key={q.id}
                        onClick={() => {
                          onSelectQuestion(q);
                          onClose();
                        }}
                        className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-sky-50 border border-slate-200 hover:border-sky-300 cursor-pointer group transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-xl bg-white border border-slate-200 group-hover:border-sky-300 shadow-sm">
                            <HelpCircle className="w-4 h-4 text-sky-600" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-slate-900 group-hover:text-sky-700">
                              {q.questionTitle}
                            </div>
                            <div className="text-xs text-slate-500 line-clamp-1 font-medium">{q.explanation}</div>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase bg-sky-100 text-sky-800 border border-sky-200 rounded-lg">
                          {q.language}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {filteredRepos.length === 0 && filteredQuestions.length === 0 && (
                <div className="py-10 text-center">
                  <div className="text-slate-700 font-bold text-sm">No matching repositories or questions found for "{searchTerm}".</div>
                  <div className="text-xs text-slate-500 mt-1">Try searching another tag or keyword.</div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-bold">ESC</kbd> to close
            </span>
          </div>
          <div className="text-purple-700 font-extrabold">Hoot Miner Search</div>
        </div>

      </div>
    </div>
  );
}
