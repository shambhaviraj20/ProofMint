import React, { useEffect } from 'react';
import { useIdeaStore } from '../store/ideaStore';
import { useAuthStore } from '../store/authStore';
import IdeaCard from './IdeaCard';
import { Loader2, Globe } from 'lucide-react';

function PublicFeed() {
  const { publicIdeas, loading, loadPublicIdeas } = useIdeaStore();
  const { actor } = useAuthStore();

  // Load ideas when the component mounts
  useEffect(() => {
    if (actor) {
      loadPublicIdeas(actor);
    }
  }, [actor, loadPublicIdeas]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Public Feed</h2>
        <p className="text-gray-600 mt-1">Browse public ideas from the community</p>
      </div>

      {publicIdeas.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
          <Globe className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No public ideas yet</h3>
          <p className="text-gray-600">Be the first to share a public idea with the community!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {publicIdeas.map(idea => (
            <IdeaCard key={idea.id} idea={idea} />
          ))}
        </div>
      )}
    </div>
  );
}

export default PublicFeed;
