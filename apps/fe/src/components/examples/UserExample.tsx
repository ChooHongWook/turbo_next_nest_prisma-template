'use client';

import { useUserStore } from '@/store';
import { useState } from 'react';

/**
 * User Management Example
 *
 * Demonstrates managing complex state with Zustand.
 * Shows patterns for:
 * - Loading states
 * - Error handling
 * - Conditional rendering based on state
 * - Form handling with Zustand
 */
export function UserExample() {
  const { user, isLoading, error, setUser, clearUser, updateUser } =
    useUserStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  const handleLogin = () => {
    if (!formData.name || !formData.email) {
      return;
    }

    // Simulate login
    setUser({
      id: crypto.randomUUID(),
      name: formData.name,
      email: formData.email,
    });

    setFormData({ name: '', email: '' });
  };

  const handleUpdateName = () => {
    const newName = prompt('Enter new name:', user?.name);
    if (newName) {
      updateUser({ name: newName });
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 border rounded-lg shadow-sm bg-white">
        <p className="text-center">Loading...</p>
      </div>
    );
  }

  if (user) {
    return (
      <div className="p-6 border rounded-lg shadow-sm bg-white">
        <h2 className="text-2xl font-bold mb-4">User Profile</h2>

        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-sm text-gray-600">ID</p>
            <p className="font-mono text-sm">{user.id}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded">
            <p className="text-sm text-gray-600">Name</p>
            <p className="font-semibold">{user.name}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded">
            <p className="text-sm text-gray-600">Email</p>
            <p className="font-semibold">{user.email}</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded">
              {error}
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={handleUpdateName}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Update Name
            </button>

            <button
              onClick={clearUser}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 border rounded-lg shadow-sm bg-white">
      <h2 className="text-2xl font-bold mb-4">Login</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email"
          />
        </div>

        <button
          onClick={handleLogin}
          disabled={!formData.name || !formData.email}
          className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Login
        </button>
      </div>
    </div>
  );
}
