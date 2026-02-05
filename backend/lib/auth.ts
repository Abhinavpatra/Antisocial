import type { NextRequest } from 'next/server';
import { db } from './db';
import { ApiError } from './http';

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function requireUserId(req: NextRequest): string {
  const userId = req.headers.get('x-user-id') ?? '';
  if (!userId || !UUID_RE.test(userId)) {
    throw new ApiError(401, 'Missing/invalid x-user-id header');
  }
  return userId;
}

// Dev-friendly: ensures a user/profile row exists for the provided userId.
export async function ensureUser(userId: string) {
  await db.query('insert into public.users (id) values ($1) on conflict (id) do nothing', [
    userId,
  ]);
  await db.query(
    'insert into public.profiles (user_id) values ($1) on conflict (user_id) do nothing',
    [userId],
  );
  await db.query(
    'insert into public.user_settings (user_id) values ($1) on conflict (user_id) do nothing',
    [userId],
  );
}

