'use client';

import { useAuthStore } from '@/store';

export function UserProfile() {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
        {user.name?.charAt(0).toUpperCase() ||
          user.email.charAt(0).toUpperCase()}
      </div>

      <div className="hidden md:block text-sm">
        <p className="font-medium text-gray-900 dark:text-white">
          {user.name || 'User'}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {user.email}
        </p>
      </div>
    </div>
  );
}
