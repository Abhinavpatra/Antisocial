import type { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { ensureUser, requireUserId } from '@/lib/auth';
import { ApiError, jsonError, jsonOk } from '@/lib/http';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    const userId = requireUserId(req);
    await ensureUser(userId);

    const res = await db.query(
      `select user_id, theme_mode, palette, created_at, updated_at
       from public.user_settings
       where user_id = $1`,
      [userId],
    );

    return jsonOk({ settings: res.rows[0] ?? null });
  } catch (e) {
    return jsonError(e);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const userId = requireUserId(req);
    await ensureUser(userId);

    const body = (await req.json().catch(() => ({}))) as Partial<{
      theme_mode: 'system' | 'light' | 'dark' | null;
      palette: 'a' | 'b' | 'c' | 'd' | null;
    }>;

    const themeMode = body.theme_mode ?? null;
    const palette = body.palette ?? null;

    if (themeMode && !['system', 'light', 'dark'].includes(themeMode)) {
      throw new ApiError(400, 'Invalid theme_mode');
    }
    if (palette && !['a', 'b', 'c', 'd'].includes(palette)) {
      throw new ApiError(400, 'Invalid palette');
    }

    const res = await db.query(
      `insert into public.user_settings (user_id, theme_mode, palette, updated_at)
       values ($1, coalesce($2, 'system'), coalesce($3, 'a'), now())
       on conflict (user_id) do update set
         theme_mode = coalesce(excluded.theme_mode, public.user_settings.theme_mode),
         palette = coalesce(excluded.palette, public.user_settings.palette),
         updated_at = now()
       returning user_id, theme_mode, palette, created_at, updated_at`,
      [userId, themeMode, palette],
    );

    return jsonOk({ settings: res.rows[0] });
  } catch (e) {
    return jsonError(e);
  }
}

