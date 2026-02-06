import React from 'react';

import {
  type ChallengeRow,
  completeChallenge,
  createChallenge,
  forfeitChallenge,
  joinChallenge,
  listChallenges,
} from '@/services/challengesApi';
import { isNetworkError } from '@/utils/backend';
import { useSession } from './useSession';

export function useChallenges() {
  const { userId } = useSession();
  const [challenges, setChallenges] = React.useState<ChallengeRow[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);
  const [networkError, setNetworkError] = React.useState(false);

  const refetch = React.useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const data = await listChallenges({ userId, limit: 50 });
      setChallenges(data.challenges);
      setError(null);
      setNetworkError(false);
    } catch (e) {
      if (isNetworkError(e)) {
        setNetworkError(true);
      }
      setError(e as Error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  React.useEffect(() => {
    if (userId) void refetch();
  }, [userId, refetch]);

  const actions = React.useMemo(
    () => ({
      create: async (input: {
        title: string;
        description?: string | null;
        coin_reward?: number | null;
      }) => {
        if (!userId) return null;
        try {
          await createChallenge({ userId, ...input });
          await refetch();
          return true;
        } catch (e) {
          if (isNetworkError(e)) setNetworkError(true);
          return null;
        }
      },
      join: async (challengeId: string) => {
        if (!userId) return null;
        try {
          await joinChallenge({ userId, challengeId });
          await refetch();
          return true;
        } catch (e) {
          if (isNetworkError(e)) setNetworkError(true);
          return null;
        }
      },
      forfeit: async (challengeId: string) => {
        if (!userId) return null;
        try {
          await forfeitChallenge({ userId, challengeId });
          await refetch();
          return true;
        } catch (e) {
          if (isNetworkError(e)) setNetworkError(true);
          return null;
        }
      },
      complete: async (challengeId: string) => {
        if (!userId) return null;
        try {
          const res = await completeChallenge({ userId, challengeId });
          await refetch();
          return res;
        } catch (e) {
          if (isNetworkError(e)) setNetworkError(true);
          return null;
        }
      },
    }),
    [refetch, userId],
  );

  return { userId, challenges, isLoading, error, networkError, refetch, actions };
}
