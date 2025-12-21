import Cookies from 'js-cookie';

const ACCESS_TOKEN_KEY = 'auth_access_token';
const REFRESH_TOKEN_KEY = 'auth_refresh_token';

const isClient = typeof window !== 'undefined';

// 쿠키 만료: 7일 (refresh token TTL과 일치)
const COOKIE_EXPIRES = 7;

// 쿠키 설정
const getCookieOptions = (): Cookies.CookieAttributes => {
  const isProduction = process.env.NODE_ENV === 'production';
  const isHttps = isClient && window.location.protocol === 'https:';

  return {
    expires: COOKIE_EXPIRES, // 7일
    path: '/', // 전체 도메인에서 사용 가능
    sameSite: 'Lax', // CSRF 보호 + 일반 네비게이션 허용
    secure: isProduction && isHttps, // 프로덕션에서만 HTTPS 필수
  };
};

export const TokenStorage = {
  getAccessToken: (): string | null => {
    if (!isClient) return null;
    return Cookies.get(ACCESS_TOKEN_KEY) || null;
  },

  setAccessToken: (token: string): void => {
    if (!isClient) return;
    Cookies.set(ACCESS_TOKEN_KEY, token, getCookieOptions());
  },

  getRefreshToken: (): string | null => {
    if (!isClient) return null;
    return Cookies.get(REFRESH_TOKEN_KEY) || null;
  },

  setRefreshToken: (token: string): void => {
    if (!isClient) return;
    Cookies.set(REFRESH_TOKEN_KEY, token, getCookieOptions());
  },

  setTokens: (accessToken: string, refreshToken: string): void => {
    TokenStorage.setAccessToken(accessToken);
    TokenStorage.setRefreshToken(refreshToken);
  },

  clearTokens: (): void => {
    if (!isClient) return;
    Cookies.remove(ACCESS_TOKEN_KEY, { path: '/' });
    Cookies.remove(REFRESH_TOKEN_KEY, { path: '/' });

    // 마이그레이션 정리: 기존 sessionStorage 토큰 제거
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    sessionStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  hasTokens: (): boolean => {
    return !!(TokenStorage.getAccessToken() && TokenStorage.getRefreshToken());
  },
};
