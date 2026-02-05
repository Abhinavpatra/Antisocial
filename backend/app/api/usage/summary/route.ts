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

    const since =
      range === 'day'
        ? `now() - interval '24 hours'`
        : `now() - interval '7 days'`;

    const res = await db.query(
      `select
         coalesce(sum(duration_ms), 0)::bigint as total_duration_ms,
         count(*)::int as session_count
       from public.usage_sessions
       where user_id = $1
         and started_at >= ${since}`,
      [userId],
    );

    return jsonOk({
      range,
      totalDurationMs: Number(res.rows[0]?.total_duration_ms ?? 0),
      sessionCount: res.rows[0]?.session_count ?? 0,
    });
  } catch (e) {
    return jsonError(e);
  }
}

