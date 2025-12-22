import { CounterExample, OptimizedCounterDisplay } from '@/components/examples';

export default function CounterExamplePage() {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <div className="text-sm text-gray-500 mb-2">Examples / Counter</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Counter Store</h1>
        <p className="text-lg text-gray-600">
          Basic Zustand usage with persist middleware. State persists in
          localStorage across page reloads.
        </p>
      </div>

      {/* Examples Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Live Examples
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <CounterExample />
          <OptimizedCounterDisplay />
        </div>
      </div>

      {/* Key Concepts Section */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Key Concepts
        </h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Persist Middleware
            </h3>
            <p className="text-gray-600 mb-2">
              The counter store uses the{' '}
              <code className="bg-gray-100 px-2 py-1 rounded">persist</code>
              middleware to automatically save state to localStorage. This means
              your counter value will be preserved even after closing the
              browser.
            </p>
            <div className="bg-gray-50 p-4 rounded mt-2">
              <p className="text-sm text-gray-700 mb-1 font-medium">
                Storage Key:
              </p>
              <code className="text-sm text-blue-600">counter-storage</code>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Selector Optimization
            </h3>
            <p className="text-gray-600 mb-2">
              The{' '}
              <code className="bg-gray-100 px-2 py-1 rounded">
                OptimizedCounterDisplay
              </code>
              component demonstrates how to use selectors to optimize
              re-renders. By selecting only the specific state you need,
              components only re-render when that particular piece of state
              changes.
            </p>
            <pre className="bg-gray-50 p-4 rounded text-sm overflow-x-auto mt-2">
              <code>{`// Only re-renders when count changes
const count = useCounterStore(state => state.count);`}</code>
            </pre>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Redux DevTools Integration
            </h3>
            <p className="text-gray-600">
              Open Redux DevTools in your browser to see all state changes in
              real-time. You can track every action (increment, decrement,
              reset) and even time-travel through state changes.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Store Implementation
            </h3>
            <p className="text-gray-600 mb-2">
              The counter store is located at{' '}
              <code className="bg-gray-100 px-2 py-1 rounded">
                apps/fe/src/store/useCounterStore.ts
              </code>
            </p>
            <ul className="list-disc list-inside text-gray-600 ml-4 space-y-1 mt-2">
              <li>State: count (number)</li>
              <li>Actions: increment, decrement, reset, incrementByAmount</li>
              <li>Middleware: devtools, persist</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
