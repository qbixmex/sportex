declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string | null;
      DEFAULT_LIMIT: string | null;
      DATABASE_URL: string | null;
      DB_HOST: string | null;
      DB_PORT: string | null;
      DB_NAME: string | null;
      DB_USER: string | null;
      DB_PASSWORD: string | null;
      AUTH_SECRET: string | null;
    }
  }
}

export {};
