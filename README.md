# Sportex

## Project setup

```bash
bun install
```

## Compile and run the project

**Development**

```bash
bun start
```

**Watch Mode**

```bash
bun start:dev
```

**Production Mode**

```bash
bun start:prod
```

## Linting

```bash
bun lint
```

## Check typescript errors

```bash
$ bun type:check
```

## Run tests

**Running Tests**

```bash
bun test
```

**E2E Tests**

```bash
bun run test:e2e
```

**Test Coverage**
```bash
bun run test:cov
```

## Deployment

```bash
$ bun install -g @nestjs/mau
$ mau deploy
```

## Docker

```bash
docker compose -p sportex up -d

# -p container name
# -d detach mode
```

## Database Migrations

**Generate new migration:**

```bash
bun migration:generate --name create_"placeholder"_table
```

**Run migration:**

```bash
bun migration:run
```

**Rollback migration:**

```bash
bun migration:revert
```

## Generate Auth Secret Key

```bash
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

**Alternative with Open SSL**

```bash
openssl rand -base64 32
```
