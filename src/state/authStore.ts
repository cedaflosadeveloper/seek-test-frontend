'use client';

import { create } from 'zustand';
import { container } from '@/infra/container';
import { tokenStorage } from '@/infra/storage/tokenStorage';
import { createAuthUseCases } from '@/core/usecases/authUseCases';
import { useTaskStore } from '@/state/taskStore';
import { logoutAction } from '@/app/login/actions';

const authUseCases = createAuthUseCases(container.authRepo);

type AuthState = {
  userEmail: string | null;
  status: 'idle' | 'loading' | 'error';
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  hydrate: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  userEmail: null,
  status: 'idle',
  error: null,
  async login(username, password) {
    set({ status: 'loading', error: null });
    try {
      const result = await authUseCases.login({ username, password });
      tokenStorage.setUser(result.userEmail);
      set({ userEmail: result.userEmail, status: 'idle' });
    } catch (error) {
      set({
        status: 'error',
        error: error instanceof Error ? error.message : 'Error inesperado'
      });
    }
  },
  logout() {
    void logoutAction();
    tokenStorage.clear();
    useTaskStore.setState({ tasks: [], status: 'idle', error: null });
    set({ userEmail: null, status: 'idle', error: null });
  },
  hydrate() {
    const userEmail = tokenStorage.getUser();
    set({ userEmail });
  }
}));
