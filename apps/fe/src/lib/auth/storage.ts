const ACCESS_TOKEN_KEY = 'auth_access_token';
const REFRESH_TOKEN_KEY = 'auth_refresh_token';

const isClient = typeof window !== 'undefined';

export const TokenStorage = {
  getAccessToken: (): string | null => {
    if (!isClient) return null;
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  setAccessToken: (token: string): void => {
    if (!isClient) return;
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  },

  getRefreshToken: (): string | null => {
    if (!isClient) return null;
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  setRefreshToken: (token: string): void => {
    if (!isClient) return;
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  },

  setTokens: (accessToken: string, refreshToken: string): void => {
    TokenStorage.setAccessToken(accessToken);
    TokenStorage.setRefreshToken(refreshToken);
  },

  clearTokens: (): void => {
    if (!isClient) return;
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);

    // 마이그레이션 정리: 기존 sessionStorage 토큰 제거
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    sessionStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  hasTokens: (): boolean => {
    return !!(TokenStorage.getAccessToken() && TokenStorage.getRefreshToken());
  },
};
