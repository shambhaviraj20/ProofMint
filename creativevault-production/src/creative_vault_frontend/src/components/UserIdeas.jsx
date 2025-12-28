import React, { useEffect } from 'react';
import { useIdeaStore } from '../store/ideaStore';
import { useAuthStore } from '../store/authStore';
import IdeaCard from './IdeaCard';
import { Loader2, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

function UserIdeas() {
  const { ideas, loading, loadUserIdeas } = useIdeaStore();
  const { actor } = useAuthStore();

  useEffect(() => {
    if (actor) {
      loadUserIdeas(actor);
    }
  }, [actor, loadUserIdeas]);

  const handleReveal = async (ideaId) => {
    if (!actor) return;
    
    const toastId = toast.loading('Revealing idea...');
    try {
      const result = await actor.revealIdea(ideaId);
      
      if ('ok' in result) {
        toast.success('Idea revealed successfully!', { id: toastId });
        loadUserIdeas(actor);
      } else {
        toast.error(`Failed: ${result.err}`, { id: toastId });
      }
    } catch (error) {
      console.error('Error revealing idea:', error);
      toast.error('Failed to reveal idea', { id: toastId });
    }
  };

  const handleUpdate = async (ideaId, newDescription, newTags) => {
    if (!actor) return;
    
    const toastId = toast.loading('Updating idea...');
    try {
      const result = await actor.updateIdea(ideaId, newDescription, newTags);
      
      if ('ok' in result) {
        toast.success('Idea updated successfully!', { id: toastId });
        loadUserIdeas(actor);
      } else {
        toast.error(`Failed: ${result.err}`, { id: toastId });
      }
    } catch (error) {
      console.error('Error updating idea:', error);
      toast.error('Failed to update idea', { id: toastId });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-yellow-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white">My Ideas</h2>
        <p className="text-gray-400 mt-1">Manage and edit your submitted ideas</p>
      </div>

      {ideas.length === 0 ? (
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700 shadow-lg p-12 text-center">
          <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No ideas yet</h3>
          <p className="text-gray-400">You haven't submitted any ideas yet. Get started by submitting your first idea!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {ideas.map(idea => (
            <IdeaCard 
              key={idea.id} 
              idea={idea} 
              onReveal={handleReveal}
              onUpdate={handleUpdate}
              showControls={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default UserIdeas;
