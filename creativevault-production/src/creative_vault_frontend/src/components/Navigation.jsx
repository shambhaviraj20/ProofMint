import React from 'react';
import { Plus, Lightbulb, Globe, Shield, Activity } from 'lucide-react';

const Navigation = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'submit', label: 'Submit Idea', icon: Plus },
    { id: 'my-ideas', label: 'My Ideas', icon: Lightbulb },
    { id: 'feed', label: 'Public Feed', icon: Globe },
    { id: 'proof', label: 'Generate Proof', icon: Shield },
    { id: 'logs', label: 'Activity Logs', icon: Activity }
  ];

  return (
    <nav className="bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-yellow-400 border-b-2 border-yellow-400 bg-yellow-400 bg-opacity-10'
                      : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
