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
      `with totals as (
         select user_id, coalesce(sum(duration_ms), 0)::bigint as total_duration_ms
         from public.usage_sessions
         where started_at >= ${since}
         group by user_id
       )
       select
         p.user_id,
         p.username,
         p.display_name,
         p.avatar_url,
         coalesce(t.total_duration_ms, 0)::bigint as total_duration_ms
       from public.profiles p
       left join totals t on t.user_id = p.user_id
       order by total_duration_ms desc, p.username asc nulls last
       limit $1`,
      [limit],
    );

    return jsonOk({ range, leaderboard: res.rows });
  } catch (e) {
    return jsonError(e);
  }
}

