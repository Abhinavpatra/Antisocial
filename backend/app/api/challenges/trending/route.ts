import type { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { ensureUser, requireUserId } from '@/lib/auth';
import { jsonError, jsonOk } from '@/lib/http';

export const runtime = 'nodejs';

/**
 * GET /api/challenges/trending
 * Returns trending challenges based on participation count and recency
 */
export async function GET(req: NextRequest) {
  try {
    const userId = requireUserId(req);
    await ensureUser(userId);

    const { searchParams } = new URL(req.url);
    const limit = Math.min(Number(searchParams.get('limit') ?? 10), 50);

    // Get trending challenges: active challenges with most participants
    // Excludes challenges the user has already joined
    const res = await db.query(
      `with participant_counts as (
         select 
           challenge_id, 
           count(*)::int as participant_count
         from public.challenge_participants
         where status = 'joined'
         group by challenge_id
       ),
       recent_activity as (
         select 
           challenge_id,
           count(*)::int as recent_joins
         from public.challenge_participants
         where status = 'joined'
           and joined_at >= now() - interval '7 days'
         group by challenge_id
       )
       select 
         c.id,
         c.creator_user_id,
         c.title,
         c.description,
         c.status,
         c.starts_at,
         c.ends_at,
         c.coin_reward,
         c.created_at,
         c.updated_at,
         coalesce(pc.participant_count, 0)::int as participant_count,
         coalesce(ra.recent_joins, 0)::int as recent_joins,
         cp.status as my_status
       from public.challenges c
       left join participant_counts pc on pc.challenge_id = c.id
       left join recent_activity ra on ra.challenge_id = c.id
       left join public.challenge_participants cp on cp.challenge_id = c.id and cp.user_id = $1
       where c.status = 'active'
         and (cp.status is null or cp.status not in ('joined', 'completed'))
       order by 
         coalesce(ra.recent_joins, 0) desc,
         coalesce(pc.participant_count, 0) desc,
         c.created_at desc
       limit $2`,
      [userId, limit],
    );

    return jsonOk({
      trending: res.rows,
    });
  } catch (e) {
    return jsonError(e);
  }
}
