import Cookies from 'js-cookie';

const ACCESS_TOKEN_KEY = 'auth_access_token';
const REFRESH_TOKEN_KEY = 'auth_refresh_token';
const REMEMBER_ME_KEY = 'auth_remember_me';

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

// 로그인 유지 여부 확인
const isRememberMe = (): boolean => {
  if (!isClient) return false;
  return localStorage.getItem(REMEMBER_ME_KEY) === 'true';
};

// Storage 전략 인터페이스
interface StorageStrategy {
  get(key: string): string | null;
  set(key: string, value: string): void;
  remove(key: string): void;
}

// 세션 스토리지 전략
const sessionStorageStrategy: StorageStrategy = {
  get: (key: string) => {
    if (!isClient) return null;
    return sessionStorage.getItem(key) || null;
  },
  set: (key: string, value: string) => {
    if (!isClient) return;
    sessionStorage.setItem(key, value);
  },
  remove: (key: string) => {
    if (!isClient) return;
    sessionStorage.removeItem(key);
  },
};

// 쿠키 스토리지 전략
const cookieStorageStrategy: StorageStrategy = {
  get: (key: string) => {
    if (!isClient) return null;
    return Cookies.get(key) || null;
  },
  set: (key: string, value: string) => {
    if (!isClient) return;
    Cookies.set(key, value, getCookieOptions());
  },
  remove: (key: string) => {
    if (!isClient) return;
    Cookies.remove(key, { path: '/' });
  },
};

// 현재 스토리지 전략 선택
const getStorageStrategy = (): StorageStrategy => {
  return isRememberMe() ? cookieStorageStrategy : sessionStorageStrategy;
};

export const TokenStorage = {
  getAccessToken: (): string | null => {
    if (!isClient) return null;
    const strategy = getStorageStrategy();
    return strategy.get(ACCESS_TOKEN_KEY);
  },

  setAccessToken: (token: string): void => {
    if (!isClient) return;
    const strategy = getStorageStrategy();
    strategy.set(ACCESS_TOKEN_KEY, token);
  },

  getRefreshToken: (): string | null => {
    if (!isClient) return null;
    const strategy = getStorageStrategy();
    return strategy.get(REFRESH_TOKEN_KEY);
  },

  setRefreshToken: (token: string): void => {
    if (!isClient) return;
    const strategy = getStorageStrategy();
    strategy.set(REFRESH_TOKEN_KEY, token);
  },

  setTokens: (
    accessToken: string,
    refreshToken: string,
    rememberMe = false,
  ): void => {
    if (!isClient) return;

    // 로그인 유지 설정 저장
    localStorage.setItem(REMEMBER_ME_KEY, String(rememberMe));

    // 토큰 저장
    TokenStorage.setAccessToken(accessToken);
    TokenStorage.setRefreshToken(refreshToken);
  },

  clearTokens: (): void => {
    if (!isClient) return;

    // 쿠키와 세션 스토리지 모두 정리
    cookieStorageStrategy.remove(ACCESS_TOKEN_KEY);
    cookieStorageStrategy.remove(REFRESH_TOKEN_KEY);
    sessionStorageStrategy.remove(ACCESS_TOKEN_KEY);
    sessionStorageStrategy.remove(REFRESH_TOKEN_KEY);

    // 로그인 유지 설정 제거
    localStorage.removeItem(REMEMBER_ME_KEY);
  },

  hasTokens: (): boolean => {
    return !!(TokenStorage.getAccessToken() && TokenStorage.getRefreshToken());
  },

  isRememberMe: (): boolean => {
    return isRememberMe();
  },
};
