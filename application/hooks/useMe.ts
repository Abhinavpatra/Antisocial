import React from 'react';

import { apiFetch } from '@/utils/backend';
import { useSession } from './useSession';

export type MePayload = {
  userId: string;
  profile: {
    user_id: string;
    username: string | null;
    display_name: string | null;
    avatar_url: string | null;
    bio: string | null;
    is_private: boolean;
    created_at: string;
    updated_at: string;
  } | null;
  coins: number;
  badges: {
    key: string;
    title: string;
    description: string | null;
    icon: string | null;
    earned_at: string;
  }[];
  settings: {
    theme_mode: 'system' | 'light' | 'dark';
    palette: 'a' | 'b' | 'c' | 'd';
    created_at: string;
    updated_at: string;
  } | null;
};

export function useMe() {
  const { userId, isLoading: isSessionLoading, error: sessionError } = useSession();
  const [me, setMe] = React.useState<MePayload | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  const load = React.useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const data = await apiFetch<MePayload>('/api/me', { userId });
      setMe(data);
      setError(null);
    } catch (e) {
      setError(e as Error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  React.useEffect(() => {
    if (userId) void load();
  }, [userId, load]);

  return {
    userId,
    me,
    isLoading: isSessionLoading || isLoading,
    error: sessionError ?? error,
    refetch: load,
  };
}

