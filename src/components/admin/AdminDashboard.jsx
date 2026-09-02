import React, { useState } from 'react';
import { 
  FolderGit2, 
  HelpCircle, 
  Tag, 
  ShieldCheck, 
  Plus, 
  RefreshCw, 
  LogOut, 
  Activity, 
  Database,
  CheckCircle2,
  FileCode2,
  Trash2
} from 'lucide-react';
import { RepoManager } from './RepoManager';
import { QuestionBuilder } from './QuestionBuilder';
import { clearAllRepositories } from '../../services/db';

export function AdminDashboard({ adminUser, onLogout, repositories, questions, onRefresh, addToast }) {
  const [activeTab, setActiveTab] = useState('repos'); // 'repos' | 'questions'
  const [confirmClearAll, setConfirmClearAll] = useState(false);

  // Compute Metrics
  const totalRepos = repositories.length;
  const totalQuestions = questions.length;
  
  // Category stats
  const categoryCounts = repositories.reduce((acc, r) => {
    acc[r.category] = (acc[r.category] || 0) + 1;
    return acc;
  }, {});
  
  const topCategory = Object.keys(categoryCounts).length > 0 
    ? Object.keys(categoryCounts).reduce((a, b) => categoryCounts[a] > categoryCounts[b] ? a : b)
    : 'None';

  const handleClearAllData = async () => {
    try {
      await clearAllRepositories();
      addToast('All repositories and questions cleared from database', 'warning');
      setConfirmClearAll(false);
      onRefresh();
    } catch (err) {
      addToast('Error clearing repositories: ' + err.message, 'error');
    }
  };

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in">
      
      {/* Top Banner / User bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-purple-600 uppercase tracking-widest mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Admin Portal Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Repository & Solutions Management
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setConfirmClearAll(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-colors shadow-sm cursor-pointer"
            title="Clear All Repositories"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-600" />
            <span>Clear Repositories</span>
          </button>

          <button
            onClick={() => {
              onRefresh();
              addToast('Refreshed database data from Firebase', 'info');
            }}
            className="p-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors shadow-sm cursor-pointer"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4 text-purple-600" />
          </button>

          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors shadow-sm cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 text-pink-400" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        
        {/* KPI 1: Total Repos */}
        <div className="glass-panel p-5 rounded-3xl border border-slate-200 bg-white flex items-center justify-between shadow-sm">
          <div>
            <div className="text-xs text-slate-500 font-bold mb-1">Total Repositories</div>
            <div className="text-3xl font-black text-slate-900">{totalRepos}</div>
            <div className="text-[11px] text-purple-600 font-bold mt-1">Active categories</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200 text-purple-600 shadow-sm">
            <FolderGit2 className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 2: Total Questions */}
        <div className="glass-panel p-5 rounded-3xl border border-slate-200 bg-white flex items-center justify-between shadow-sm">
          <div>
            <div className="text-xs text-slate-500 font-bold mb-1">Total Questions</div>
            <div className="text-3xl font-black text-sky-600">{totalQuestions}</div>
            <div className="text-[11px] text-sky-600 font-bold mt-1">Code solutions ready</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200 text-sky-600 shadow-sm">
            <HelpCircle className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 3: Top Category */}
        <div className="glass-panel p-5 rounded-3xl border border-slate-200 bg-white flex items-center justify-between shadow-sm">
          <div>
            <div className="text-xs text-slate-500 font-bold mb-1">Top Active Category</div>
            <div className="text-xl font-black text-emerald-700">{topCategory}</div>
            <div className="text-[11px] text-slate-500 font-bold mt-1">{categoryCounts[topCategory] || 0} Repositories</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 shadow-sm">
            <Tag className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 4: Database Sync Status */}
        <div className="glass-panel p-5 rounded-3xl border border-slate-200 bg-white flex items-center justify-between shadow-sm">
          <div>
            <div className="text-xs text-slate-500 font-bold mb-1">Database Status</div>
            <div className="text-lg font-black text-slate-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Realtime</span>
            </div>
            <div className="text-[11px] text-emerald-600 font-bold mt-1">Ready for custom repos</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600 shadow-sm">
            <Database className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200 mb-6">
        <button
          onClick={() => setActiveTab('repos')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-extrabold border-b-2 transition-all cursor-pointer ${
            activeTab === 'repos'
              ? 'border-purple-600 text-purple-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <FolderGit2 className="w-4 h-4" />
          <span>Repositories ({totalRepos})</span>
        </button>

        <button
          onClick={() => setActiveTab('questions')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-extrabold border-b-2 transition-all cursor-pointer ${
            activeTab === 'questions'
              ? 'border-sky-600 text-sky-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <FileCode2 className="w-4 h-4" />
          <span>Questions & Solutions ({totalQuestions})</span>
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'repos' ? (
        <RepoManager
          repositories={repositories}
          questions={questions}
          onRefresh={onRefresh}
          addToast={addToast}
        />
      ) : (
        <QuestionBuilder
          repositories={repositories}
          questions={questions}
          onRefresh={onRefresh}
          addToast={addToast}
        />
      )}

      {/* Clear All Confirmation Modal */}
      {confirmClearAll && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-white border border-rose-200 rounded-3xl shadow-2xl p-6">
            <div className="flex items-center gap-3 text-rose-600 mb-3">
              <Trash2 className="w-6 h-6" />
              <h3 className="text-lg font-black text-slate-900">Purge All Repositories?</h3>
            </div>
            <p className="text-xs text-slate-600 font-medium leading-relaxed mb-4">
              This will clear all repositories and questions from the database so you can start with a 100% clean list.
            </p>
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
              <button
                onClick={() => setConfirmClearAll(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleClearAllData}
                className="px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold shadow-md shadow-rose-600/30"
              >
                Confirm Clear
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
