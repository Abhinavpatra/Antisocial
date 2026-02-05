import type { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { ensureUser, requireUserId } from '@/lib/auth';
import { jsonError, jsonOk } from '@/lib/http';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    const userId = requireUserId(req);
    await ensureUser(userId);

    const profileRes = await db.query(
      `select user_id, username, display_name, avatar_url, bio, is_private, created_at, updated_at
       from public.profiles
       where user_id = $1`,
      [userId],
    );

    const coinsRes = await db.query(
      `select coalesce(sum(delta), 0)::int as coins
       from public.coins_ledger
       where user_id = $1`,
      [userId],
    );

    const badgesRes = await db.query(
      `select b.key, b.title, b.description, b.icon, ub.earned_at
       from public.user_badges ub
       join public.badges b on b.id = ub.badge_id
       where ub.user_id = $1
       order by ub.earned_at desc`,
      [userId],
    );

    return jsonOk({
      userId,
      profile: profileRes.rows[0] ?? null,
      coins: coinsRes.rows[0]?.coins ?? 0,
      badges: badgesRes.rows,
    });
  } catch (e) {
    return jsonError(e);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const userId = requireUserId(req);
    await ensureUser(userId);

    const body = (await req.json().catch(() => ({}))) as Partial<{
      username: string | null;
      display_name: string | null;
      avatar_url: string | null;
      bio: string | null;
      is_private: boolean | null;
    }>;

    const allowed = {
      username: body.username,
      display_name: body.display_name,
      avatar_url: body.avatar_url,
      bio: body.bio,
      is_private: body.is_private,
    };

    const res = await db.query(
      `insert into public.profiles (user_id, username, display_name, avatar_url, bio, is_private, updated_at)
       values ($1, $2, $3, $4, $5, $6, now())
       on conflict (user_id) do update set
         username = coalesce(excluded.username, public.profiles.username),
         display_name = coalesce(excluded.display_name, public.profiles.display_name),
         avatar_url = coalesce(excluded.avatar_url, public.profiles.avatar_url),
         bio = coalesce(excluded.bio, public.profiles.bio),
         is_private = coalesce(excluded.is_private, public.profiles.is_private),
         updated_at = now()
       returning user_id, username, display_name, avatar_url, bio, is_private, created_at, updated_at`,
      [
        userId,
        allowed.username ?? null,
        allowed.display_name ?? null,
        allowed.avatar_url ?? null,
        allowed.bio ?? null,
        allowed.is_private ?? null,
      ],
    );

    return jsonOk({ profile: res.rows[0] });
  } catch (e) {
    return jsonError(e);
  }
}

