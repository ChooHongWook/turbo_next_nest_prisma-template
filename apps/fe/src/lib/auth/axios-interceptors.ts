import type { AxiosInstance } from 'axios';

/**
 * Session-based Authentication Interceptors
 *
 * 세션 기반 인증에서는 브라우저가 자동으로 쿠키를 관리하므로
 * 복잡한 토큰 갱신 로직이 필요 없습니다.
 *
 * - withCredentials: true 설정으로 모든 요청에 쿠키가 자동 포함됩니다
 * - 401 에러는 단순히 reject하여 호출자가 처리하도록 합니다
 * - 클라이언트 컴포넌트에서만 리다이렉트 처리가 필요한 경우 호출자에서 처리합니다
 */
export function setupAuthInterceptors(axiosInstance: AxiosInstance) {
  // Request interceptor - 세션 기반에서는 특별한 처리 불필요
  // withCredentials: true가 설정되어 있어 쿠키가 자동으로 포함됨
  axiosInstance.interceptors.request.use(
    (config) => config,
    (error) => Promise.reject(error),
  );

  // Response interceptor - 단순히 에러를 전달
  // 클라이언트 컴포넌트에서 401 처리 필요 시 각 컴포넌트에서 처리
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      // 401 에러는 세션이 만료되었거나 인증되지 않은 상태
      // 서버 컴포넌트에서는 에러를 catch하여 처리
      // 클라이언트 컴포넌트에서는 호출자가 처리하도록 reject
      return Promise.reject(error);
    },
  );
}
