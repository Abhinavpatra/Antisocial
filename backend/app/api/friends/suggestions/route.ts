import type { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { ensureUser, requireUserId } from '@/lib/auth';
import { jsonError, jsonOk } from '@/lib/http';

export const runtime = 'nodejs';

/**
 * GET /api/friends/suggestions
 * Returns friend suggestions based on mutual friends and activity
 */
export async function GET(req: NextRequest) {
  try {
    const userId = requireUserId(req);
    await ensureUser(userId);

    const { searchParams } = new URL(req.url);
    const limit = Math.min(Number(searchParams.get('limit') ?? 10), 50);

    // Get friend suggestions:
    // 1. Friends of friends (mutual connections)
    // 2. Users with similar activity patterns
    // 3. Exclude existing friends and pending requests
    const res = await db.query(
      `with existing_connections as (
         -- Users already connected (friends or pending requests)
         select addressee_user_id as connected_user_id
         from public.friends
         where requester_user_id = $1
         union
         select requester_user_id as connected_user_id
         from public.friends
         where addressee_user_id = $1
       ),
       friends_of_friends as (
         -- Friends of my friends
         select 
           f2.addressee_user_id as suggested_user_id,
           count(*)::int as mutual_friends_count
         from public.friends f1
         join public.friends f2 on (
           (f1.addressee_user_id = f2.requester_user_id or f1.requester_user_id = f2.requester_user_id)
           and f2.status = 'accepted'
         )
         where f1.status = 'accepted'
           and (f1.requester_user_id = $1 or f1.addressee_user_id = $1)
           and f2.addressee_user_id != $1
           and f2.addressee_user_id not in (select connected_user_id from existing_connections)
         group by f2.addressee_user_id
       ),
       active_users as (
         -- Users with recent activity on the platform
         select 
           us.user_id as suggested_user_id,
           0 as mutual_friends_count
         from public.usage_sessions us
         where us.started_at >= now() - interval '7 days'
           and us.user_id != $1
           and us.user_id not in (select connected_user_id from existing_connections)
         group by us.user_id
         having sum(us.duration_ms) > 0
       ),
       combined_suggestions as (
         select * from friends_of_friends
         union
         select * from active_users
         where suggested_user_id not in (select suggested_user_id from friends_of_friends)
       )
       select 
         p.user_id,
         p.username,
         p.display_name,
         p.avatar_url,
         p.is_private,
         cs.mutual_friends_count,
         'mutual_friends' as suggestion_reason
       from combined_suggestions cs
       join public.profiles p on p.user_id = cs.suggested_user_id
       where p.is_private = false
       order by cs.mutual_friends_count desc, cs.suggested_user_id
       limit $2`,
      [userId, limit],
    );

    return jsonOk({
      suggestions: res.rows,
    });
  } catch (e) {
    return jsonError(e);
  }
}
