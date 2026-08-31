export const envConfiguration = () => ({
  environment: process.env.NODE_ENV ?? 'dev',
  databaseUrl: process.env.DATABASE_URL ?? undefined,
  port: process.env.PORT ?? 4000,
  defaultLimit: process.env.DEFAULT_LIMIT ?? undefined,
  host: process.env.DB_HOST ?? 'localhost',
  authSecret: process.env.AUTH_SECRET ?? '',
});
