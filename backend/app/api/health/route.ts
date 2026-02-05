import { db } from '@/lib/db';
import { jsonError, jsonOk } from '@/lib/http';

export const runtime = 'nodejs';

export async function GET() {
  try {
    await db.query('select 1 as ok');
    return jsonOk({ status: 'ok' });
  } catch (e) {
    return jsonError(e);
  }
}

