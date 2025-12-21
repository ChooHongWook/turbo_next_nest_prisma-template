'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store';
import { TokenStorage } from '@/lib/auth/storage';
import { getCurrentUser } from '@/api/auth';

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setAuth, clearAuth, setInitialized, setLoading } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);

      if (!TokenStorage.hasTokens()) {
        setInitialized(true);
        setLoading(false);
        return;
      }

      try {
        const user = await getCurrentUser();

        const accessToken = TokenStorage.getAccessToken()!;
        const refreshToken = TokenStorage.getRefreshToken()!;

        setAuth(user as any, accessToken, refreshToken);
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        clearAuth();
      } finally {
        setInitialized(true);
        setLoading(false);
      }
    };

    initAuth();
  }, [setAuth, clearAuth, setInitialized, setLoading]);

  return <>{children}</>;
}
