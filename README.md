# site_temp

```sh
pnpm i
```

```sh
docker-compose up -d
```

```bash
cp .env.example ./packages/database/.env
cp .env.example ./apps/web/.env
cp .env.example ./apps/api/.env
```

```bash
pnpm run db:migrate:dev
```

```bash
pnpm run db:seed
```

```bash
pnpm run build
```

### Apps and Packages

```shell
.
├── apps
│   ├── api                       # NestJS app (https://nestjs.com).
│   └── web                       # Next.js app (https://nextjs.org).
└── packages
    ├── @repo/api                 # `NestJS` 관련 api 소스.
    ├── @repo/database            # `Prisma ORM` database 관련  (https://prisma.io).
    ├── @repo/eslint-config       # `eslint` 구성 (includes `prettier`).
    ├── @repo/jest-config         # `jest` 구성.
    ├── @repo/typescript-config   # `tsconfig.json` 구성.
    └── @repo/ui                  # `React` UI를 위한 component.
```
