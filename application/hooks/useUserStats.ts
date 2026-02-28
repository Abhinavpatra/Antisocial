import React from 'react';
import { apiFetch, isNetworkError } from '@/utils/backend';
import { useSession } from './useSession';

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

export function useUserStats() {
  const { userId } = useSession();
  const [stats, setStats] = React.useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [networkError, setNetworkError] = React.useState(false);

  const refetch = React.useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const data = await apiFetch<UserStats>('/api/me/stats', { userId });
      setStats(data);
      setNetworkError(false);
    } catch (e) {
      if (isNetworkError(e)) {
        setNetworkError(true);
      }
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  React.useEffect(() => {
    if (userId) void refetch();
  }, [userId, refetch]);

  return {
    userId,
    stats,
    isLoading,
    networkError,
    refetch,
  };
}
