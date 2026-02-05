import { apiFetch } from '@/utils/backend';

export type PublicProfile = {
  user_id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  is_private: boolean;
};

export async function searchUsers(params: { userId: string; q: string; limit?: number }) {
  const qs = new URLSearchParams({ q: params.q });
  if (params.limit) qs.set('limit', String(params.limit));
  return await apiFetch<{ users: PublicProfile[] }>(`/api/users/search?${qs.toString()}`, {
    userId: params.userId,
  });
}

export async function getFriends(params: { userId: string }) {
  return await apiFetch<{ friends: PublicProfile[] }>('/api/friends', { userId: params.userId });
}

export type FriendRequestRow = {
  user_id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
};

export async function getFriendRequests(params: { userId: string }) {
  return await apiFetch<{ incoming: FriendRequestRow[]; outgoing: FriendRequestRow[] }>(
    '/api/friends/requests',
    { userId: params.userId },
  );
}

export async function requestFriend(params: {
  userId: string;
  to_user_id?: string;
  to_username?: string;
}) {
  return await apiFetch<{ status: string }>('/api/friends/request', {
    method: 'POST',
    userId: params.userId,
    body: { to_user_id: params.to_user_id, to_username: params.to_username },
  });
}

export async function respondToFriendRequest(params: {
  userId: string;
  requester_user_id: string;
  action: 'accept' | 'decline';
}) {
  return await apiFetch<{ status: string }>('/api/friends/respond', {
    method: 'POST',
    userId: params.userId,
    body: { requester_user_id: params.requester_user_id, action: params.action },
  });
}

export type LeaderboardRow = {
  user_id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  total_duration_ms: number;
};

export async function getLeaderboard(params: {
  userId: string;
  scope: 'friends' | 'global';
  range?: 'day' | 'week';
  limit?: number;
}) {
  const range = params.range ?? 'day';
  const qs = new URLSearchParams({ range });
  if (params.limit) qs.set('limit', String(params.limit));

  const path =
    params.scope === 'friends'
      ? `/api/leaderboard/friends?${qs.toString()}`
      : `/api/leaderboard/global?${qs.toString()}`;

  return await apiFetch<{ range: 'day' | 'week'; leaderboard: LeaderboardRow[] }>(path, {
    userId: params.userId,
  });
}

