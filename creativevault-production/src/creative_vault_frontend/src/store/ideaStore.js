import { create } from 'zustand';
import toast from 'react-hot-toast';

export const useIdeaStore = create((set, get) => ({
  ideas: [],
  publicIdeas: [],
  stats: { totalIdeas: 0, publicIdeas: 0, totalUsers: 0 },
  loading: false,

  submitIdea: async (actor, ideaData) => {
    if (!actor) {
      toast.error('Actor not found. Please refresh the page.');
      return;
    }

    set({ loading: true });
    const toastId = toast.loading('Submitting your idea to the blockchain...');
    
    try {
      const result = await actor.submitIdea(ideaData);
      
      if ('ok' in result) {
        toast.success(`Idea secured on blockchain! ID: ${result.ok}`, { id: toastId });
        
        await Promise.all([
          get().loadUserIdeas(actor),
          get().loadPublicIdeas(actor)
        ]);
        
        return result.ok;
      } else {
        throw new Error(result.err);
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast.error(`Submission failed: ${error.message}`, { id: toastId });
      return null;
    } finally {
      set({ loading: false });
    }
  },

  loadUserIdeas: async (actor) => {
    if (!actor) return;
    
    set({ loading: true });
    try {
      const userIdeas = await actor.getUserIdeas();
      set({ ideas: userIdeas, loading: false });
    } catch (error) {
      console.error('Failed to load user ideas:', error);
      toast.error(`Failed to load your ideas: ${error.message}`);
      set({ loading: false });
    }
  },

  loadPublicIdeas: async (actor) => {
    if (!actor) return;
    
    set({ loading: true });
    try {
      const publicIdeas = await actor.getPublicFeed([20], [], []);
      set({ publicIdeas, loading: false });
    } catch (error) {
      console.error('Failed to load public ideas:', error);
      toast.error(`Failed to load public feed: ${error.message}`);
      set({ loading: false });
    }
  },

  loadStats: async (actor) => {
    if (!actor) return;
    
    try {
      // Try to get stats, but don't fail if method doesn't exist
      const stats = await actor.getStats();
      set({ stats });
    } catch (error) {
      console.log('getStats not available, using default stats');
      // Use default stats if method doesn't exist
      set({ stats: { totalIdeas: 0, publicIdeas: 0, totalUsers: 0 } });
    }
  },

  getAllIdeaTexts: async (actor) => {
    const ideas = await actor.getPublicFeed([], [], []);
    return ideas.map(i => i.title + " " + i.description);
  },

}));
