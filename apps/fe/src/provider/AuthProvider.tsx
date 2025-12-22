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

        // 401/403 에러만 clearAuth (토큰 만료/무효)
        // 네트워크 에러는 토큰 유지 (다음 요청에서 재시도 가능)
        if (error instanceof AxiosError) {
          if (
            error.response?.status === 401 ||
            error.response?.status === 403
          ) {
            clearAuth();
          } else {
            // 토큰은 유지하되 초기화는 완료
            setInitialized(true);
          }
        } else {
          // Axios 에러가 아닌 경우도 토큰 유지
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
