import type { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { ensureUser, requireUserId } from '@/lib/auth';
import { ApiError, jsonError, jsonOk } from '@/lib/http';

export const runtime = 'nodejs';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const userId = requireUserId(req);
    await ensureUser(userId);
    const { id: challengeId } = await params;

    const exists = await db.query(`select id from public.challenges where id = $1`, [challengeId]);
    if (!exists.rows.length) throw new ApiError(404, 'Challenge not found');

    await db.query(
      `insert into public.challenge_participants (challenge_id, user_id, status, joined_at)
       values ($1, $2, 'joined', now())
       on conflict (challenge_id, user_id) do update set
         status = 'joined',
         joined_at = coalesce(public.challenge_participants.joined_at, now())`,
      [challengeId, userId],
    );

    return jsonOk({ status: 'joined' });
  } catch (e) {
    return jsonError(e);
  }
}

