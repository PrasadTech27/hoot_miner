import React, { useState } from 'react';
import { Plus, Edit2, Trash2, FolderGit2, AlertTriangle, Eye, EyeOff, Search, X, Check, Clock } from 'lucide-react';
import { saveRepository, deleteRepository } from '../../services/db';

export function RepoManager({ repositories, questions, onRefresh, addToast }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRepo, setEditingRepo] = useState(null);
  const [deleteConfirmRepo, setDeleteConfirmRepo] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Form State with language-specific default category
  const [formData, setFormData] = useState({
    title: '',
    category: 'C / C++',
    description: '',
    visibility: 'Published'
  });

  const questionCounts = questions.reduce((acc, q) => {
    acc[q.repositoryId] = (acc[q.repositoryId] || 0) + 1;
    return acc;
  }, {});

  const handleOpenCreateModal = () => {
    setEditingRepo(null);
    setFormData({
      title: '',
      category: 'C / C++',
      description: '',
      visibility: 'Published'
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (repo) => {
    setEditingRepo(repo);
    setFormData({
      title: repo.title,
      category: repo.category,
      description: repo.description,
      visibility: repo.visibility || 'Published'
    });
    setIsModalOpen(true);
  };

  const handleSaveRepo = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      addToast('Please fill out all required fields', 'error');
      return;
    }

    try {
      const repoPayload = {
        ...editingRepo,
        title: formData.title,
        category: formData.category,
        description: formData.description,
        visibility: formData.visibility,
        slug: formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      };

      await saveRepository(repoPayload);
      addToast(editingRepo ? 'Repository updated successfully' : 'New repository created successfully', 'success');
      setIsModalOpen(false);
      onRefresh();
    } catch (err) {
      addToast('Failed to save repository: ' + err.message, 'error');
    }
  };

  const handleDeleteRepo = async () => {
    if (!deleteConfirmRepo) return;
    try {
      await deleteRepository(deleteConfirmRepo.id);
      addToast(`Repository "${deleteConfirmRepo.title}" and associated questions deleted`, 'warning');
      setDeleteConfirmRepo(null);
      onRefresh();
    } catch (err) {
      addToast('Error deleting repository', 'error');
    }
  };

  const filteredRepos = repositories.filter(r =>
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Top Action Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search repositories..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-purple-500 shadow-sm"
          />
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-md shadow-purple-600/30 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Repository</span>
        </button>
      </div>

      {/* Repository Admin Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRepos.map((repo) => {
          const qCount = questionCounts[repo.id] || 0;
          return (
            <div
              key={repo.id}
              className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-3 py-1 rounded-xl text-[11px] font-extrabold bg-purple-100 text-purple-800 border border-purple-200">
                    {repo.category}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold uppercase ${
                    repo.visibility === 'Draft' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {repo.visibility || 'Published'}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-1">
                  {repo.title}
                </h3>
                <p className="text-xs text-slate-500 font-medium line-clamp-2 mb-4 leading-relaxed">
                  {repo.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-bold">
                  {qCount} {qCount === 1 ? 'Question' : 'Questions'}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEditModal(repo)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                    title="Edit Repository"
                  >
                    <Edit2 className="w-4 h-4 text-purple-600" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmRepo(repo)}
                    className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                    title="Delete Repository"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-4">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <FolderGit2 className="w-5 h-5 text-purple-600" />
                <span>{editingRepo ? 'Edit Repository' : 'Create Repository'}</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRepo} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Repository Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. C & C++ Systems Programming"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Category Tag
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 focus:outline-none"
                  >
                    <option value="C / C++">C / C++</option>
                    <option value="Python">Python</option>
                    <option value="Java">Java</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Visibility
                  </label>
                  <select
                    value={formData.visibility}
                    onChange={(e) => setFormData({ ...formData, visibility: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 focus:outline-none"
                  >
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Short Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief summary of what developers will find in this repository..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 focus:outline-none focus:border-purple-500"
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
                  className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-extrabold shadow-md shadow-purple-600/30"
                >
                  Save Repository
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Cascade Confirmation Modal */}
      {deleteConfirmRepo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-white border border-rose-200 rounded-3xl shadow-2xl p-6">
            <div className="flex items-center gap-3 text-rose-600 mb-4">
              <div className="p-2.5 rounded-2xl bg-rose-100 border border-rose-200">
                <AlertTriangle className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">Delete Repository?</h3>
                <p className="text-xs text-rose-700 font-bold">Cascade deletion warning</p>
              </div>
            </div>

            <p className="text-sm text-slate-600 mb-4 leading-relaxed font-medium">
              Are you sure you want to delete <span className="font-bold text-slate-900">"{deleteConfirmRepo.title}"</span>? 
              This will permanently remove the repository and all <span className="text-rose-600 font-bold">{questionCounts[deleteConfirmRepo.id] || 0} associated Q&A questions</span>.
            </p>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
              <button
                onClick={() => setDeleteConfirmRepo(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteRepo}
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
