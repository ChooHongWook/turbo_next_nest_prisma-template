'use client';

import { useCounterStore } from '@/store';

/**
 * Counter Example Component
 *
 * Demonstrates basic Zustand usage with a simple counter.
 * Shows how to:
 * - Read state from the store
 * - Call actions to update state
 * - Use selector for optimized re-renders
 */
export function CounterExample() {
  const { count, increment, decrement, reset, incrementByAmount } =
    useCounterStore();

  return (
    <div className="p-6 border rounded-lg shadow-sm bg-white">
      <h2 className="text-2xl font-bold mb-4">Counter Example</h2>

      <div className="space-y-4">
        <div className="text-4xl font-bold text-center py-4">{count}</div>

        <div className="flex gap-2 justify-center flex-wrap">
          <button
            onClick={decrement}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Decrement
          </button>

          <button
            onClick={increment}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          >
            Increment
          </button>

          <button
            onClick={() => incrementByAmount(5)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            +5
          </button>

          <button
            onClick={reset}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          >
            Reset
          </button>
        </div>

        <p className="text-sm text-gray-600 text-center">
          This counter state persists in localStorage
        </p>
      </div>
    </div>
  );
}

/**
 * Optimized Counter Display
 *
 * Demonstrates using selectors to prevent unnecessary re-renders.
 * This component only re-renders when the count changes, not when actions change.
 */
export function OptimizedCounterDisplay() {
  // Using selector - only re-renders when count changes
  const count = useCounterStore((state) => state.count);

  return (
    <div className="p-4 border rounded bg-gray-50">
      <p className="text-sm text-gray-600">Optimized Display (selector usage)</p>
      <p className="text-2xl font-bold">Count: {count}</p>
    </div>
  );
}
