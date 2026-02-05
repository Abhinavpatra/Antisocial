import { apiFetch } from '@/utils/backend';

export type ChallengeRow = {
  id: string;
  creator_user_id: string;
  title: string;
  description: string | null;
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  starts_at: string | null;
  ends_at: string | null;
  coin_reward: number;
  created_at: string;
  updated_at: string;
  participant_count: number;
  my_status: 'invited' | 'joined' | 'forfeited' | 'completed' | null;
};

export async function listChallenges(params: {
  userId: string;
  status?: 'draft' | 'active' | 'completed' | 'cancelled';
  limit?: number;
}) {
  const qs = new URLSearchParams();
  if (params.status) qs.set('status', params.status);
  if (params.limit) qs.set('limit', String(params.limit));
  const suffix = qs.toString() ? `?${qs.toString()}` : '';
  return await apiFetch<{ challenges: ChallengeRow[] }>(`/api/challenges${suffix}`, {
    userId: params.userId,
  });
}

export async function createChallenge(params: {
  userId: string;
  title: string;
  description?: string | null;
  coin_reward?: number | null;
  starts_at?: string | null;
  ends_at?: string | null;
}) {
  return await apiFetch<{ challenge: ChallengeRow }>('/api/challenges', {
    method: 'POST',
    userId: params.userId,
    body: {
      title: params.title,
      description: params.description ?? null,
      coin_reward: params.coin_reward ?? 0,
      starts_at: params.starts_at ?? null,
      ends_at: params.ends_at ?? null,
    },
  });
}

export async function joinChallenge(params: { userId: string; challengeId: string }) {
  return await apiFetch<{ status: string }>(`/api/challenges/${params.challengeId}/join`, {
    method: 'POST',
    userId: params.userId,
  });
}

export async function forfeitChallenge(params: { userId: string; challengeId: string }) {
  return await apiFetch<{ status: string }>(`/api/challenges/${params.challengeId}/forfeit`, {
    method: 'POST',
    userId: params.userId,
  });
}

export async function completeChallenge(params: { userId: string; challengeId: string }) {
  return await apiFetch<{ status: string; coinReward: number }>(
    `/api/challenges/${params.challengeId}/complete`,
    {
      method: 'POST',
      userId: params.userId,
    },
  );
}

