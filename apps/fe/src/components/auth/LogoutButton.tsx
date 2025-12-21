'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';
import { logout as logoutApi } from '@/api/auth';
import { useState } from 'react';

export function LogoutButton() {
  const router = useRouter();
  const { clearAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);

    try {
      await logoutApi();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearAuth();
      setIsLoading(false);
      router.push('/auth/login');
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-sm font-medium"
    >
      {isLoading ? 'Logging out...' : 'Logout'}
    </button>
  );
}
