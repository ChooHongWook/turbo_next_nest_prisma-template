<p align="left">
  <a href="./README.ko.md">한국어</a> |
  <a href="./README.en.md">English</a>
</p>
# Turborepo Fullstack Template

> Next.js, NestJS, Prisma ORM을 포함한 프로덕션 준비 완료 모노레포 템플릿

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node](https://img.shields.io/badge/node-%3E%3D22.19.0-brightgreen)](https://nodejs.org)
[![pnpm](https://img.shields.io/badge/pnpm-10.15.1-orange)](https://pnpm.io)

## 📋 개요

Turborepo 기반으로 구성된 **타입 세이프 풀스택 모노레포** 템플릿이다. Next.js 15(App Router), NestJS 11, Prisma ORM을 사용하며, 프론트엔드와 백엔드 간의 완전한 타입 안전성을 제공하는 공유 패키지 구조를 포함하고 있다.

## ✨ 주요 기능

- 🏗️ **Turborepo** – 고성능 모노레포 빌드 시스템
- ⚡ **Next.js 15** – App Router 및 Turbopack 기반의 React 프레임워크
- 🚀 **NestJS 11** – 효율적인 서버 애플리케이션 구축을 위한 Node.js 프레임워크
- 🗄️ **Prisma ORM** – 타입 안전한 차세대 ORM
- 🎨 **shadcn/ui + Tailwind CSS** – 재사용 가능하고 커스터마이징 가능한 UI 컴포넌트 시스템
- 🔄 **Shared Packages** – 프론트/백엔드에서 공통으로 사용하는 타입 및 API 계약
- 🐳 **Docker** – 일관된 개발 환경을 위한 PostgreSQL 컨테이너
- 🎯 **ESLint + Prettier** – Husky pre-commit 훅을 포함한 코드 품질 관리
- 🧪 **Jest + Playwright** – 유닛 테스트 및 E2E 테스트 환경
- 📦 **pnpm** – 빠르고 공간 효율적인 패키지 매니저

## 🏛️ 아키텍처

### 프로젝트 구조

```
.
├── apps/
│   ├── be/                      # NestJS 백엔드 (3000 포트)
│   └── fe/                      # Next.js 프론트엔드 (3001 포트)
└── packages/
    ├── @repo/api                # 공유 DTO 및 엔티티
    ├── @repo/database           # Prisma 스키마 및 클라이언트
    ├── @repo/eslint-config      # ESLint 설정
    ├── @repo/jest-config        # Jest 설정
    ├── @repo/typescript-config  # TypeScript 설정
    └── @repo/ui                 # 공유 React 컴포넌트

```

### 핵심 아키텍처 패턴

- **3단 타입 시스템**: Prisma Schema → Generated Client → API Entities
- **하이브리드 데이터 패칭**:
  - Server Components → Prisma 직접 접근
  - Client Components → REST API
- **환경 변수 자동 동기화**: `.env.shared` → 모든 앱/패키지 자동 분배

## 🚀 시작하기

### 필수 설치

- Node.js >= 22.19.0
- pnpm 10.15.1
- Docker (PostgreSQL용)

---

### 설치 방법

1. **레포지토리 클론**

```bash
git clone <repository-url>
cd turbo_next_nest_prisma-template

```

1. **의존성 설치**

```bash
pnpm install

```

1. **PostgreSQL 실행**

```bash
docker-compose up -d

```

1. **데이터베이스 설정**

```bash
# 마이그레이션 생성 및 적용
pnpm run db:migrate:dev

# 초기 데이터 시드
pnpm run db:seed

```

1. **패키지 빌드**

```bash
pnpm run build

```

1. **개발 서버 실행**

```bash
pnpm run dev

```

접속 주소:

- **Frontend**: [http://localhost:3001](http://localhost:3001/)
- **Backend**: [http://localhost:3000](http://localhost:3000/)

---

## 📚 사용 가능한 스크립트

### 개발 관련

```bash
pnpm run dev          # 모든 앱을 개발 모드로 실행
pnpm run build        # 모든 앱/패키지 빌드
pnpm run start        # 프로덕션 빌드 실행
pnpm run lint         # 린트 점검
pnpm run format       # Prettier로 코드 포맷팅
pnpm run test         # 테스트 실행

```

### 데이터베이스 관련

```bash
pnpm run db:migrate:dev     # 마이그레이션 생성 및 적용
pnpm run db:push            # 마이그레이션 없이 스키마 변경 적용
pnpm run db:generate        # Prisma Client 재생성
pnpm run db:seed            # 초기 데이터 시드
pnpm run db:studio          # Prisma Studio 실행 (GUI)

```

### 환경 변수 관련

```bash
pnpm run sync:env     # .env.shared를 모든 앱/패키지에 동기화

```

---

## 🗄️ 데이터베이스 접근

### 옵션 1: Prisma Studio (추천)

```bash
pnpm run db:studio

```

[http://localhost:5555](http://localhost:5555/) 에서 접근 가능

---

### 옵션 2: PostgreSQL CLI 직접 접근

```bash
# 컨테이너 접속
docker exec -it turborepo_postgres bash

# PostgreSQL 접속
psql -h localhost -p 5432 -U prisma -d postgres_db

```

---

## 🔧 설정

### 환경 변수

루트의 `.env.shared` 파일을 사용해 중앙에서 환경 변수를 관리한다.

1. `.env.shared.example` → `.env.shared` 복사
2. 필요한 값 입력
3. `pnpm sync:env` 실행해 모든 패키지로 전파

`dev`, `build` 실행 시 자동 동기화된다.

---

### 새로운 기능 추가하기

1. **Prisma 스키마 업데이트**

   `packages/database/prisma/schema.prisma`

2. **마이그레이션 생성**

   `pnpm run db:migrate:dev`

3. **DTO 생성**

   `packages/api/src/<feature>/dto/`

4. **Entity 생성**

   `packages/api/src/<feature>/entities/`

5. **Entry 파일에 export 추가**

   `packages/api/src/entry.ts`

6. **NestJS 모듈 생성**

   `apps/be/src/<feature>/`

7. **프론트엔드에서 타입 세이프하게 사용**

   `@repo/api`에서 타입 import

---

## 🧪 테스트

```bash
# 전체 테스트 실행
pnpm run test

# 특정 앱 테스트
cd apps/be && pnpm run test:watch

```

---

## 📦 기술 스택

| 기술       | 버전      | 목적                  | 설명            |
| ---------- | --------- | --------------------- | --------------- |
| Node.js    | >=22.19.0 | 런타임 환경           | 런타임          |
| pnpm       | 10.15.1   | 패키지 매니저         | 패키지 매니저   |
| Turborepo  | 2.5.8     | 모노레포 빌드 시스템  | 빌드 시스템     |
| Next.js    | 15.x      | 프론트엔드 프레임워크 | 웹 프레임워크   |
| NestJS     | 11.x      | 백엔드 프레임워크     | 서버 프레임워크 |
| React      | 19.x      | UI 라이브러리         | UI              |
| Prisma     | 6.19.0    | ORM                   | ORM             |
| PostgreSQL | latest    | 데이터베이스          | DB              |
| TypeScript | 5.5.4     | 타입 시스템           | 타입 안정성     |
| ESLint     | 9.x       | 린팅                  | 코드 검사       |
| Prettier   | 3.x       | 코드 포맷팅           | 포맷터          |
| Husky      | 8.x       | Git hooks             | Git 훅          |

---

## 📖 문서

자세한 아키텍처 패턴 및 개발 가이드라인은 다음 파일 참고:

`.github/copilot-instructions.md`

---

## 📝 라이선스

이 프로젝트는 MIT License로 제공된다. 자세한 내용은 `LICENSE` 파일을 참고하자.
