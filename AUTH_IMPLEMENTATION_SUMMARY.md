# JWT 인증 시스템 프론트엔드 구현 및 문제 해결 기록

**작업 기간**: 2025-12-22
**상태**: 쿠키 기반 저장소 + 에러 핸들링 개선 완료

---

## 목차

1. [초기 구현 (완료)](#1-초기-구현-완료)
2. [쿠키 마이그레이션 시도](#2-쿠키-마이그레이션-시도)
3. [로그인 유지 문제 분석](#3-로그인-유지-문제-분석)
4. [최종 해결 방안](#4-최종-해결-방안)
5. [수정된 파일 목록](#5-수정된-파일-목록)
6. [테스트 가이드](#6-테스트-가이드)
7. [코딩 규칙](#7-코딩-규칙)

---

## 1. 초기 구현 (완료)

### 1.1 백엔드 분석
- commit `30808c1`: JWT 기반 인증/인가 시스템 (NestJS)
- Access Token: 15분 만료
- Refresh Token: 7일 만료

### 1.2 프론트엔드 구현 완료 항목

**생성된 파일 (15개)**:

**Infrastructure:**
- `apps/fe/src/lib/auth/storage.ts` - 토큰 저장소 유틸리티
- `apps/fe/src/lib/auth/axios-interceptors.ts` - 자동 토큰 갱신 인터셉터
- `apps/fe/src/store/useAuthStore.ts` - Zustand 인증 상태 관리
- `apps/fe/src/api/auth/index.ts` - 인증 API 레이어

**Components:**
- `apps/fe/src/components/auth/LoginForm.tsx` - 로그인 폼
- `apps/fe/src/components/auth/RegisterForm.tsx` - 회원가입 폼
- `apps/fe/src/components/auth/LogoutButton.tsx` - 로그아웃 버튼
- `apps/fe/src/components/auth/ProtectedRoute.tsx` - 라우트 가드
- `apps/fe/src/components/auth/index.ts` - 배럴 export
- `apps/fe/src/components/common/UserProfile.tsx` - 사용자 프로필

**Providers:**
- `apps/fe/src/provider/AuthProvider.tsx` - 인증 초기화 프로바이더

**Pages:**
- `apps/fe/app/auth/login/page.tsx` - 로그인 페이지
- `apps/fe/app/auth/register/page.tsx` - 회원가입 페이지
- `apps/fe/app/auth/layout.tsx` - 인증 레이아웃

**수정된 파일 (6개)**:
- `apps/fe/src/config/axios.ts` - 인터셉터 설정
- `apps/fe/src/store/index.ts` - useAuthStore export
- `apps/fe/src/provider/RootProvider.tsx` - AuthProvider 추가
- `apps/fe/src/provider/index.tsx` - AuthProvider export
- `apps/fe/src/components/common/Header.tsx` - 인증 UI
- `apps/fe/app/layout.tsx` - ProtectedRoute 래퍼

### 1.3 초기 구현의 문제점

**sessionStorage 사용**:
- ❌ 탭마다 독립적인 세션
- ❌ 탭 닫으면 로그인 해제
- ❌ 브라우저 재시작 시 로그인 해제

---

## 2. 쿠키 마이그레이션 시도

### 2.1 목표
- ✅ 브라우저 재시작 후에도 7일간 로그인 유지
- ✅ 탭 간 자동 로그인 상태 공유
- ✅ CSRF 보호 (SameSite: Lax)

### 2.2 쿠키 구현

**패키지 추가**:
```json
{
  "dependencies": {
    "js-cookie": "^3.0.5"
  },
  "devDependencies": {
    "@types/js-cookie": "^3.0.6"
  }
}
```

**storage.ts 쿠키 버전**:
```typescript
import Cookies from 'js-cookie';

const ACCESS_TOKEN_KEY = 'auth_access_token';
const REFRESH_TOKEN_KEY = 'auth_refresh_token';
const isClient = typeof window !== 'undefined';
const COOKIE_EXPIRES = 7; // 7일

const getCookieOptions = (): Cookies.CookieAttributes => {
  const isProduction = process.env.NODE_ENV === 'production';
  const isHttps = isClient && window.location.protocol === 'https:';

  return {
    expires: COOKIE_EXPIRES,
    path: '/',
    sameSite: 'Lax', // CSRF 보호
    secure: isProduction && isHttps, // HTTPS 필수
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

  // ... 나머지 메서드
};
```

---

## 3. 로그인 유지 문제 분석

### 3.1 발견된 문제

**브라우저 재시작 후 로그인이 유지되지 않는 현상 발생**

### 3.2 근본 원인

**AuthProvider.tsx의 무조건 clearAuth() 호출**:

```typescript
// ❌ 문제 코드
try {
  const user = await getCurrentUser();
  setAuth(user, accessToken, refreshToken);
} catch (error) {
  console.error('Failed to initialize auth:', error);
  clearAuth(); // 모든 에러에서 쿠키 삭제!
}
```

**문제 흐름**:
```
1. 브라우저 재시작 → 쿠키 존재 (7일 만료)
2. AuthProvider의 initAuth() 실행
3. TokenStorage.hasTokens() → true
4. getCurrentUser() API 호출
5. 네트워크 에러 또는 일시적 장애로 실패
6. catch 블록에서 clearAuth() 실행
7. 유효한 쿠키까지 모두 삭제됨 ❌
8. 로그인 상태 초기화
```

### 3.3 추가 발견 사항

1. **에러 핸들링 부족**
   - getCurrentUser() 실패 원인을 구분하지 않음
   - 네트워크 에러 vs 인증 만료를 동일하게 처리
   - 재시도 로직 없음

2. **쿠키 아키텍처의 비효율성**
   - 쿠키에 저장하지만 Authorization 헤더로 전송
   - 쿠키의 자동 전송 기능을 활용하지 못함

---

## 4. 최종 해결 방안

### 4.1 선택한 옵션

**옵션 2: 쿠키 유지 + 에러 핸들링 개선**

### 4.2 개선된 AuthProvider.tsx

```typescript
'use client';

import { useEffect } from 'react';
import { AxiosError } from 'axios';
import type { User } from '@repo/api';
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

        setAuth(user as User, accessToken, refreshToken);
      } catch (error) {
        console.error('Failed to initialize auth:', error);

        // ✅ 401/403 에러만 clearAuth (토큰 만료/무효)
        // ✅ 네트워크 에러는 토큰 유지 (다음 요청에서 재시도 가능)
        if (error instanceof AxiosError) {
          if (error.response?.status === 401 || error.response?.status === 403) {
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
```

### 4.3 핵심 개선 사항

**1. any 타입 제거**:
```typescript
// ❌ 이전
catch (error: any) {
  if (error?.response?.status === 401) { ... }
}
setAuth(user as any, ...);

// ✅ 개선
import { AxiosError } from 'axios';
import type { User } from '@repo/api';

catch (error) {
  if (error instanceof AxiosError) {
    if (error.response?.status === 401) { ... }
  }
}
setAuth(user as User, ...);
```

**2. 조건부 clearAuth**:
```typescript
// ✅ 401/403: 토큰 만료/무효 → 삭제
// ✅ 네트워크 에러: 일시적 장애 → 유지
// ✅ 기타 에러: 예외 상황 → 유지
```

**3. 브라우저 재시작 후 작동 흐름**:
```
1. 브라우저 재시작 → 쿠키 존재 (7일 만료)
2. TokenStorage.hasTokens() → true
3. getCurrentUser() API 호출
4-A. 성공 → 로그인 상태 유지 ✅
4-B. 401/403 → clearAuth() → 로그인 페이지 이동 ✅
4-C. 네트워크 에러 → 토큰 유지 → 재시도 가능 ✅
```

---

## 5. 수정된 파일 목록

### 5.1 핵심 수정 파일

**1. apps/fe/package.json**
```json
{
  "dependencies": {
    "js-cookie": "^3.0.5"
  },
  "devDependencies": {
    "@types/js-cookie": "^3.0.6"
  }
}
```

**2. apps/fe/src/lib/auth/storage.ts**
- sessionStorage → 쿠키 (js-cookie)
- 7일 만료 설정
- SameSite: 'Lax', Secure (프로덕션)

**3. apps/fe/src/provider/AuthProvider.tsx**
- any 타입 제거
- AxiosError 타입 가드 추가
- 조건부 clearAuth 로직
- 네트워크 에러 시 토큰 유지

### 5.2 변경 불필요 파일 (TokenStorage 추상화)

- `apps/fe/src/store/useAuthStore.ts`
- `apps/fe/src/lib/auth/axios-interceptors.ts`
- `apps/fe/src/components/auth/*` (모든 컴포넌트)
- `apps/fe/app/auth/*` (모든 페이지)

---

## 6. 테스트 가이드

### 6.1 브라우저 재시작 테스트 ⭐

```
1. http://localhost:3001/auth/login 로그인
2. DevTools > Application > Cookies 확인
   - auth_access_token 존재 확인
   - auth_refresh_token 존재 확인
   - Expires: 7일 후
   - SameSite: Lax
   - Secure: (프로덕션에서만)
3. 브라우저 완전 종료
4. 브라우저 재시작 후 http://localhost:3001 접속
5. ✅ 기대 결과: 로그인 페이지 리다이렉트 없이 홈 화면
```

### 6.2 탭 간 공유 테스트

```
1. Tab A에서 로그인
2. 새 탭(Tab B)에서 http://localhost:3001 열기
3. ✅ 기대 결과: Tab B도 자동으로 로그인 상태
4. Tab A에서 로그아웃
5. Tab B 새로고침
6. ✅ 기대 결과: Tab B도 로그아웃 상태
```

### 6.3 네트워크 장애 복구 테스트

```
1. 로그인
2. DevTools > Network > Offline 체크
3. 페이지 새로고침
4. ✅ 기대 결과: getCurrentUser() 실패하지만 쿠키 유지
5. Offline 해제
6. 페이지 다시 새로고침
7. ✅ 기대 결과: 로그인 상태 자동 복구
```

### 6.4 토큰 만료 테스트

```
1. 로그인
2. DevTools > Application > Cookies에서 토큰 만료 처리
3. 페이지 새로고침
4. ✅ 기대 결과: 401 에러 → clearAuth() → 로그인 페이지
```

### 6.5 자동 토큰 갱신 테스트

```
1. 로그인 후 16분 대기 (access token 만료)
2. API 요청 실행
3. ✅ 기대 결과:
   - axios 인터셉터가 401 감지
   - refresh token으로 새 access token 발급
   - 원래 요청 재시도
   - 쿠키에 새 토큰 저장
```

---

## 7. 코딩 규칙

### 7.1 타입 안정성

**❌ 금지: any 타입 사용**
```typescript
// ❌ 나쁜 예
catch (error: any) { ... }
setAuth(user as any, ...);
```

**✅ 권장: 명시적 타입 사용**
```typescript
// ✅ 좋은 예
import { AxiosError } from 'axios';
import type { User } from '@repo/api';

catch (error) {
  if (error instanceof AxiosError) { ... }
}
setAuth(user as User, ...);
```

### 7.2 에러 핸들링

**타입 가드 사용**:
```typescript
if (error instanceof AxiosError) {
  // AxiosError의 속성에 안전하게 접근
  if (error.response?.status === 401) { ... }
}
```

### 7.3 TokenStorage 추상화 유지

- 저장소 구현 변경 시 `storage.ts`만 수정
- 다른 파일은 TokenStorage 인터페이스만 사용
- sessionStorage ↔ localStorage ↔ 쿠키 전환 용이

---

## 8. 아키텍처 다이어그램

### 8.1 인증 플로우

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       │ 1. 로그인 요청
       ▼
┌─────────────────────┐
│   LoginForm.tsx     │
└──────┬──────────────┘
       │
       │ 2. login(email, password)
       ▼
┌─────────────────────┐
│  auth/index.ts      │
│  (API Layer)        │
└──────┬──────────────┘
       │
       │ 3. POST /auth/login
       ▼
┌─────────────────────┐
│  Backend (NestJS)   │
│  - JWT 생성         │
│  - DB 저장          │
└──────┬──────────────┘
       │
       │ 4. { user, accessToken, refreshToken }
       ▼
┌─────────────────────┐
│  useAuthStore       │
│  - setAuth()        │
└──────┬──────────────┘
       │
       │ 5. TokenStorage.setTokens()
       ▼
┌─────────────────────┐
│  storage.ts         │
│  - 쿠키에 저장      │
│    (7일 만료)       │
└─────────────────────┘
```

### 8.2 토큰 갱신 플로우

```
┌─────────────┐
│   API Call  │
└──────┬──────┘
       │
       │ 1. axios.get(...)
       ▼
┌─────────────────────────┐
│  Request Interceptor    │
│  - 쿠키에서 토큰 읽기   │
│  - Authorization 헤더   │
└──────┬──────────────────┘
       │
       │ 2. GET /api/... (with token)
       ▼
┌─────────────────────┐
│  Backend            │
└──────┬──────────────┘
       │
       │ 3-A. 200 OK → 성공 ✅
       │ 3-B. 401 Unauthorized
       ▼
┌─────────────────────────┐
│  Response Interceptor   │
│  - 401 감지             │
│  - refreshTokens() 호출 │
└──────┬──────────────────┘
       │
       │ 4. POST /auth/refresh
       ▼
┌─────────────────────┐
│  Backend            │
│  - 새 토큰 발급     │
└──────┬──────────────┘
       │
       │ 5. { accessToken, refreshToken }
       ▼
┌─────────────────────────┐
│  TokenStorage.setTokens │
│  - 쿠키 업데이트        │
└──────┬──────────────────┘
       │
       │ 6. 원래 요청 재시도
       ▼
┌─────────────────────┐
│  Backend            │
│  - 새 토큰으로 인증 │
└──────┬──────────────┘
       │
       │ 7. 200 OK ✅
       ▼
```

---

## 9. 보안 고려사항

### 9.1 XSS (Cross-Site Scripting)

**위험**:
- JavaScript로 접근 가능한 쿠키는 XSS로 탈취 가능
- httpOnly 플래그 사용 불가 (클라이언트에서 쿠키 설정 필요)

**완화**:
- React의 기본 XSS 방어 (자동 이스케이프)
- CSP 헤더 설정 권장
- 입력 값 새니타이제이션

### 9.2 CSRF (Cross-Site Request Forgery)

**보호**:
- ✅ SameSite: 'Lax' - 크로스 사이트 요청 차단
- ✅ Authorization 헤더 사용 - 자동 전송 방지
- ✅ 백엔드 JWT 검증

### 9.3 토큰 만료

**Access Token**: 15분 (짧은 수명으로 보안 강화)
**Refresh Token**: 7일 (사용자 편의성)
**쿠키 만료**: 7일 (refresh token과 일치)

---

## 10. 다음 단계 (선택사항)

### 10.1 향후 개선 가능 사항

1. **탭 간 실시간 동기화**
   - storage event 활용
   - BroadcastChannel API

2. **이메일 인증**
   - emailVerified 필드 활용
   - 이메일 확인 플로우

3. **비밀번호 재설정**
   - "Forgot Password" 기능
   - 이메일 토큰 기반 재설정

4. **OAuth/소셜 로그인**
   - Google, GitHub 연동

5. **세션 타임아웃 경고**
   - 만료 1분 전 모달 표시

---

## 11. 참고 자료

### 11.1 관련 Commit

- 백엔드 구현: `30808c1` - JWT 기반 인증/인가 시스템
- 프론트엔드 구현: (이 문서의 내용)

### 11.2 URL

- Frontend: http://localhost:3001
- Backend: http://localhost:3000
- 로그인: http://localhost:3001/auth/login
- 회원가입: http://localhost:3001/auth/register

### 11.3 API Endpoints

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/auth/register` | POST | ❌ | 회원가입 |
| `/auth/login` | POST | ❌ | 로그인 |
| `/auth/refresh` | POST | ❌ | 토큰 갱신 |
| `/auth/logout` | POST | ✅ | 로그아웃 |
| `/auth/me` | GET | ✅ | 현재 사용자 조회 |

---

## 12. 롤백 가이드

### 12.1 sessionStorage로 회귀

문제 발생 시 storage.ts만 수정:

```typescript
export const TokenStorage = {
  getAccessToken: (): string | null => {
    if (!isClient) return null;
    return sessionStorage.getItem(ACCESS_TOKEN_KEY);
  },

  setAccessToken: (token: string): void => {
    if (!isClient) return;
    sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
  },

  // ... 나머지 메서드도 sessionStorage 사용
};
```

### 12.2 에러 핸들링 회귀

AuthProvider.tsx에서 조건부 로직 제거:

```typescript
catch (error) {
  console.error('Failed to initialize auth:', error);
  clearAuth(); // 모든 에러에서 삭제
}
```

---

## 부록 A: 전체 파일 구조

```
apps/fe/
├── app/
│   ├── auth/
│   │   ├── layout.tsx          # 인증 레이아웃
│   │   ├── login/
│   │   │   └── page.tsx        # 로그인 페이지
│   │   └── register/
│   │       └── page.tsx        # 회원가입 페이지
│   └── layout.tsx              # 루트 레이아웃 (ProtectedRoute)
│
├── src/
│   ├── api/
│   │   └── auth/
│   │       └── index.ts        # 인증 API
│   │
│   ├── components/
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   ├── LogoutButton.tsx
│   │   │   ├── ProtectedRoute.tsx
│   │   │   └── index.ts
│   │   └── common/
│   │       ├── UserProfile.tsx
│   │       ├── Header.tsx
│   │       └── index.ts
│   │
│   ├── lib/
│   │   └── auth/
│   │       ├── storage.ts      # 쿠키 저장소 (핵심)
│   │       └── axios-interceptors.ts
│   │
│   ├── provider/
│   │   ├── AuthProvider.tsx    # 인증 초기화 (핵심)
│   │   ├── RootProvider.tsx
│   │   └── index.tsx
│   │
│   ├── store/
│   │   ├── useAuthStore.ts     # Zustand 스토어
│   │   └── index.ts
│   │
│   └── config/
│       └── axios.ts
│
└── package.json                # js-cookie 의존성
```

---

**문서 버전**: 1.0
**최종 수정일**: 2025-12-22
**작성자**: Claude (Anthropic)
