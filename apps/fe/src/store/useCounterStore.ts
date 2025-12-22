import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface CounterState {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
  incrementByAmount: (amount: number) => void;
}

/**
 * Counter Store Example
 *
 * A simple counter store with basic increment/decrement operations.
 * Uses devtools middleware for Redux DevTools integration.
 * Uses persist middleware to save state to localStorage.
 */
export const useCounterStore = create<CounterState>()(
  devtools(
    persist(
      (set) => ({
        count: 0,
        increment: () => set((state) => ({ count: state.count + 1 })),
        decrement: () => set((state) => ({ count: state.count - 1 })),
        reset: () => set({ count: 0 }),
        incrementByAmount: (amount: number) =>
          set((state) => ({ count: state.count + amount })),
      }),
      {
        name: 'counter-storage', // localStorage key
      },
    ),
    {
      name: 'CounterStore', // DevTools name
    },
  ),
);
