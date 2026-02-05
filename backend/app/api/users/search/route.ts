import type { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { ensureUser, requireUserId } from '@/lib/auth';
import { ApiError, jsonError, jsonOk } from '@/lib/http';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    // Require user id for now so we can later apply privacy rules consistently.
    const userId = requireUserId(req);
    await ensureUser(userId);

    const { searchParams } = new URL(req.url);
    const q = (searchParams.get('q') ?? '').trim();
    if (!q) throw new ApiError(400, 'q is required');

    const limit = Math.min(Number(searchParams.get('limit') ?? 20), 50);

    const res = await db.query(
      `select user_id, username, display_name, avatar_url, is_private
       from public.profiles
       where (username ilike $1 or display_name ilike $1)
       order by (case when username ilike $2 then 0 else 1 end), username asc nulls last
       limit $3`,
      [`%${q}%`, `${q}%`, limit],
    );

    return jsonOk({ users: res.rows });
  } catch (e) {
    return jsonError(e);
  }
}

