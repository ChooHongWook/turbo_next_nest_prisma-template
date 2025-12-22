import { TodoExample } from '@/components/examples';

export default function TodoExamplePage() {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <div className="text-sm text-gray-500 mb-2">Examples / Todo</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          Todo Store (with Immer)
        </h1>
        <p className="text-lg text-gray-600">
          Complex state management using Immer middleware for immutable updates.
          Perfect for managing collections and nested data structures.
        </p>
      </div>

      {/* Example Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Live Example
        </h2>
        <TodoExample />
      </div>

      {/* Key Concepts Section */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Key Concepts
        </h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Immer Middleware Benefits
            </h3>
            <p className="text-gray-600 mb-2">
              The <code className="bg-gray-100 px-2 py-1 rounded">immer</code>
              middleware allows you to write mutable-style code that produces
              immutable updates. This makes complex state updates much more
              readable and maintainable.
            </p>
            <pre className="bg-gray-50 p-4 rounded text-sm overflow-x-auto mt-2">
              <code>{`// Without Immer - complex spread syntax
set(state => ({
  todos: state.todos.map(todo =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  )
}));

// With Immer - simple and readable
set(state => {
  const todo = state.todos.find(t => t.id === id);
  if (todo) todo.completed = !todo.completed;
});`}</code>
            </pre>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              List Management Patterns
            </h3>
            <p className="text-gray-600 mb-2">
              The todo store demonstrates common list operations:
            </p>
            <ul className="list-disc list-inside text-gray-600 ml-4 space-y-2 mt-2">
              <li>
                <strong>Adding items:</strong> Push new items to the array with
                generated IDs
              </li>
              <li>
                <strong>Updating items:</strong> Find and modify specific items
                by ID
              </li>
              <li>
                <strong>Removing items:</strong> Filter out unwanted items
              </li>
              <li>
                <strong>Bulk operations:</strong> Clear completed todos in one
                action
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Filtering Patterns
            </h3>
            <p className="text-gray-600 mb-2">
              The example shows how to implement view filters without modifying
              the underlying data. The filter state controls which todos are
              displayed while keeping the full list intact.
            </p>
            <pre className="bg-gray-50 p-4 rounded text-sm overflow-x-auto mt-2">
              <code>{`const { todos, filter } = useTodoStore();
const filteredTodos = todos.filter(todo => {
  if (filter === 'active') return !todo.completed;
  if (filter === 'completed') return todo.completed;
  return true; // 'all'
});`}</code>
            </pre>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Complex State Structure
            </h3>
            <p className="text-gray-600 mb-2">
              The todo store manages both the list of todos and UI state (the
              current filter). This demonstrates how to handle multiple related
              pieces of state in a single store.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Store Implementation
            </h3>
            <p className="text-gray-600 mb-2">
              The todo store is located at{' '}
              <code className="bg-gray-100 px-2 py-1 rounded">
                apps/fe/src/store/useTodoStore.ts
              </code>
            </p>
            <ul className="list-disc list-inside text-gray-600 ml-4 space-y-1 mt-2">
              <li>State: todos (Todo[]), filter (FilterType)</li>
              <li>
                Actions: addTodo, toggleTodo, removeTodo, setFilter,
                clearCompleted
              </li>
              <li>Middleware: devtools, immer</li>
              <li>Immer enables mutable-style syntax for immutable updates</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
