import React, { useState } from 'react';
import { Globe, Lock, Clock, Eye, FileText, Hash, Shield, Edit, Save, X, ChevronDown } from 'lucide-react';

const IdeaCard = ({ idea, onReveal, onUpdate, showControls = false }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showVisibilityMenu, setShowVisibilityMenu] = useState(false);
  const [editedDescription, setEditedDescription] = useState(idea.description);
  const [editedTags, setEditedTags] = useState(idea.tags.join(', '));

  const getStatusIcon = (status) => {
    const statusKey = Object.keys(status)[0];
    switch (statusKey) {
      case 'Public': return Globe;
      case 'Private': return Lock;
      case 'RevealLater': return Clock;
      default: return FileText;
    }
  };

  const getStatusColor = (status) => {
    const statusKey = Object.keys(status)[0];
    switch (statusKey) {
      case 'Public': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'Private': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'RevealLater': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    }
  };

  const getStatusText = (status) => {
    return Object.keys(status)[0];
  };

  const formatDate = (timestamp) => {
    try {
      const milliseconds = Number(timestamp) / 1_000_000;
      return new Date(milliseconds).toLocaleString();
    } catch (error) {
      return 'Invalid date';
    }
  };

  const handleSaveEdit = async () => {
    if (!editedDescription.trim()) {
      alert('Description cannot be empty');
      return;
    }

    const tagsArray = editedTags.split(',').map(t => t.trim()).filter(t => t.length > 0);
    
    if (onUpdate) {
      await onUpdate(idea.id, editedDescription, tagsArray);
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedDescription(idea.description);
    setEditedTags(idea.tags.join(', '));
    setIsEditing(false);
  };

  const StatusIcon = getStatusIcon(idea.status);
  const statusText = getStatusText(idea.status);

  const visibilityOptions = [
    { value: 'Public', icon: Globe, label: 'Public', color: 'text-green-400' },
    { value: 'Private', icon: Lock, label: 'Private', color: 'text-red-400' },
    { value: 'RevealLater', icon: Clock, label: 'Reveal Later', color: 'text-yellow-400' }
  ];

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700 shadow-lg hover:shadow-2xl transition-all p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-xl font-bold text-white">{idea.title}</h3>
            
            {/* Status Badge - Simple version without dropdown for now */}
            <span className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(idea.status)}`}>
              <StatusIcon className="w-3 h-3" />
              <span>{statusText}</span>
            </span>
          </div>
          
          <div className="mb-2">
            <span className="text-xs text-gray-400">ID: </span>
            <code className="text-xs text-yellow-400 font-mono">{idea.id}</code>
          </div>

          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <span className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{formatDate(idea.timestamp)}</span>
            </span>
            <span className="flex items-center space-x-1">
              <FileText className="w-4 h-4" />
              <span>v{Number(idea.version)}</span>
            </span>
          </div>
        </div>

        {/* Edit Button */}
        {showControls && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="ml-4 p-2 bg-slate-700 hover:bg-slate-600 text-gray-300 rounded-lg transition-colors"
            title="Edit description and tags"
          >
            <Edit className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Description - Editable */}
      {isEditing ? (
        <div className="mb-4">
          <label className="text-xs text-gray-400 mb-1 block">Description</label>
          <textarea
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm resize-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            rows="4"
          />
        </div>
      ) : (
        <p className="text-gray-300 mb-4 whitespace-pre-wrap">{idea.description}</p>
      )}

      {/* Tags - Editable */}
      {isEditing ? (
        <div className="mb-4">
          <label className="text-xs text-gray-400 mb-1 block">Tags (comma-separated)</label>
          <input
            type="text"
            value={editedTags}
            onChange={(e) => setEditedTags(e.target.value)}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            placeholder="tag1, tag2, tag3"
          />
        </div>
      ) : (
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-xs font-medium border border-indigo-500/30">
            {idea.category}
          </span>
          {idea.tags && idea.tags.map((tag, index) => (
            <span key={index} className="px-3 py-1 bg-slate-700/50 text-gray-300 rounded-full text-xs border border-slate-600">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Edit Actions */}
      {isEditing && (
        <div className="flex space-x-2 mb-4">
          <button
            onClick={handleSaveEdit}
            className="flex items-center space-x-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
          <button
            onClick={handleCancelEdit}
            className="flex items-center space-x-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-gray-300 rounded-lg text-sm font-medium transition-colors"
          >
            <X className="w-4 h-4" />
            <span>Cancel</span>
          </button>
        </div>
      )}

      {/* IPFS Hash */}
      {idea.ipfsHash && idea.ipfsHash.length > 0 && (
        <div className="mb-4 p-3 bg-blue-500/10 rounded-lg border border-blue-500/30">
          <div className="flex items-center space-x-2 mb-1">
            <Hash className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-medium text-blue-300">IPFS Hash</span>
          </div>
          <code className="text-xs text-blue-400 font-mono break-all">
            {idea.ipfsHash[0]}
          </code>
        </div>
      )}

      {/* Proof Hash */}
      <div className="p-3 bg-slate-700/30 rounded-lg border border-slate-600 mb-4">
        <div className="flex items-center space-x-2 mb-1">
          <Shield className="w-4 h-4 text-gray-400" />
          <span className="text-xs font-medium text-gray-300">Blockchain Proof Hash</span>
        </div>
        <code className="text-xs text-gray-400 font-mono break-all">
          {idea.proofHash}
        </code>
      </div>

      {/* Reveal Button - ALWAYS AT THE BOTTOM */}
      {showControls && statusText === 'RevealLater' && !idea.isRevealed && (
        <button
          onClick={() => onReveal && onReveal(idea.id)}
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl"
        >
          <Eye className="w-5 h-5" />
          <span>Reveal Idea Now</span>
        </button>
      )}

      {/* Already Revealed */}
      {showControls && statusText === 'RevealLater' && idea.isRevealed && (
        <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center space-x-2">
          <Eye className="w-4 h-4 text-green-400" />
          <span className="text-sm text-green-300">This idea has been revealed</span>
        </div>
      )}
    </div>
  );
};

export default IdeaCard;
