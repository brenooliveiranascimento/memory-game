import { create } from 'zustand';
import { useAuthStore } from '@/store/auth';

interface LoginViewModel {
  name: string;
  isLoading: boolean;
  error: string | null;
  setName: (name: string) => void;
  handleLogin: () => Promise<boolean>;
  clearError: () => void;
}

export const useLoginViewModel = create<LoginViewModel>((set, get) => ({
  name: '',
  isLoading: false,
  error: null,

  setName: (name: string) => {
    set({ name, error: null });
  },

  handleLogin: async () => {
    const { name } = get();
    const trimmedName = name.trim();

    if (!trimmedName) {
      set({ error: 'Por favor, digite seu nome' });
      return false;
    }

    set({ isLoading: true, error: null });

    try {
      useAuthStore.getState().setAuthenticated(true, trimmedName);
      set({ isLoading: false });
      return true;
    } catch {
      set({
        error: 'Erro ao fazer login. Tente novamente.',
        isLoading: false,
      });
      return false;
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
