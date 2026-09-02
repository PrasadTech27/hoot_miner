import React, { useState, useEffect } from 'react';
import { ShieldCheck, Terminal, ArrowLeft, RefreshCw, LogOut } from 'lucide-react';
import { AdminLogin } from './components/Admin/AdminLogin';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { ToastContainer } from './components/Toast';
import { fetchRepositories, fetchQuestions, seedInitialDataIfNeeded, subscribeToRepositories } from './services/db';

export function AdminApp() {
  const [adminUser, setAdminUser] = useState(null);
  const [repositories, setRepositories] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const loadData = async () => {
    try {
      await seedInitialDataIfNeeded();
      const repos = await fetchRepositories();
      const qList = await fetchQuestions();
      setRepositories(repos);
      setQuestions(qList);
    } catch (err) {
      console.warn("Admin data load error:", err);
    }
  };

  useEffect(() => {
    loadData();

    const unsubscribe = subscribeToRepositories((newRepos) => {
      setRepositories(newRepos);
    });

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-purple-500/20 selection:text-purple-900">
      
      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* Admin Standalone Header */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/90 backdrop-blur-xl shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 via-pink-500 to-sky-500 p-[1.5px] shadow-sm">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-slate-900">Hoot <span className="gradient-text-purple">Miner</span></span>
                <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase rounded-lg bg-purple-100 text-purple-800 border border-purple-200">
                  Admin Portal
                </span>
              </div>
              <div className="text-[11px] text-slate-500 font-medium">Management & Solution Controls</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="/index.html"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 hover:text-purple-700 hover:border-purple-300 transition-all shadow-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-purple-600" />
              <span>Public Client App</span>
            </a>
          </div>

        </div>
      </header>

      {/* Admin Content Area */}
      <main className="flex-1">
        {adminUser ? (
          <AdminDashboard
            adminUser={adminUser}
            onLogout={() => {
              setAdminUser(null);
              addToast('Logged out of Admin Portal', 'info');
            }}
            repositories={repositories}
            questions={questions}
            onRefresh={loadData}
            addToast={addToast}
          />
        ) : (
          <AdminLogin
            onLoginSuccess={(user) => setAdminUser(user)}
            addToast={addToast}
          />
        )}
      </main>

      {/* Standalone Admin Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500 font-medium">
        <div>Hoot Miner Admin System • Restricted Portal • All Actions Logged</div>
      </footer>

    </div>
  );
}

export default AdminApp;
