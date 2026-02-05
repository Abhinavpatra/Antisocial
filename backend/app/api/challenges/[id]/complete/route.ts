import type { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { ensureUser, requireUserId } from '@/lib/auth';
import { ApiError, jsonError, jsonOk } from '@/lib/http';

export const runtime = 'nodejs';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const client = await db.connect();
  try {
    const userId = requireUserId(req);
    await ensureUser(userId);
    const { id: challengeId } = await params;

    await client.query('begin');

    const challengeRes = await client.query(
      `select id, coin_reward, status from public.challenges where id = $1 limit 1`,
      [challengeId],
    );
    if (!challengeRes.rows.length) throw new ApiError(404, 'Challenge not found');
    if (challengeRes.rows[0].status !== 'active') throw new ApiError(400, 'Challenge not active');

    const participantRes = await client.query(
      `update public.challenge_participants
       set status = 'completed', completed_at = now()
       where challenge_id = $1 and user_id = $2
       returning challenge_id`,
      [challengeId, userId],
    );
    if (!participantRes.rows.length) throw new ApiError(404, 'Not a participant');

    const coinReward = Number(challengeRes.rows[0].coin_reward ?? 0);
    if (coinReward > 0) {
      // Idempotent due to partial unique index on (user_id, ref_type, ref_id)
      await client.query(
        `insert into public.coins_ledger (user_id, delta, reason, ref_type, ref_id)
         values ($1, $2, $3, 'challenge_complete', $4)
         on conflict (user_id, ref_type, ref_id) do nothing`,
        [userId, Math.floor(coinReward), `Challenge completed`, challengeId],
      );
    }

    await client.query('commit');
    return jsonOk({ status: 'completed', coinReward: Math.floor(coinReward) });
  } catch (e) {
    try {
      await client.query('rollback');
    } catch {}
    return jsonError(e);
  } finally {
    client.release();
  }
}

