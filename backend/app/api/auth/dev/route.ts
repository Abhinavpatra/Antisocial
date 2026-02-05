import { randomUUID } from 'crypto';
import type { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { ApiError, jsonError, jsonOk } from '@/lib/http';

export const runtime = 'nodejs';

// Dev-only helper to mint a user id without Supabase Auth wiring yet.
// Returns: { userId } — client should send it as `x-user-id` header.
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => null)) as
      | null
      | Partial<{
          email: string;
          username: string;
          display_name: string;
        }>;

    const email = body?.email?.trim() || null;
    const username = body?.username?.trim() || null;
    const displayName = body?.display_name?.trim() || null;

    if (!email && !username) {
      throw new ApiError(400, 'Provide at least one of: email, username');
    }

    // If an email already exists, reuse that user.
    if (email) {
      const existing = await db.query(`select id from public.users where email = $1`, [email]);
      if (existing.rows[0]?.id) return jsonOk({ userId: existing.rows[0].id });
    }

    const userId = randomUUID();

    await db.query(`insert into public.users (id, email) values ($1, $2)`, [userId, email]);
    await db.query(
      `insert into public.profiles (user_id, username, display_name)
       values ($1, $2, $3)
       on conflict (user_id) do update set
         username = coalesce(excluded.username, public.profiles.username),
         display_name = coalesce(excluded.display_name, public.profiles.display_name),
         updated_at = now()`,
      [userId, username, displayName],
    );
    await db.query(
      `insert into public.user_settings (user_id) values ($1) on conflict (user_id) do nothing`,
      [userId],
    );

    return jsonOk({ userId }, { status: 201 });
  } catch (e) {
    return jsonError(e);
  }
}

