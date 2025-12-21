# JWT 기반 인증/인가 시스템 프론트엔드 구현 완료

## Overview

commit `30808c1`의 백엔드 JWT 인증 시스템과 연동되는 프론트엔드 인증 시스템을 구현했습니다.

**완료 날짜**: 2025-12-21

**주요 목표**:
- ✅ 사용자 로그인/회원가입 기능
- ✅ JWT 토큰 기반 인증/인가
- ✅ 자동 토큰 갱신
- ✅ Protected Routes
- ✅ 사용자 프로필 표시

---

## 구현된 기능 목록

- ✅ **로그인 페이지** (`/auth/login`) - 이메일/비밀번호 로그인
- ✅ **회원가입 페이지** (`/auth/register`) - 이름(선택), 이메일, 비밀번호
- ✅ **로그아웃 기능** - 백엔드 API 호출 및 클라이언트 상태 초기화
- ✅ **Protected Routes** - 인증되지 않은 사용자 자동 리다이렉트
- ✅ **자동 토큰 갱신** - 401 에러 발생 시 투명하게 액세스 토큰 갱신
- ✅ **사용자 프로필 표시** - 헤더에 사용자 아바타 및 정보 표시
- ✅ **헤더 인증 UI** - 로그인 상태에 따라 로그인 버튼 또는 프로필/로그아웃 버튼 표시

---

## 기술 스택 및 아키텍처

### Core Technologies
- **Next.js 15** (App Router) - 프론트엔드 프레임워크
- **Zustand** - 상태 관리 (devtools 미들웨어)
- **sessionStorage** - 토큰 저장 (페이지 새로고침 시 유지, 탭 닫을 때 삭제)
- **Axios** - HTTP 클라이언트 (인터셉터 지원)
- **TypeScript** - 타입 안정성

### Architecture Components

#### 1. Auth Store (`useAuthStore`)
Zustand 기반 인증 상태 관리
- **State**: `isAuthenticated`, `user`, `isInitialized`, `isLoading`, `error`
- **Actions**: `setAuth()`, `clearAuth()`, `setUser()`, `updateTokens()`, `setLoading()`, `setError()`, `setInitialized()`
- 토큰은 sessionStorage에 저장, 사용자 객체만 Zustand state에 저장

#### 2. Token Storage
sessionStorage 기반 토큰 관리
- SSR-safe 구현 (`typeof window !== 'undefined'` 체크)
- 페이지 새로고침 시 토큰 유지
- 브라우저 탭 닫을 때 자동 삭제
- Keys: `auth_access_token`, `auth_refresh_token`

#### 3. Axios Interceptors
자동 토큰 관리 인터셉터
- **Request Interceptor**: 모든 요청에 `Authorization: Bearer {token}` 헤더 자동 추가
  - Public 엔드포인트(/auth/login, /auth/register, /auth/refresh) 제외
- **Response Interceptor**: 401 에러 처리 및 자동 토큰 갱신
  - Request queuing으로 동시 요청 처리
  - 갱신 실패 시 자동 로그아웃 및 로그인 페이지 리다이렉트

#### 4. Auth Provider
앱 초기화 시 인증 상태 복원
- `useEffect`로 마운트 시 한 번 실행
- sessionStorage에서 토큰 확인
- 토큰 존재 시 `GET /auth/me` 호출로 사용자 정보 획득
- 토큰 유효하지 않으면 자동 삭제

#### 5. Protected Route Component
클라이언트 사이드 라우트 가드
- 인증되지 않은 사용자 → `/auth/login`으로 리다이렉트
- 로그인한 사용자가 auth 페이지 접근 → `/`로 리다이렉트
- `isInitialized` 플래그로 SSR 하이드레이션 flash 방지

---

## 생성/수정된 파일

### 새로 생성된 파일 (15개)

**Infrastructure:**
- `apps/fe/src/lib/auth/storage.ts` - 토큰 저장소 유틸리티 (sessionStorage wrapper)
- `apps/fe/src/lib/auth/axios-interceptors.ts` - 토큰 주입 및 자동 갱신 인터셉터
- `apps/fe/src/store/useAuthStore.ts` - 인증 상태 관리 Zustand 스토어
- `apps/fe/src/api/auth/index.ts` - 인증 API 레이어 (login, register, refresh, logout, getCurrentUser)

**Components:**
- `apps/fe/src/components/auth/LoginForm.tsx` - 로그인 폼 (이메일, 비밀번호)
- `apps/fe/src/components/auth/RegisterForm.tsx` - 회원가입 폼 (이름, 이메일, 비밀번호)
- `apps/fe/src/components/auth/LogoutButton.tsx` - 로그아웃 버튼
- `apps/fe/src/components/auth/ProtectedRoute.tsx` - 라우트 가드 컴포넌트
- `apps/fe/src/components/auth/index.ts` - Auth 컴포넌트 배럴 export
- `apps/fe/src/components/common/UserProfile.tsx` - 사용자 프로필 표시 (아바타, 이름, 이메일)

**Providers:**
- `apps/fe/src/provider/AuthProvider.tsx` - 인증 초기화 프로바이더

**Pages:**
- `apps/fe/app/auth/login/page.tsx` - 로그인 페이지
- `apps/fe/app/auth/register/page.tsx` - 회원가입 페이지
- `apps/fe/app/auth/layout.tsx` - 인증 페이지 레이아웃 (헤더 제외)

### 수정된 파일 (6개)

- `apps/fe/src/config/axios.ts` - `setupAuthInterceptors()` 호출 추가
- `apps/fe/src/store/index.ts` - `useAuthStore` export 추가
- `apps/fe/src/provider/RootProvider.tsx` - `AuthProvider` 추가
- `apps/fe/src/provider/index.tsx` - `AuthProvider` export 추가
- `apps/fe/src/components/common/Header.tsx` - 인증 UI 추가 (UserProfile, LogoutButton, Login link)
- `apps/fe/app/layout.tsx` - `ProtectedRoute` 래퍼 추가

---

## 테스트 가이드

### 회원가입 플로우
1. http://localhost:3001/auth/register 접속
2. 이름(선택), 이메일, 비밀번호(최소 6자) 입력
3. "Register" 클릭
4. **기대 결과**: 홈 페이지로 리다이렉트, 헤더에 사용자 프로필 표시

### 로그인 플로우
1. 로그아웃 후 http://localhost:3001/auth/login 접속
2. 이메일, 비밀번호 입력
3. "Login" 클릭
4. **기대 결과**: 홈 페이지로 리다이렉트

### 로그아웃 플로우
1. 헤더의 "Logout" 버튼 클릭
2. **기대 결과**:
   - sessionStorage에서 토큰 삭제 확인 (개발자 도구 → Application → Session Storage)
   - 로그인 페이지로 리다이렉트

### Protected Routes
1. **로그아웃 상태**에서 `/` 접속
   - **기대 결과**: `/auth/login`으로 자동 리다이렉트
2. **로그인 상태**에서 `/auth/login` 접속
   - **기대 결과**: `/`로 자동 리다이렉트
3. 로그인 후 페이지 새로고침 (F5)
   - **기대 결과**: 로그인 상태 유지

### 토큰 갱신 (선택사항)
1. 로그인 후 15분 대기 (또는 개발자 도구에서 수동으로 토큰 만료 처리)
2. API 요청 실행
3. **기대 결과**: 자동으로 토큰 갱신 후 요청 재시도

### Error Handling
- **잘못된 이메일/비밀번호**: 빨간색 에러 메시지 표시
- **중복 이메일 회원가입**: "Email already in use" 에러 메시지
- **네트워크 에러**: "Registration failed" 또는 "Login failed" 메시지

---

## 주요 특징

- ✨ **자동 토큰 갱신**: 401 에러 발생 시 투명하게 액세스 토큰 갱신, 사용자는 인지하지 못함
- ✨ **Protected Routes**: 인증되지 않은 사용자 자동 리다이렉트, 인증된 사용자는 auth 페이지 접근 시 홈으로 리다이렉트
- ✨ **sessionStorage**: 페이지 새로고침 시 로그인 상태 유지, 탭 닫을 때 자동 삭제 (보안)
- ✨ **타입 안전성**: 모든 API 요청/응답에 `@repo/api` 패키지의 타입 사용
- ✨ **다크모드 지원**: 모든 인증 컴포넌트가 라이트/다크 테마 지원
- ✨ **로딩 상태**: 모든 인증 작업(로그인, 회원가입, 로그아웃)에 시각적 피드백 제공
- ✨ **에러 핸들링**: 백엔드에서 전달된 에러 메시지를 사용자 친화적으로 표시

---

## 보안 고려사항

### 토큰 저장
- JWT 토큰을 sessionStorage에 저장 (XSS 공격에 취약할 수 있음)
- React의 기본 XSS 방어 메커니즘(자동 이스케이프)에 의존
- httpOnly 쿠키 대비 장점: 클라이언트 사이드에서 쉽게 접근 가능

### HTTPS
- 프로덕션 환경에서는 **반드시 HTTPS 사용**
- HTTP에서는 Bearer 토큰이 평문으로 전송되어 중간자 공격에 노출

### 토큰 만료 시간
- **액세스 토큰**: 15분 (짧은 수명으로 보안 강화)
- **리프레시 토큰**: 7일 (사용자 편의성)

### 비밀번호 처리
- 비밀번호는 로그하지 않음
- `type="password"` 입력 필드 사용
- 제출 후 폼 데이터에서 비밀번호 제거

---

## 백엔드 연동

이 구현은 commit `30808c1`의 백엔드 JWT 인증 시스템과 연동됩니다.

### API Endpoints

| Endpoint | Method | Auth Required | Description |
|----------|--------|---------------|-------------|
| `/auth/register` | POST | ❌ | 회원가입 (이메일, 비밀번호, 이름) |
| `/auth/login` | POST | ❌ | 로그인 (이메일, 비밀번호) |
| `/auth/refresh` | POST | ❌ | 리프레시 토큰으로 새 액세스 토큰 발급 |
| `/auth/logout` | POST | ✅ | 로그아웃 (DB에서 리프레시 토큰 무효화) |
| `/auth/me` | GET | ✅ | 현재 로그인한 사용자 정보 조회 |

### Response Format

**AuthResponse** (login, register, refresh):
```typescript
{
  accessToken: string,    // JWT 액세스 토큰 (15분 만료)
  refreshToken: string,   // JWT 리프레시 토큰 (7일 만료)
  user: {
    id: number,
    email: string,
    name: string | null,
    emailVerified: Date | null,
    createdAt: Date,
    updatedAt: Date
    // password, refreshToken 필드는 제외됨
  }
}
```

---

## 향후 개선 가능 사항

1. **이메일 인증**: `emailVerified` 필드 활용
2. **비밀번호 재설정**: "Forgot Password" 기능
3. **Remember Me**: localStorage 옵션 제공
4. **OAuth/소셜 로그인**: Google, GitHub 등
5. **세션 타임아웃 경고**: 만료 1분 전 모달 표시
6. **멀티 탭 동기화**: BroadcastChannel API 활용

---

## 참고 링크

- 백엔드 구현 commit: `30808c1`
- Frontend URL: http://localhost:3001
- Backend URL: http://localhost:3000
- 로그인 페이지: http://localhost:3001/auth/login
- 회원가입 페이지: http://localhost:3001/auth/register
