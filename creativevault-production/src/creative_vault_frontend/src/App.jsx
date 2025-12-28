import React, { useState, useEffect } from 'react';
import { useAuthStore } from './store/authStore';
import { useIdeaStore } from './store/ideaStore';

import Navigation from './components/Navigation';
import IdeaSubmission from './components/IdeaSubmission';
import UserIdeas from './components/UserIdeas';
import PublicFeed from './components/PublicFeed';
import ProofGenerator from './components/ProofGenerator';
import ActivityLogs from './components/ActivityLogs';
import ProofMintLogo from './pmlogo.png';
import { LogIn, LogOut } from 'lucide-react';

function App() {
  const { actor, initialize, principal, loading, isAuthenticated, login, logout } = useAuthStore();
  const { loadStats } = useIdeaStore();
  const [activeTab, setActiveTab] = useState('submit');

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    if (actor) {
      loadStats(actor);
    }
  }, [actor, loadStats]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-white text-lg font-medium">Connecting to blockchain...</p>
          <p className="text-gray-400 text-sm mt-2">Initializing Internet Computer canister</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900 flex items-center justify-center p-4">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 shadow-2xl p-12 max-w-md w-full text-center">
          <img src={ProofMintLogo} alt="ProofMint" className="h-20 w-20 mx-auto mb-6" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-2">
            ProofMint
          </h1>
          <p className="text-gray-400 mb-8">Decentralized IP Protection on Internet Computer</p>
          
          <button
            onClick={login}
            className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
          >
            <LogIn className="w-5 h-5" />
            <span>Login with Internet Identity</span>
          </button>
          
          <p className="text-xs text-gray-500 mt-6">
            Secure authentication powered by Internet Computer
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-800 to-slate-900 shadow-xl border-b border-slate-700 sticky top-0 z-50 backdrop-blur-md bg-opacity-90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <img src={ProofMintLogo} alt="ProofMint" className="h-10 w-10" />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  ProofMint
                </h1>
                <p className="text-xs text-gray-400">Decentralized IP Protection</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-xs text-gray-400">Authenticated</p>
                <p className="text-xs text-yellow-400 font-mono">
                  {principal.toText().slice(0, 12)}...
                </p>
              </div>
              <button
                onClick={logout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'submit' && <IdeaSubmission />}
        {activeTab === 'my-ideas' && <UserIdeas />}
        {activeTab === 'feed' && <PublicFeed />}
        {activeTab === 'proof' && <ProofGenerator />}
        {activeTab === 'logs' && <ActivityLogs />}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900/50 backdrop-blur-sm border-t border-slate-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-400">
            Powered by Internet Computer • Secured with Blockchain Technology
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
