import type { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { ensureUser, requireUserId } from '@/lib/auth';
import { jsonError, jsonOk } from '@/lib/http';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    const userId = requireUserId(req);
    await ensureUser(userId);

    // Accepted friendship is treated as either direction.
    const res = await db.query(
      `with friend_ids as (
         select
           case
             when requester_user_id = $1 then addressee_user_id
             else requester_user_id
           end as friend_user_id
         from public.friends
         where status = 'accepted'
           and (requester_user_id = $1 or addressee_user_id = $1)
       )
       select p.user_id, p.username, p.display_name, p.avatar_url, p.is_private
       from friend_ids f
       join public.profiles p on p.user_id = f.friend_user_id
       order by p.username asc nulls last`,
      [userId],
    );

    return jsonOk({ friends: res.rows });
  } catch (e) {
    return jsonError(e);
  }
}

