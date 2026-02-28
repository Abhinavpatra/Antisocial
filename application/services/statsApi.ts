import { apiFetch } from '@/utils/backend';

export type UserStats = {
  streak_days: number;
  current_rank: number | null;
  total_focus_hours: number;
  total_duration_ms: number;
  badges_earned: number;
  challenges_completed: number;
  active_challenges: number;
  friends_count: number;
};

export async function getUserStats(params: { userId: string }) {
  return await apiFetch<UserStats>('/api/me/stats', { userId: params.userId });
}
