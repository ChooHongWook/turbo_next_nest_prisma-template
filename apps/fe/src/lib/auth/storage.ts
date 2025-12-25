/**
 * Session-based Authentication Storage
 *
 * 세션 기반 인증에서는 서버가 세션 쿠키(session_id)를 자동으로 관리합니다.
 * 프론트엔드는 토큰을 저장할 필요가 없으며, 브라우저가 자동으로 쿠키를 전송합니다.
 *
 * - 로그인: 서버가 세션을 생성하고 session_id 쿠키를 설정
 * - API 요청: 브라우저가 자동으로 session_id 쿠키를 포함
 * - 로그아웃: 서버가 세션을 삭제하고 쿠키를 제거
 *
 * rememberMe 옵션:
 * - false: 세션 쿠키 (브라우저 닫으면 삭제)
 * - true: 영구 쿠키 (7일간 유지)
 */

export const SessionStorage = {
  /**
   * 세션 쿠키가 존재하는지 확인
   * session_id 쿠키는 HttpOnly이므로 JavaScript로 직접 읽을 수 없습니다.
   * 대신 /auth/me API를 호출하여 세션 유효성을 확인해야 합니다.
   */
  hasSession: (): boolean => {
    // 세션 쿠키는 HttpOnly이므로 클라이언트에서 직접 확인 불가
    // API 호출로 세션 유효성을 확인해야 함
    return true; // 항상 true 반환하고, API에서 실제 검증
  },

  /**
   * 세션 정리 (로그아웃 시 호출)
   * 실제 세션 삭제는 서버의 /auth/logout API에서 처리됩니다.
   */
  clearSession: (): void => {
    // 세션 쿠키는 서버에서 관리하므로 클라이언트에서 할 일 없음
    // 로그아웃 API 호출 시 서버가 세션을 삭제함
  },

  // ===== 하위 호환성을 위한 메서드들 =====
  // 세션 기반에서는 사용되지 않지만, 기존 코드 호환성 유지
  getAccessToken: (): string | null => null,
  setAccessToken: (_token: string): void => {},
  getRefreshToken: (): string | null => null,
  setRefreshToken: (_token: string): void => {},
  setTokens: (
    _accessToken: string,
    _refreshToken: string,
    _rememberMe = false,
  ): void => {},
  clearTokens: (): void => {},
  hasTokens: (): boolean => true, // API에서 검증
  isRememberMe: (): boolean => false,
};

// 하위 호환성을 위한 alias
export const TokenStorage = SessionStorage;
