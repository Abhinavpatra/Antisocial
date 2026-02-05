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

    const res = await db.query(
      `update public.challenge_participants
       set status = 'forfeited'
       where challenge_id = $1 and user_id = $2
       returning challenge_id`,
      [challengeId, userId],
    );

    if (!res.rows.length) throw new ApiError(404, 'Not a participant');
    return jsonOk({ status: 'forfeited' });
  } catch (e) {
    return jsonError(e);
  }
}

