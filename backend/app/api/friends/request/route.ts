import type { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { ensureUser, requireUserId } from '@/lib/auth';
import { ApiError, jsonError, jsonOk } from '@/lib/http';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const userId = requireUserId(req);
    await ensureUser(userId);

    const body = (await req.json().catch(() => null)) as
      | null
      | Partial<{
          to_user_id: string;
          to_username: string;
        }>;

    let toUserId = body?.to_user_id?.trim() || null;
    const toUsername = body?.to_username?.trim() || null;

    if (!toUserId && !toUsername) throw new ApiError(400, 'Provide to_user_id or to_username');

    if (!toUserId && toUsername) {
      const lookup = await db.query(`select user_id from public.profiles where username = $1`, [
        toUsername,
      ]);
      toUserId = lookup.rows[0]?.user_id ?? null;
    }

    if (!toUserId) throw new ApiError(404, 'User not found');
    if (toUserId === userId) throw new ApiError(400, 'Cannot friend yourself');

    // If already accepted either direction, treat as no-op.
    const existingAccepted = await db.query(
      `select 1
       from public.friends
       where status = 'accepted'
         and ((requester_user_id = $1 and addressee_user_id = $2)
           or (requester_user_id = $2 and addressee_user_id = $1))
       limit 1`,
      [userId, toUserId],
    );
    if (existingAccepted.rows.length) return jsonOk({ status: 'already_friends' });

    await db.query(
      `insert into public.friends (requester_user_id, addressee_user_id, status)
       values ($1, $2, 'requested')
       on conflict (requester_user_id, addressee_user_id) do update set
         status = 'requested',
         updated_at = now()`,
      [userId, toUserId],
    );

    return jsonOk({ status: 'requested' }, { status: 201 });
  } catch (e) {
    return jsonError(e);
  }
}

