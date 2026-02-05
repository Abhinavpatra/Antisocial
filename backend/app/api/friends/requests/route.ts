import type { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { ensureUser, requireUserId } from '@/lib/auth';
import { jsonError, jsonOk } from '@/lib/http';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    const userId = requireUserId(req);
    await ensureUser(userId);

    const incoming = await db.query(
      `select f.requester_user_id as user_id, p.username, p.display_name, p.avatar_url, f.created_at
       from public.friends f
       join public.profiles p on p.user_id = f.requester_user_id
       where f.addressee_user_id = $1 and f.status = 'requested'
       order by f.created_at desc`,
      [userId],
    );

    const outgoing = await db.query(
      `select f.addressee_user_id as user_id, p.username, p.display_name, p.avatar_url, f.created_at
       from public.friends f
       join public.profiles p on p.user_id = f.addressee_user_id
       where f.requester_user_id = $1 and f.status = 'requested'
       order by f.created_at desc`,
      [userId],
    );

    return jsonOk({ incoming: incoming.rows, outgoing: outgoing.rows });
  } catch (e) {
    return jsonError(e);
  }
}

