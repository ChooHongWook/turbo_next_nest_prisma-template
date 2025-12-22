import Link from 'next/link';
import { ExampleCard } from '@/components/zustand';

export default function ZustandExamplesPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Zustand Examples
          </h1>
          <p className="text-gray-600">
            Interactive examples demonstrating Zustand state management patterns
          </p>
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> All stores use Redux DevTools. Open your
              browser&apos;s Redux DevTools extension to inspect state changes
              in real-time.
            </p>
          </div>
        </div>

        {/* Cards Grid Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Choose an Example
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ExampleCard
              title="Counter Store"
              description="Basic Zustand usage with persist middleware. State persists in localStorage."
              features={[
                'State persistence in localStorage',
                'Redux DevTools integration',
                'Optimized selectors demo',
              ]}
              href="/zustand-examples/counter"
              badgeColor="green"
            />

            <ExampleCard
              title="User Store"
              description="Managing authentication state with loading and error states."
              features={[
                'Loading and error states',
                'Conditional rendering patterns',
                'Form handling',
              ]}
              href="/zustand-examples/user"
              badgeColor="blue"
            />

            <ExampleCard
              title="Todo Store"
              description="Complex state management using Immer middleware for immutable updates."
              features={[
                'Mutable-style immutable updates',
                'Filtering and sorting',
                'List management patterns',
              ]}
              href="/zustand-examples/todo"
              badgeColor="purple"
            />
          </div>
        </div>

        {/* Implementation Guide Section */}
        <section className="mt-12">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Implementation Guide
            </h2>

            <div className="space-y-4 text-sm">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  Store Location
                </h3>
                <p className="text-gray-600 mb-1">
                  All stores are located in{' '}
                  <code className="bg-gray-100 px-2 py-1 rounded">
                    apps/fe/src/store/
                  </code>
                </p>
                <ul className="list-disc list-inside text-gray-600 ml-4 space-y-1">
                  <li>useCounterStore.ts - Simple counter with persist</li>
                  <li>useUserStore.ts - User authentication state</li>
                  <li>useTodoStore.ts - Todo list with Immer</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  Usage in Components
                </h3>
                <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
                  <code>{`
"use client"; // Required for Zustand
import { useCounterStore } from &apos;@/store&apos;;

export function MyComponent() {
  // Get entire store
  const { count, increment } = useCounterStore();

  // Or use selector (optimized)
  const count = useCounterStore(state => state.count);

  return <div>{count}</div>;
}
`}</code>
                </pre>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  Middleware Used
                </h3>
                <ul className="list-disc list-inside text-gray-600 ml-4 space-y-1">
                  <li>
                    <strong>devtools</strong> - Redux DevTools integration
                  </li>
                  <li>
                    <strong>persist</strong> - LocalStorage persistence
                  </li>
                  <li>
                    <strong>immer</strong> - Mutable-style immutable updates
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  Next.js 15 Considerations
                </h3>
                <ul className="list-disc list-inside text-gray-600 ml-4 space-y-1">
                  <li>
                    Zustand only works in Client Components (
                    <code className="bg-gray-100 px-1 rounded">
                      &apos;use client&apos;
                    </code>
                    )
                  </li>
                  <li>
                    Server Components should use Prisma directly for data
                    fetching
                  </li>
                  <li>
                    Use Zustand for client-side state, not server data fetching
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
