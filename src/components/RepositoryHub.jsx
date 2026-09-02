import React, { useState, useMemo } from 'react';
import { Search, Filter, FolderGit2, HelpCircle, ArrowUpDown, Sparkles, Clock, CheckCircle2, Shield } from 'lucide-react';

export function RepositoryHub({ repositories, questions, onSelectRepo }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Defined Language Category Options Strictly (All, C / C++, Python, Java)
  const categories = useMemo(() => {
    return ['All', 'C / C++', 'Python', 'Java'];
  }, []);

  // Compute question counts for each repository
  const repoQuestionCounts = useMemo(() => {
    const counts = {};
    questions.forEach(q => {
      counts[q.repositoryId] = (counts[q.repositoryId] || 0) + 1;
    });
    return counts;
  }, [questions]);

  // Filter & Sort Repositories
  const filteredRepos = useMemo(() => {
    return repositories.filter(repo => {
      const matchesCategory = selectedCategory === 'All' || repo.category === selectedCategory;
      const matchesSearch = repo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            repo.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            repo.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch && repo.visibility !== 'Draft';
    }).sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'questions') {
        const countA = repoQuestionCounts[a.id] || 0;
        const countB = repoQuestionCounts[b.id] || 0;
        return countB - countA;
      }
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      return 0;
    });
  }, [repositories, selectedCategory, searchQuery, sortBy, repoQuestionCounts]);

  return (
    <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-purple-600 uppercase tracking-widest mb-1.5">
            <FolderGit2 className="w-4 h-4 text-purple-600" />
            <span>Workspace Hub</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
            Repository <span className="gradient-text-purple">Collection</span>
          </h2>
          <p className="text-sm text-slate-600 mt-1 font-medium">
            Explore structured code solutions, algorithms, and architectural guidelines.
          </p>
        </div>

        {/* Real-time search & sort bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-purple-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search repositories..."
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-500 transition-colors shadow-sm font-medium"
            />
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs text-slate-700 shadow-sm">
            <ArrowUpDown className="w-3.5 h-3.5 text-purple-600 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-slate-800 focus:outline-none cursor-pointer font-bold"
            >
              <option value="newest" className="bg-white text-slate-900">Newest First</option>
              <option value="questions" className="bg-white text-slate-900">Most Questions</option>
              <option value="title" className="bg-white text-slate-900">Title A-Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Horizontal Category Scroll Tag Bar strictly displaying All, C / C++, Python, Java */}
      <div className="flex items-center gap-3 overflow-x-auto pb-4 mb-8 no-scrollbar scroll-smooth">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold whitespace-nowrap border transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white border-purple-600 shadow-md shadow-purple-600/30 scale-[1.02]'
                : 'bg-white text-slate-700 border-slate-200 hover:border-purple-300 hover:text-purple-700 shadow-sm'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Repository Grid */}
      {filteredRepos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRepos.map((repo) => {
            const count = repoQuestionCounts[repo.id] || 0;
            return (
              <RepositoryCard
                key={repo.id}
                repo={repo}
                questionCount={count}
                onClick={() => onSelectRepo(repo)}
              />
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-sm">
          <FolderGit2 className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-900 mb-1">No repositories found for "{selectedCategory}"</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto font-medium">
            No repositories match your current category filter or search query.
          </p>
        </div>
      )}
    </section>
  );
}

// Repository Card Component with Language Specific Badges
function RepositoryCard({ repo, questionCount, onClick }) {
  const getCategoryBadgeClass = (category) => {
    switch (category) {
      case 'C / C++':
        return 'bg-indigo-100 text-indigo-800 border-indigo-300';
      case 'Python':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Java':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      default:
        return 'bg-purple-100 text-purple-800 border-purple-300';
    }
  };

  return (
    <div
      onClick={onClick}
      className="glass-card p-6 rounded-3xl cursor-pointer flex flex-col justify-between group relative overflow-hidden"
    >
      {/* Top card metadata */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className={`px-3 py-1 rounded-xl text-[11px] font-extrabold border ${getCategoryBadgeClass(repo.category)}`}>
            {repo.category}
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl text-[11px] font-bold bg-slate-100 text-purple-700 border border-slate-200">
            <HelpCircle className="w-3.5 h-3.5 text-purple-600" />
            {questionCount} {questionCount === 1 ? 'Question' : 'Questions'}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-purple-700 transition-colors line-clamp-2">
          {repo.title}
        </h3>

        {/* Description */}
        <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 mb-6 leading-relaxed font-medium">
          {repo.description}
        </p>
      </div>

      {/* Card Footer */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
        <span className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          {new Date(repo.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
        <span className="text-purple-700 font-extrabold group-hover:translate-x-1.5 transition-transform flex items-center gap-1">
          Explore Repo &rarr;
        </span>
      </div>
    </div>
  );
}
