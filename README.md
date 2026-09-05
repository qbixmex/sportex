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

# It will generate something like this:
'1f135548a57a4e2c043d6eb6a6b5e144 and more ...'

# ------- Alternative with Open SSL -------
openssl rand -base64 32

# It will generate something like this:
'W4w2IBUAoVqqTI3ODmyvmJa ...'
```
