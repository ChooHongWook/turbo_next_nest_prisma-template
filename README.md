# site_temp

```sh
pnpm i
```

```sh
docker-compose up -d
```

```bash
pnpm run build
```

```bash
pnpm run db:migrate:dev
```

```bash
pnpm run db:seed
```

```bash
pnpm run dev
# or
pnpm run start
```

### Apps and Packages

```bash
.
├── apps
│   ├── be                       # NestJS app (https://nestjs.com).
│   └── fe                       # Next.js app (https://nextjs.org).
└── packages
    ├── @repo/api                 # `NestJS` 관련 api 소스.
    ├── @repo/database            # `Prisma ORM` database 관련  (https://prisma.io).
    ├── @repo/eslint-config       # `eslint` 구성 (includes `prettier`).
    ├── @repo/jest-config         # `jest` 구성.
    ├── @repo/typescript-config   # `tsconfig.json` 구성.
    └── @repo/ui                  # `React` UI를 위한 component.
```

### DB 접근

**방법 1**

- 도커 컨테이너 접속 후 DB 접속

```bash
# docker 접속
# docker exec -it [CONTAINER NAME] bash
docker exec -it turborepo_postgres bash

# postgreSQL 접근
# psql -h [HOST] -p [PORT] -U [USERNAME] -d [DATABASE_NAME]
psql -h localhost -p 5432 -U prisma -d postgres_db
```

**방법 2**

- prisma studio 사용

```bash
pnpm run db:studio
```
