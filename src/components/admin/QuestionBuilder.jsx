import React, { useState } from 'react';
import { Plus, Edit2, Trash2, HelpCircle, Code2, Search, X, Check, ArrowUpDown, BookOpen } from 'lucide-react';
import { saveQuestion, deleteQuestion } from '../../services/db';

export function QuestionBuilder({ repositories, questions, onRefresh, addToast }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [deleteConfirmQuestion, setDeleteConfirmQuestion] = useState(null);

  const [selectedRepoFilter, setSelectedRepoFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Form state strictly for C, C++, Python, Java
  const [formData, setFormData] = useState({
    repositoryId: repositories.length > 0 ? repositories[0].id : '',
    questionTitle: '',
    explanation: '',
    codeSnippet: '',
    language: 'c',
    displayOrder: 1
  });

  const languages = [
    { label: 'C Language', value: 'c' },
    { label: 'C++', value: 'cpp' },
    { label: 'Python 3', value: 'python' },
    { label: 'Java', value: 'java' }
  ];

  const handleOpenCreateModal = () => {
    setEditingQuestion(null);
    setFormData({
      repositoryId: repositories.length > 0 ? repositories[0].id : '',
      questionTitle: '',
      explanation: '',
      codeSnippet: '',
      language: 'c',
      displayOrder: 1
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (q) => {
    setEditingQuestion(q);
    setFormData({
      repositoryId: q.repositoryId,
      questionTitle: q.questionTitle,
      explanation: q.explanation || '',
      codeSnippet: q.codeSnippet || '',
      language: q.language || 'c',
      displayOrder: q.displayOrder || 1
    });
    setIsModalOpen(true);
  };

  const handleSaveQuestion = async (e) => {
    e.preventDefault();
    if (!formData.repositoryId || !formData.questionTitle.trim() || !formData.codeSnippet.trim()) {
      addToast('Please assign a repository, question title, and code solution snippet', 'error');
      return;
    }

    try {
      const payload = {
        ...editingQuestion,
        ...formData
      };
      await saveQuestion(payload);
      addToast(editingQuestion ? 'Question updated successfully' : 'New Q&A entry added successfully', 'success');
      setIsModalOpen(false);
      onRefresh();
    } catch (err) {
      addToast('Failed to save question: ' + err.message, 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmQuestion) return;
    try {
      await deleteQuestion(deleteConfirmQuestion.id);
      addToast('Question solution deleted', 'warning');
      setDeleteConfirmQuestion(null);
      onRefresh();
    } catch (err) {
      addToast('Error deleting question', 'error');
    }
  };

  const repoMap = repositories.reduce((acc, r) => {
    acc[r.id] = r.title;
    return acc;
  }, {});

  const filteredQuestions = questions.filter(q => {
    const matchesRepo = selectedRepoFilter === 'All' || q.repositoryId === selectedRepoFilter;
    const matchesQuery = q.questionTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (q.explanation && q.explanation.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         (q.codeSnippet && q.codeSnippet.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesRepo && matchesQuery;
  });

  return (
    <div className="space-y-6">
      
      {/* Action Controls & Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
          {/* Repository Filter */}
          <div className="bg-white border border-slate-200 rounded-2xl px-3 py-2 text-xs font-bold text-slate-700 shadow-sm flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-purple-600 shrink-0" />
            <select
              value={selectedRepoFilter}
              onChange={(e) => setSelectedRepoFilter(e.target.value)}
              className="bg-transparent text-slate-900 focus:outline-none cursor-pointer w-full"
            >
              <option value="All">All Repositories ({questions.length})</option>
              {repositories.map(r => (
                <option key={r.id} value={r.id}>{r.title}</option>
              ))}
            </select>
          </div>

          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search question titles & code..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-purple-500 shadow-sm"
            />
          </div>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-md shadow-sky-600/30 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Q&A Solution</span>
        </button>

      </div>

      {/* Questions Solution List */}
      <div className="space-y-4">
        {filteredQuestions.map((q) => (
          <div
            key={q.id}
            className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 rounded-xl text-[11px] font-extrabold bg-purple-100 text-purple-800 border border-purple-200">
                  {repoMap[q.repositoryId] || 'Unassigned Repo'}
                </span>
                <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-bold uppercase bg-slate-100 text-slate-700">
                  {q.language}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEditModal(q)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                  title="Edit Q&A"
                >
                  <Edit2 className="w-4 h-4 text-purple-600" />
                </button>
                <button
                  onClick={() => setDeleteConfirmQuestion(q)}
                  className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                  title="Delete Q&A"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <h4 className="text-base font-bold text-slate-900 mb-2">
              {q.questionTitle}
            </h4>

            {q.explanation && (
              <p className="text-xs text-slate-600 mb-4 line-clamp-2 leading-relaxed">
                {q.explanation}
              </p>
            )}

            <div className="rounded-2xl p-3 bg-[#0f172a] text-cyan-200 font-mono text-xs overflow-x-auto border border-slate-800 max-h-36">
              <pre>{q.codeSnippet}</pre>
            </div>
          </div>
        ))}
      </div>

      {/* Create / Edit Question Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-4">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-sky-600" />
                <span>{editingQuestion ? 'Edit Question & Solution' : 'Add New Q&A Solution'}</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuestion} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Parent Repository *
                </label>
                <select
                  required
                  value={formData.repositoryId}
                  onChange={(e) => setFormData({ ...formData, repositoryId: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 focus:outline-none"
                >
                  {repositories.map(r => (
                    <option key={r.id} value={r.id}>{r.title} ({r.category})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Question / Problem Statement *
                </label>
                <input
                  type="text"
                  required
                  value={formData.questionTitle}
                  onChange={(e) => setFormData({ ...formData, questionTitle: e.target.value })}
                  placeholder="e.g. How to check voting eligibility using if-else in C?"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Programming Language
                  </label>
                  <select
                    value={formData.language}
                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 focus:outline-none"
                  >
                    {languages.map(l => (
                      <option key={l.value} value={l.value}>{l.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Display Order #
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Explanation / Algorithm Notes
                </label>
                <textarea
                  rows={2}
                  value={formData.explanation}
                  onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                  placeholder="Brief explanation of the logic..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Code Solution Snippet *
                </label>
                <textarea
                  required
                  rows={8}
                  value={formData.codeSnippet}
                  onChange={(e) => setFormData({ ...formData, codeSnippet: e.target.value })}
                  placeholder="Paste working code solution here..."
                  className="w-full p-4 bg-[#0f172a] text-cyan-200 font-mono text-xs leading-relaxed rounded-2xl focus:outline-none border border-slate-800"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-600 text-white text-xs font-extrabold shadow-md shadow-sky-600/30"
                >
                  Save Question Solution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Question Confirmation Modal */}
      {deleteConfirmQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-white border border-rose-200 rounded-3xl shadow-2xl p-6">
            <h3 className="text-lg font-black text-slate-900 mb-2">Delete Question Solution?</h3>
            <p className="text-sm text-slate-600 mb-4 leading-relaxed font-medium">
              Are you sure you want to delete <span className="font-bold text-slate-900">"{deleteConfirmQuestion.questionTitle}"</span>?
            </p>
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
              <button
                onClick={() => setDeleteConfirmQuestion(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold shadow-md shadow-rose-600/30"
              >
                Permanently Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
