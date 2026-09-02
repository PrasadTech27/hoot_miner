import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LandingHero } from './components/LandingHero';
import { FeatureGrid } from './components/FeatureGrid';
import { RepositoryHub } from './components/RepositoryHub';
import { RepositoryDetailView } from './components/RepositoryDetailView';
import { CodeCompiler } from './components/CodeCompiler';
import { ToastContainer } from './components/Toast';
import { Footer } from './components/Footer';
import { 
  fetchRepositories, 
  fetchQuestions, 
  seedInitialDataIfNeeded, 
  subscribeToRepositories 
} from './services/db';

export function App() {
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'repos' | 'repo-detail' | 'compiler'
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);

  const [repositories, setRepositories] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [toasts, setToasts] = useState([]);

  // Toast Helper
  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Fetch Data on Load
  const loadData = async () => {
    try {
      await seedInitialDataIfNeeded();
      const repos = await fetchRepositories();
      const qList = await fetchQuestions();
      setRepositories(repos);
      setQuestions(qList);
    } catch (err) {
      console.warn("Data load error:", err);
    }
  };

  useEffect(() => {
    loadData();

    // Subscribe to Firebase realtime database changes
    const unsubscribe = subscribeToRepositories((newRepos) => {
      setRepositories(newRepos);
    });

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  // Navigation handlers
  const handleOpenRepoDetail = (repo, questionId = null) => {
    setSelectedRepo(repo);
    setSelectedQuestionId(questionId);
    setActiveTab('repo-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-purple-500/20 selection:text-purple-900">
      
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content Router */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <>
            <LandingHero
              onLaunchWorkspace={() => setActiveTab('repos')}
              onOpenCompiler={() => setActiveTab('compiler')}
              repoCount={repositories.length}
              questionCount={questions.length}
            />
            <FeatureGrid />
          </>
        )}

        {activeTab === 'repos' && (
          <RepositoryHub
            repositories={repositories}
            questions={questions}
            onSelectRepo={handleOpenRepoDetail}
          />
        )}

        {activeTab === 'repo-detail' && selectedRepo && (
          <RepositoryDetailView
            repo={selectedRepo}
            questions={questions}
            onBack={() => setActiveTab('repos')}
            addToast={addToast}
            initialQuestionId={selectedQuestionId}
          />
        )}

        {activeTab === 'compiler' && (
          <CodeCompiler addToast={addToast} />
        )}
      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
}

export default App;
