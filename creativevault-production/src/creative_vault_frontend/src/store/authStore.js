import { create } from 'zustand';
import { AnonymousIdentity } from '@dfinity/agent';
import toast from 'react-hot-toast';

import { createActor, canisterId } from '../../../declarations/idea_vault';

const anonymousIdentity = new AnonymousIdentity();
const anonymousPrincipal = anonymousIdentity.getPrincipal();

const createDefaultActor = () => {
  if (!canisterId) {
    console.error("Cannot create actor: canister ID is missing");
    return null;
  }

  const isIC = import.meta.env.VITE_DFX_NETWORK === 'ic';

  const agentOptions = {
    host: isIC ? 'https://ic0.app' : 'http://127.0.0.1:4944',
    identity: anonymousIdentity,
  };

  return createActor(canisterId, { agentOptions });
};

export const useAuthStore = create((set) => ({
  isAuthenticated: false,
  principal: anonymousPrincipal,
  actor: null,
  loading: false,

  initialize: async () => {
    set({ loading: true });
    try {
      const actor = createDefaultActor();
      if (!actor) throw new Error('Actor creation failed');

      set({
        actor,
        isAuthenticated: false,
        loading: false,
      });

      console.log('✅ Actor initialized');
      console.log('📍 Principal:', anonymousPrincipal.toText());
    } catch (error) {
      console.error('❌ Actor init failed:', error);
      toast.error('Failed to connect to local replica');
      set({ loading: false });
    }
  },

  login: async () => {
    set({ isAuthenticated: true });
    toast.success('Connected (demo mode)');
  },

  logout: async () => {
    set({ isAuthenticated: false });
    toast.info('Disconnected');
  },
}));
