# Sportex

## Project setup

```bash
> bun install
```

## Compile and run the project

```bash
# development
> bun start

# watch mode
> bun start:dev

# production mode
> bun start:prod
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

## Generate Auth Secret Key

```bash
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"

# It will generate something like this:
'1f135548a57a4e2c043d6eb6a6b5e144 and more ...'

# ------- Alternative with Open SSL -------
openssl rand -base64 32

# It will generate something like this:
'W4w2IBUAoVqqTI3ODmyvmJa ...'
```
