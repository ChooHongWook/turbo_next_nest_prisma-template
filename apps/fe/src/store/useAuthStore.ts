import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { User } from '@repo/api';
import { TokenStorage } from '@/lib/auth/storage';

interface AuthState {
  isAuthenticated: boolean;
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
  user: User | null;

  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  clearAuth: () => void;
  setUser: (user: User) => void;
  updateTokens: (accessToken: string, refreshToken: string) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setInitialized: (initialized: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    (set) => ({
      isAuthenticated: false,
      isInitialized: false,
      isLoading: false,
      error: null,
      user: null,

      setAuth: (user, accessToken, refreshToken) => {
        TokenStorage.setTokens(accessToken, refreshToken);
        set(
          {
            user,
            isAuthenticated: true,
            isInitialized: true,
            error: null,
            isLoading: false,
          },
          false,
          'setAuth'
        );
      },

      clearAuth: () => {
        TokenStorage.clearTokens();
        set(
          {
            user: null,
            isAuthenticated: false,
            error: null,
            isLoading: false,
          },
          false,
          'clearAuth'
        );
      },

      setUser: (user) =>
        set({ user, isAuthenticated: true }, false, 'setUser'),

      updateTokens: (accessToken, refreshToken) => {
        TokenStorage.setTokens(accessToken, refreshToken);
      },

      setLoading: (isLoading) => set({ isLoading }, false, 'setLoading'),

      setError: (error) => set({ error, isLoading: false }, false, 'setError'),

      setInitialized: (isInitialized) =>
        set({ isInitialized }, false, 'setInitialized'),
    }),
    {
      name: 'AuthStore',
    }
  )
);
