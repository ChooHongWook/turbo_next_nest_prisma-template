'use client';

import { useEffect } from 'react';
import { AxiosError } from 'axios';
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

        setAuth(user, accessToken, refreshToken);
      } catch (error) {
        console.error('Failed to initialize auth:', error);

        // 401/403 에러는 clearAuth (토큰 만료/무효)
        // clearAuth()가 isInitialized를 true로 설정함
        if (error instanceof AxiosError) {
          if (
            error.response?.status === 401 ||
            error.response?.status === 403
          ) {
            clearAuth();
          } else {
            // 네트워크 에러 등은 토큰 유지하되 초기화는 완료
            setInitialized(true);
          }
        } else {
          // Axios 에러가 아닌 경우도 초기화 완료
          setInitialized(true);
        }
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [setAuth, clearAuth, setInitialized, setLoading]);

  return <>{children}</>;
}
