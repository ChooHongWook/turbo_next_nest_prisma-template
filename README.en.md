<p align="left">
  <a href="./README.ko.md">한국어</a> |
  <a href="./README.en.md">English</a>
</p>

# Turborepo Fullstack Template

> A production-ready monorepo template with Next.js, NestJS, and Prisma ORM

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node](https://img.shields.io/badge/node-%3E%3D22.19.0-brightgreen)](https://nodejs.org)
[![pnpm](https://img.shields.io/badge/pnpm-10.15.1-orange)](https://pnpm.io)

## 📋 Overview

A **type-safe fullstack monorepo** built with Turborepo, featuring Next.js 15 (App Router), NestJS 11, and Prisma ORM. This template provides a scalable architecture with shared packages for seamless type safety between frontend and backend.

## ✨ Features

- 🏗️ **Turborepo** - High-performance build system for monorepos
- ⚡ **Next.js 15** - React framework with App Router and Turbopack
- 🚀 **NestJS 11** - Progressive Node.js framework for building efficient server-side applications
- 🗄️ **Prisma ORM** - Next-generation ORM with type-safe database access
- 🎨 **shadcn/ui + Tailwind CSS** - Reusable and customizable UI component system
- 🔄 **Shared Packages** - Type-safe API contracts shared between frontend and backend
- 🐳 **Docker** - PostgreSQL containerization for consistent development environments
- 🎯 **ESLint + Prettier** - Code quality and formatting with Husky pre-commit hooks
- 🧪 **Jest + Playwright** - Unit testing and E2E testing framework
- 📦 **pnpm** - Fast, disk space efficient package manager

## 🏛️ Architecture

### Project Structure

```
.
├── apps/
│   ├── be/                      # NestJS backend (port 3000)
│   └── fe/                      # Next.js frontend (port 3001)
└── packages/
    ├── @repo/api                # Shared DTOs and entities
    ├── @repo/database           # Prisma schema and client
    ├── @repo/eslint-config      # ESLint configurations
    ├── @repo/jest-config        # Jest configurations
    ├── @repo/typescript-config  # TypeScript configurations
    └── @repo/ui                 # Shared React components
```

### Key Architectural Patterns

- **Three-Layer Type System**: Prisma Schema → Generated Client → API Entities
- **Hybrid Data Fetching**: Server Components with direct Prisma access + Client Components with REST API
- **Environment Sync**: Automated `.env.shared` synchronization across all apps/packages

## 🚀 Getting Started

### Prerequisites

- Node.js >= 22.19.0
- pnpm 10.15.1
- Docker (for PostgreSQL)

---

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd turbo_next_nest_prisma-template
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Start PostgreSQL**

```bash
docker-compose up -d
```

4. **Setup database**

```bash
# Create and apply migrations
pnpm run db:migrate:dev

# Seed initial data
pnpm run db:seed
```

5. **Build packages**

```bash
pnpm run build
```

6. **Start development servers**

```bash
pnpm run dev
```

The application will be available at:

- **Frontend**: http://localhost:3001
- **Backend**: http://localhost:3000

---

## 📚 Available Scripts

### Development

```bash
pnpm run dev          # Start all apps in development mode
pnpm run build        # Build all apps and packages
pnpm run start        # Start production builds
pnpm run lint         # Lint all packages
pnpm run format       # Format code with Prettier
pnpm run test         # Run tests
```

### Database

```bash
pnpm run db:migrate:dev     # Create and apply migrations
pnpm run db:push            # Push schema changes without migrations
pnpm run db:generate        # Regenerate Prisma Client
pnpm run db:seed            # Seed database with initial data
pnpm run db:studio          # Open Prisma Studio (GUI for database)
```

### Environment

```bash
pnpm run sync:env     # Sync .env.shared to all apps/packages
```

---

## 🗄️ Database Access

### Option 1: Prisma Studio (Recommended)

```bash
pnpm run db:studio
```

Access at http://localhost:5555

---

### Option 2: Direct PostgreSQL Access

```bash
# Connect to container
docker exec -it turborepo_postgres bash

# Access PostgreSQL
psql -h localhost -p 5432 -U prisma -d postgres_db
```

---

## 🔧 Configuration

### Environment Variables

This project uses `.env.shared` at the root for centralized environment management:

1. Copy `.env.shared.example` to `.env.shared`
2. Update with your configuration
3. Run `pnpm sync:env` to distribute to all packages

The sync happens automatically before `dev` and `build` commands.

---

### Adding a New Feature

1. **Update Prisma Schema** (`packages/database/prisma/schema.prisma`)
2. **Generate Migration**: `pnpm run db:migrate:dev`
3. **Create DTOs** in `packages/api/src/<feature>/dto/`
4. **Create Entity** in `packages/api/src/<feature>/entities/`
5. **Export** from `packages/api/src/entry.ts`
6. **Create NestJS Module** in `apps/be/src/<feature>/`
7. **Use in Frontend** with type-safe imports from `@repo/api`

---

## 🧪 Testing

```bash
# Run all tests
pnpm run test

# Run tests in specific app
cd apps/be && pnpm run test:watch
```

---

## 📦 Tech Stack

| Technology | Version   | Purpose               |
| ---------- | --------- | --------------------- |
| Node.js    | >=22.19.0 | Runtime environment   |
| pnpm       | 10.15.1   | Package manager       |
| Turborepo  | 2.5.8     | Monorepo build system |
| Next.js    | 15.x      | Frontend framework    |
| NestJS     | 11.x      | Backend framework     |
| React      | 19.x      | UI library            |
| Prisma     | 6.19.0    | ORM                   |
| PostgreSQL | latest    | Database              |
| TypeScript | 5.5.4     | Type safety           |
| ESLint     | 9.x       | Linting               |
| Prettier   | 3.x       | Code formatting       |
| Husky      | 8.x       | Git hooks             |

---

## 📖 Documentation

For detailed architectural patterns and development guidelines, see [`.github/copilot-instructions.md`](.github/copilot-instructions.md).

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
