import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}

interface TodoState {
  todos: Todo[];
  filter: 'all' | 'active' | 'completed';
  addTodo: (title: string) => void;
  toggleTodo: (id: string) => void;
  removeTodo: (id: string) => void;
  setFilter: (filter: 'all' | 'active' | 'completed') => void;
  clearCompleted: () => void;
}

/**
 * Todo Store Example using Immer
 *
 * Demonstrates using immer middleware for immutable state updates.
 * Immer allows writing mutable-looking code that produces immutable updates.
 */
export const useTodoStore = create<TodoState>()(
  devtools(
    immer((set) => ({
      todos: [],
      filter: 'all',

      addTodo: (title: string) =>
        set((state) => {
          state.todos.push({
            id: crypto.randomUUID(),
            title,
            completed: false,
            createdAt: new Date(),
          });
        }),

      toggleTodo: (id: string) =>
        set((state) => {
          const todo = state.todos.find((t) => t.id === id);
          if (todo) {
            todo.completed = !todo.completed;
          }
        }),

      removeTodo: (id: string) =>
        set((state) => {
          state.todos = state.todos.filter((t) => t.id !== id);
        }),

      setFilter: (filter: 'all' | 'active' | 'completed') =>
        set((state) => {
          state.filter = filter;
        }),

      clearCompleted: () =>
        set((state) => {
          state.todos = state.todos.filter((t) => !t.completed);
        }),
    })),
    {
      name: 'TodoStore',
    }
  )
);
