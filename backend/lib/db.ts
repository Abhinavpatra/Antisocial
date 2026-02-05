import { Pool } from 'pg';
import { env } from './env';

declare global {
  // eslint-disable-next-line no-var
  var __timerapp_pg_pool__: Pool | undefined;
}

function createPool() {
  // Supabase Postgres typically requires SSL. Using rejectUnauthorized=false is the
  // standard workaround for managed Postgres when you don't ship a CA bundle.
  return new Pool({
    connectionString: env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    max: 5,
  });
}

export const db: Pool = globalThis.__timerapp_pg_pool__ ?? createPool();
if (process.env.NODE_ENV !== 'production') globalThis.__timerapp_pg_pool__ = db;

