import React, { useState, useEffect } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-docker';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import { 
  ChevronRight, 
  FolderGit2, 
  HelpCircle, 
  Copy, 
  Check, 
  Search, 
  ArrowLeft, 
  Code2, 
  Clock, 
  BookOpen, 
  Sparkles 
} from 'lucide-react';

export function RepositoryDetailView({ repo, questions, onBack, addToast, initialQuestionId }) {
  const repoQuestions = questions
    .filter(q => q.repositoryId === repo.id)
    .sort((a, b) => (a.displayOrder || 1) - (b.displayOrder || 1));

  const [expandedQuestionId, setExpandedQuestionId] = useState(
    initialQuestionId || (repoQuestions.length > 0 ? repoQuestions[0].id : null)
  );
  const [copiedId, setCopiedId] = useState(null);
  const [filterQuery, setFilterQuery] = useState('');

  // Re-run Prism highlighting when expanded question changes
  useEffect(() => {
    Prism.highlightAll();
  }, [expandedQuestionId]);

  // Handle Copy Snippet Action
  const handleCopyCode = (codeText, questionId) => {
    navigator.clipboard.writeText(codeText);
    setCopiedId(questionId);
    if (addToast) {
      addToast('Code snippet copied to clipboard!', 'success');
    }
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const filteredQuestions = repoQuestions.filter(q =>
    q.questionTitle.toLowerCase().includes(filterQuery.toLowerCase()) ||
    q.explanation.toLowerCase().includes(filterQuery.toLowerCase()) ||
    q.language.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <section className="py-8 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in">
      
      {/* Top Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-1 hover:text-purple-700 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Home</span>
        </button>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <button
          onClick={onBack}
          className="hover:text-purple-700 transition-colors"
        >
          Repositories
        </button>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <span className="text-slate-900 font-extrabold truncate max-w-xs">{repo.title}</span>
      </nav>

      {/* Repository Header Box */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl mb-8 relative overflow-hidden bg-white shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="px-3 py-1 rounded-xl text-xs font-extrabold bg-purple-100 text-purple-800 border border-purple-300">
                {repo.category}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Updated {new Date(repo.updatedAt || repo.createdAt).toLocaleDateString()}
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 mb-2 tracking-tight">
              {repo.title}
            </h1>
            <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed font-medium">
              {repo.description}
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="text-center">
              <div className="text-2xl font-black text-purple-700">{repoQuestions.length}</div>
              <div className="text-[11px] text-slate-600 font-bold">Questions</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter inside repository questions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-purple-600" />
          <span>Repository Questions & Solutions</span>
        </h2>

        <div className="relative sm:w-72">
          <Search className="w-4 h-4 text-purple-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Filter questions..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-500 shadow-sm"
          />
        </div>
      </div>

      {/* Question Accordion List */}
      {filteredQuestions.length > 0 ? (
        <div className="space-y-4">
          {filteredQuestions.map((q, idx) => {
            const isExpanded = expandedQuestionId === q.id;

            return (
              <div
                key={q.id}
                className={`rounded-3xl border transition-all duration-200 overflow-hidden ${
                  isExpanded
                    ? 'bg-white border-purple-400 shadow-lg shadow-purple-500/10'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                }`}
              >
                {/* Accordion Header */}
                <div
                  onClick={() => setExpandedQuestionId(isExpanded ? null : q.id)}
                  className="p-5 flex items-center justify-between gap-4 cursor-pointer select-none group"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-xl bg-purple-100 text-purple-800 text-xs font-extrabold flex items-center justify-center shrink-0 border border-purple-200">
                      Q{idx + 1}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
                      {q.questionTitle}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="px-3 py-0.5 rounded-lg text-[11px] font-mono font-bold uppercase bg-slate-100 text-sky-800 border border-slate-200">
                      {q.language}
                    </span>
                    <div className={`p-1.5 rounded-xl bg-slate-100 text-slate-500 group-hover:text-purple-700 transition-transform ${isExpanded ? 'rotate-90 text-purple-700 bg-purple-50' : ''}`}>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Expanded Solution View */}
                {isExpanded && (
                  <div className="p-5 pt-0 border-t border-slate-100 bg-slate-50/50 space-y-5 animate-slide-down">
                    
                    {/* Explanation text */}
                    {q.explanation && (
                      <div className="pt-4 text-sm text-slate-700 leading-relaxed font-medium">
                        <p>{q.explanation}</p>
                      </div>
                    )}

                    {/* Formatted Code Block */}
                    {q.codeSnippet && (
                      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-[#0f172a] shadow-md group">
                        
                        {/* Top Code Bar */}
                        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs text-slate-400">
                          <div className="flex items-center gap-2">
                            <Code2 className="w-4 h-4 text-purple-400" />
                            <span className="font-mono font-bold text-slate-200 uppercase">{q.language} Solution</span>
                          </div>

                          {/* Copy Button */}
                          <button
                            onClick={() => handleCopyCode(q.codeSnippet, q.id)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              copiedId === q.id
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                : 'bg-slate-800 hover:bg-purple-600 text-slate-200 hover:text-white border border-slate-700'
                            }`}
                          >
                            {copiedId === q.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy Code</span>
                              </>
                            )}
                          </button>
                        </div>

                        {/* Highlighted Code Container */}
                        <div className="p-4 overflow-x-auto">
                          <pre className="!m-0 !p-0 !bg-transparent">
                            <code className={`language-${q.language || 'javascript'}`}>
                              {q.codeSnippet}
                            </code>
                          </pre>
                        </div>
                      </div>
                    )}

                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-10 text-center bg-white rounded-3xl border border-slate-200 shadow-sm">
          <HelpCircle className="w-10 h-10 text-slate-400 mx-auto mb-2" />
          <div className="text-slate-900 font-bold">No matching questions</div>
          <div className="text-xs text-slate-500">Try adjusting your filter search term.</div>
        </div>
      )}

    </section>
  );
}
