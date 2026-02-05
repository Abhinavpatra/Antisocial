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
    const status = searchParams.get('status'); // optional
    const limit = Math.min(Number(searchParams.get('limit') ?? 50), 200);

    const params: unknown[] = [userId, limit];
    const statusClause =
      status && ['draft', 'active', 'completed', 'cancelled'].includes(status)
        ? (params.push(status), 'and c.status = $3')
        : '';

    const res = await db.query(
      `with mine as (
         select c.*
         from public.challenges c
         where c.creator_user_id = $1
         ${statusClause}
         union
         select c.*
         from public.challenges c
         join public.challenge_participants cp on cp.challenge_id = c.id
         where cp.user_id = $1
         ${statusClause}
       ),
       participant_counts as (
         select challenge_id, count(*)::int as participant_count
         from public.challenge_participants
         group by challenge_id
       ),
       my_participation as (
         select challenge_id, status as my_status
         from public.challenge_participants
         where user_id = $1
       )
       select
         m.id,
         m.creator_user_id,
         m.title,
         m.description,
         m.status,
         m.starts_at,
         m.ends_at,
         m.coin_reward,
         m.created_at,
         m.updated_at,
         coalesce(pc.participant_count, 0)::int as participant_count,
         mp.my_status
       from mine m
       left join participant_counts pc on pc.challenge_id = m.id
       left join my_participation mp on mp.challenge_id = m.id
       order by m.created_at desc
       limit $2`,
      params as any[],
    );

    return jsonOk({ challenges: res.rows });
  } catch (e) {
    return jsonError(e);
  }
}

export async function POST(req: NextRequest) {
  const client = await db.connect();
  try {
    const userId = requireUserId(req);
    await ensureUser(userId);

    const body = (await req.json().catch(() => null)) as
      | null
      | Partial<{
          title: string;
          description: string | null;
          starts_at: string | null;
          ends_at: string | null;
          coin_reward: number | null;
        }>;

    const title = body?.title?.trim();
    if (!title) throw new ApiError(400, 'title is required');

    const coinReward = body?.coin_reward ?? 0;
    if (typeof coinReward !== 'number' || coinReward < 0) {
      throw new ApiError(400, 'coin_reward must be a non-negative number');
    }

    await client.query('begin');

    const challengeRes = await client.query(
      `insert into public.challenges
         (creator_user_id, title, description, status, starts_at, ends_at, coin_reward, created_at, updated_at)
       values
         ($1, $2, $3, 'active', $4::timestamptz, $5::timestamptz, $6, now(), now())
       returning id, creator_user_id, title, description, status, starts_at, ends_at, coin_reward, created_at, updated_at`,
      [
        userId,
        title,
        body?.description ?? null,
        body?.starts_at ?? null,
        body?.ends_at ?? null,
        Math.floor(coinReward),
      ],
    );

    const challengeId = challengeRes.rows[0].id as string;

    // Auto-join creator as "joined"
    await client.query(
      `insert into public.challenge_participants (challenge_id, user_id, status, joined_at)
       values ($1, $2, 'joined', now())
       on conflict (challenge_id, user_id) do update set
         status = 'joined',
         joined_at = coalesce(public.challenge_participants.joined_at, now())`,
      [challengeId, userId],
    );

    await client.query('commit');
    return jsonOk({ challenge: challengeRes.rows[0] }, { status: 201 });
  } catch (e) {
    try {
      await client.query('rollback');
    } catch {}
    return jsonError(e);
  } finally {
    client.release();
  }
}

