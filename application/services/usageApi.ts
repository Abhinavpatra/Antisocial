import { apiFetch } from '@/utils/backend';

export async function postUsageSession(params: {
  userId: string;
  app_package?: string | null;
  started_at: string;
  ended_at?: string | null;
  duration_ms?: number | null;
}) {
  return await apiFetch<{ session: unknown }>('/api/usage/sessions', {
    method: 'POST',
    userId: params.userId,
    body: {
      app_package: params.app_package ?? null,
      started_at: params.started_at,
      ended_at: params.ended_at ?? null,
      duration_ms: params.duration_ms ?? null,
    },
  });
}

export async function getUsageSummary(params: {
  userId: string;
  range?: 'day' | 'week';
}) {
  const range = params.range ?? 'day';
  return await apiFetch<{
    range: 'day' | 'week';
    totalDurationMs: number;
    sessionCount: number;
  }>(`/api/usage/summary?range=${range}`, { userId: params.userId });
}

