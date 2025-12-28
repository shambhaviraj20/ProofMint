import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { Activity, Clock, FileText, Eye, Edit, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const ActivityLogs = () => {
  const { actor, principal } = useAuthStore();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (actor && principal) {
      loadLogs();
    }
  }, [actor, principal]);

  const loadLogs = async () => {
    setLoading(true);
    try {
      // Get user's ideas to construct activity logs
      const userIdeas = await actor.getUserIdeas();
      
      const activityLogs = userIdeas.map(idea => ({
        id: idea.id,
        type: 'idea_created',
        title: idea.title,
        timestamp: idea.timestamp,
        status: Object.keys(idea.status)[0],
        version: Number(idea.version),
        isRevealed: idea.isRevealed
      })).sort((a, b) => Number(b.timestamp) - Number(a.timestamp));

      setLogs(activityLogs);
    } catch (error) {
      console.error('Failed to load logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    try {
      const milliseconds = Number(timestamp) / 1_000_000;
      return new Date(milliseconds).toLocaleString();
    } catch (error) {
      return 'Invalid date';
    }
  };

  const getLogIcon = (log) => {
    if (log.status === 'RevealLater' && log.isRevealed) return Eye;
    if (log.version > 1) return Edit;
    return FileText;
  };

  const getLogColor = (log) => {
    if (log.status === 'Public') return 'text-green-400 bg-green-400/10 border-green-400/20';
    if (log.status === 'Private') return 'text-red-400 bg-red-400/10 border-red-400/20';
    if (log.status === 'RevealLater') return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
    return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
  };

  const getLogMessage = (log) => {
    if (log.status === 'RevealLater' && log.isRevealed) {
      return `Revealed idea: ${log.title}`;
    }
    if (log.version > 1) {
      return `Updated idea: ${log.title} (v${log.version})`;
    }
    return `Created ${log.status.toLowerCase()} idea: ${log.title}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-yellow-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <Activity className="w-8 h-8 text-yellow-400" />
          <h2 className="text-2xl font-bold text-white">Activity Logs</h2>
        </div>
        <p className="text-gray-400">Your recent blockchain activity</p>
      </div>

      {logs.length === 0 ? (
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700 shadow-lg p-12 text-center">
          <Activity className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No activity yet</h3>
          <p className="text-gray-400">Your blockchain activities will appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {logs.map((log, index) => {
            const LogIcon = getLogIcon(log);
            return (
              <div 
                key={`${log.id}-${index}`}
                className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700 shadow-lg p-4 hover:shadow-xl transition-all"
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg border ${getLogColor(log)}`}>
                    <LogIcon className="w-5 h-5" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <p className="text-white font-medium">{getLogMessage(log)}</p>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getLogColor(log)}`}>
                        {log.status}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{formatDate(log.timestamp)}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <FileText className="w-3 h-3" />
                        <code className="font-mono text-xs text-yellow-400">{log.id}</code>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Blockchain Info Panel */}
      <div className="mt-6 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700 shadow-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Blockchain Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-700/30 p-4 rounded-lg">
            <p className="text-xs text-gray-400 mb-1">Your Principal ID</p>
            <code className="text-xs text-blue-400 font-mono break-all">
              {principal ? principal.toText() : 'Not connected'}
            </code>
          </div>
          <div className="bg-slate-700/30 p-4 rounded-lg">
            <p className="text-xs text-gray-400 mb-1">Total Activities</p>
            <p className="text-2xl font-bold text-white">{logs.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityLogs;
