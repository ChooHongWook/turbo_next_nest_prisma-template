import { UserExample } from '@/components/examples';

export default function UserExamplePage() {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <div className="text-sm text-gray-500 mb-2">Examples / User</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-3">User Store</h1>
        <p className="text-lg text-gray-600">
          Managing authentication state with loading and error states.
          Demonstrates real-world patterns for handling user sessions.
        </p>
      </div>

      {/* Example Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Live Example
        </h2>
        <UserExample />
      </div>

      {/* Key Concepts Section */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Key Concepts
        </h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Loading States
            </h3>
            <p className="text-gray-600 mb-2">
              The user store includes an{' '}
              <code className="bg-gray-100 px-2 py-1 rounded">isLoading</code>
              flag to track async operations. This allows components to show
              loading indicators during authentication processes.
            </p>
            <pre className="bg-gray-50 p-4 rounded text-sm overflow-x-auto mt-2">
              <code>{`const { isLoading } = useUserStore();
if (isLoading) return <Spinner />;`}</code>
            </pre>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Error Handling
            </h3>
            <p className="text-gray-600 mb-2">
              The store maintains an{' '}
              <code className="bg-gray-100 px-2 py-1 rounded">error</code>
              state to capture and display authentication errors. This provides
              clear feedback to users when operations fail.
            </p>
            <pre className="bg-gray-50 p-4 rounded text-sm overflow-x-auto mt-2">
              <code>{`const { error, setError } = useUserStore();
if (error) return <ErrorMessage message={error} />;`}</code>
            </pre>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Conditional Rendering
            </h3>
            <p className="text-gray-600 mb-2">
              The example demonstrates how to conditionally render UI based on
              authentication state. When a user is logged in, show their
              profile; otherwise, show the login form.
            </p>
            <pre className="bg-gray-50 p-4 rounded text-sm overflow-x-auto mt-2">
              <code>{`const { user } = useUserStore();
return user ? <Profile user={user} /> : <LoginForm />;`}</code>
            </pre>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Form Handling
            </h3>
            <p className="text-gray-600 mb-2">
              The login form shows how to handle form submissions and update
              store state. Input validation and error feedback are included in
              the implementation.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Store Implementation
            </h3>
            <p className="text-gray-600 mb-2">
              The user store is located at{' '}
              <code className="bg-gray-100 px-2 py-1 rounded">
                apps/fe/src/store/useUserStore.ts
              </code>
            </p>
            <ul className="list-disc list-inside text-gray-600 ml-4 space-y-1 mt-2">
              <li>
                State: user (User | null), isLoading (boolean), error (string |
                null)
              </li>
              <li>
                Actions: setUser, clearUser, updateUser, setLoading, setError
              </li>
              <li>Middleware: devtools</li>
              <li>
                No persist - session data should not persist across browser
                sessions
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
