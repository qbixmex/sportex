# Sportex

## Project setup

```bash
> bun install
```

## Compile and run the project

```bash
# development
> npm run start

# watch mode
> npm run start:dev

# production mode
> npm run start:prod
```

## Run tests

```bash
# unit tests
$ bun test

# e2e tests
$ bun run test:e2e

# test coverage
$ bun run test:cov
```

## Deployment

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

## Docker

```bash
docker compose -p sportex up -d

# -p container name
# -d detach mode
```

**Create your migrations:**

```bash
npx prisma migrate dev --name init

# --name migration_name
```

**Prisma Client:**

```bash
npx prisma generate
```

## Prisma Studio

**You can check your database in the browser**

```bash
npx prisma studio
```
