function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

function optionalEnv(name: string, defaultValue: string): string {
  return process.env[name] ?? defaultValue;
}

export const env = {
  DATABASE_URL: requireEnv('DATABASE_URL'),
  // CORS allowed origins (comma-separated)
  CORS_ORIGIN: optionalEnv('CORS_ORIGIN', '*'),
  // Environment
  NODE_ENV: process.env.NODE_ENV ?? 'development',
} as const;

// Validate on startup
if (env.NODE_ENV === 'production' && env.CORS_ORIGIN === '*') {
  console.warn('WARNING: CORS_ORIGIN is set to "*" in production. Consider restricting this.');
}

