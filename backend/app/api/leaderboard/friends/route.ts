import type { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { ensureUser, requireUserId } from '@/lib/auth';
import { ApiError, jsonError, jsonOk } from '@/lib/http';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    const userId = requireUserId(req);
    await ensureUser(userId);

    const { searchParams } = new URL(req.url);
    const range = (searchParams.get('range') ?? 'day') as 'day' | 'week';
    if (!['day', 'week'].includes(range)) throw new ApiError(400, 'range must be day|week');
    const limit = Math.min(Number(searchParams.get('limit') ?? 50), 200);

    const since = range === 'day' ? `now() - interval '24 hours'` : `now() - interval '7 days'`;

    const res = await db.query(
      `with friend_ids as (
         select $1::uuid as friend_user_id
         union
         select
           case
             when requester_user_id = $1 then addressee_user_id
             else requester_user_id
           end as friend_user_id
         from public.friends
         where status = 'accepted'
           and (requester_user_id = $1 or addressee_user_id = $1)
       ),
       totals as (
         select us.user_id, coalesce(sum(us.duration_ms), 0)::bigint as total_duration_ms
         from public.usage_sessions us
         join friend_ids f on f.friend_user_id = us.user_id
         where us.started_at >= ${since}
         group by us.user_id
       )
       select
         p.user_id,
         p.username,
         p.display_name,
         p.avatar_url,
         coalesce(t.total_duration_ms, 0)::bigint as total_duration_ms
       from friend_ids f
       join public.profiles p on p.user_id = f.friend_user_id
       left join totals t on t.user_id = p.user_id
       order by total_duration_ms desc, p.username asc nulls last
       limit $2`,
      [userId, limit],
    );

    return jsonOk({ range, leaderboard: res.rows });
  } catch (e) {
    return jsonError(e);
  }
}

