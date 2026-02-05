import type { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { ensureUser, requireUserId } from '@/lib/auth';
import { ApiError, jsonError, jsonOk } from '@/lib/http';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const client = await db.connect();
  try {
    const userId = requireUserId(req);
    await ensureUser(userId);

    const body = (await req.json().catch(() => null)) as
      | null
      | Partial<{
          requester_user_id: string;
          action: 'accept' | 'decline';
        }>;

    const requesterUserId = body?.requester_user_id?.trim() || null;
    const action = body?.action ?? null;

    if (!requesterUserId || (action !== 'accept' && action !== 'decline')) {
      throw new ApiError(400, 'Provide requester_user_id and action=accept|decline');
    }

    await client.query('begin');

    const existing = await client.query(
      `select status
       from public.friends
       where requester_user_id = $1 and addressee_user_id = $2
       limit 1`,
      [requesterUserId, userId],
    );

    if (!existing.rows.length) throw new ApiError(404, 'Friend request not found');

    if (action === 'decline') {
      await client.query(
        `delete from public.friends where requester_user_id = $1 and addressee_user_id = $2`,
        [requesterUserId, userId],
      );
      await client.query('commit');
      return jsonOk({ status: 'declined' });
    }

    // accept
    await client.query(
      `update public.friends
       set status = 'accepted', updated_at = now()
       where requester_user_id = $1 and addressee_user_id = $2`,
      [requesterUserId, userId],
    );

    // mirror row for easier queries (optional, but keeps state symmetric)
    await client.query(
      `insert into public.friends (requester_user_id, addressee_user_id, status)
       values ($1, $2, 'accepted')
       on conflict (requester_user_id, addressee_user_id) do update set
         status = 'accepted',
         updated_at = now()`,
      [userId, requesterUserId],
    );

    await client.query('commit');
    return jsonOk({ status: 'accepted' });
  } catch (e) {
    try {
      await client.query('rollback');
    } catch {}
    return jsonError(e);
  } finally {
    client.release();
  }
}

