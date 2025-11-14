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