import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
}

interface UserState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  setUser: (user: User) => void;
  clearUser: () => void;
  updateUser: (updates: Partial<User>) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

/**
 * User Store Example
 *
 * Manages user authentication state and user data.
 * This is a typical pattern for managing user session in client components.
 */
export const useUserStore = create<UserState>()(
  devtools(
    (set) => ({
      user: null,
      isLoading: false,
      error: null,

      setUser: (user: User) =>
        set({ user, error: null, isLoading: false }, false, 'setUser'),

      clearUser: () =>
        set({ user: null, error: null, isLoading: false }, false, 'clearUser'),

      updateUser: (updates: Partial<User>) =>
        set(
          (state) => ({
            user: state.user ? { ...state.user, ...updates } : null,
          }),
          false,
          'updateUser'
        ),

      setLoading: (isLoading: boolean) =>
        set({ isLoading }, false, 'setLoading'),

      setError: (error: string | null) =>
        set({ error, isLoading: false }, false, 'setError'),
    }),
    {
      name: 'UserStore',
    }
  )
);
