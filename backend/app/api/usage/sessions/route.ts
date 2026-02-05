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
          app_package: string | null;
          started_at: string;
          ended_at: string | null;
          duration_ms: number | null;
        }>;

    if (!body?.started_at) throw new ApiError(400, 'started_at is required');

    const res = await db.query(
      `insert into public.usage_sessions (user_id, app_package, started_at, ended_at, duration_ms)
       values ($1, $2, $3::timestamptz, $4::timestamptz, $5)
       returning id, user_id, app_package, started_at, ended_at, duration_ms, created_at`,
      [
        userId,
        body.app_package ?? null,
        body.started_at,
        body.ended_at ?? null,
        body.duration_ms ?? null,
      ],
    );

    return jsonOk({ session: res.rows[0] }, { status: 201 });
  } catch (e) {
    return jsonError(e);
  }
}

export async function GET(req: NextRequest) {
  try {
    const userId = requireUserId(req);
    await ensureUser(userId);

    const { searchParams } = new URL(req.url);
    const limit = Math.min(Number(searchParams.get('limit') ?? 50), 200);

    const res = await db.query(
      `select id, user_id, app_package, started_at, ended_at, duration_ms, created_at
       from public.usage_sessions
       where user_id = $1
       order by started_at desc
       limit $2`,
      [userId, limit],
    );

    return jsonOk({ sessions: res.rows });
  } catch (e) {
    return jsonError(e);
  }
}

