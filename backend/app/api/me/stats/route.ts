import type { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { ensureUser, requireUserId } from '@/lib/auth';
import { jsonError, jsonOk } from '@/lib/http';

export const runtime = 'nodejs';

/**
 * GET /api/me/stats
 * Returns user statistics including streak, rank, total focus time, etc.
 */
export async function GET(req: NextRequest) {
  try {
    const userId = requireUserId(req);
    await ensureUser(userId);

    // Get total focus hours (from usage sessions)
    const focusRes = await db.query(
      `select coalesce(sum(duration_ms), 0)::bigint as total_duration_ms
       from public.usage_sessions
       where user_id = $1`,
      [userId],
    );
    const totalDurationMs = Number(focusRes.rows[0]?.total_duration_ms ?? 0);
    const totalFocusHours = Math.round(totalDurationMs / (1000 * 60 * 60));

    // Calculate streak (consecutive days with usage recorded)
    const streakRes = await db.query(
      `with daily_usage as (
         select date(started_at) as usage_date
         from public.usage_sessions
         where user_id = $1
           and started_at >= now() - interval '365 days'
         group by date(started_at)
       ),
       streak_calc as (
         select 
           usage_date,
           usage_date - (row_number() over (order by usage_date desc))::int as streak_group
         from daily_usage
       )
       select count(*)::int as streak_days
       from streak_calc
       where streak_group = (select streak_group from streak_calc order by usage_date desc limit 1)
         and usage_date >= current_date - 1`,
      [userId],
    );
    const streakDays = streakRes.rows[0]?.streak_days ?? 0;

    // Get global rank based on total focus time
    const rankRes = await db.query(
      `with user_totals as (
         select user_id, sum(duration_ms) as total_ms
         from public.usage_sessions
         group by user_id
       ),
       ranked as (
         select user_id, rank() over (order by total_ms desc) as rank
         from user_totals
       )
       select rank::int
       from ranked
       where user_id = $1`,
      [userId],
    );
    const currentRank = rankRes.rows[0]?.rank ?? null;

    // Get badges count
    const badgesRes = await db.query(
      `select count(*)::int as count
       from public.user_badges
       where user_id = $1`,
      [userId],
    );
    const badgesEarned = badgesRes.rows[0]?.count ?? 0;

    // Get challenges completed count
    const challengesRes = await db.query(
      `select count(*)::int as count
       from public.challenge_participants
       where user_id = $1 and status = 'completed'`,
      [userId],
    );
    const challengesCompleted = challengesRes.rows[0]?.count ?? 0;

    // Get challenges active count
    const activeChallengesRes = await db.query(
      `select count(*)::int as count
       from public.challenge_participants cp
       join public.challenges c on c.id = cp.challenge_id
       where cp.user_id = $1 
         and cp.status = 'joined' 
         and c.status = 'active'`,
      [userId],
    );
    const activeChallenges = activeChallengesRes.rows[0]?.count ?? 0;

    // Get friends count
    const friendsRes = await db.query(
      `select count(*)::int as count
       from public.friends
       where status = 'accepted'
         and (requester_user_id = $1 or addressee_user_id = $1)`,
      [userId],
    );
    const friendsCount = friendsRes.rows[0]?.count ?? 0;

    return jsonOk({
      streak_days: streakDays,
      current_rank: currentRank,
      total_focus_hours: totalFocusHours,
      total_duration_ms: totalDurationMs,
      badges_earned: badgesEarned,
      challenges_completed: challengesCompleted,
      active_challenges: activeChallenges,
      friends_count: friendsCount,
    });
  } catch (e) {
    return jsonError(e);
  }
}
