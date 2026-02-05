import React from 'react';

import {
  type ChallengeRow,
  completeChallenge,
  createChallenge,
  forfeitChallenge,
  joinChallenge,
  listChallenges,
} from '@/services/challengesApi';
import { useSession } from './useSession';

export function useChallenges() {
  const { userId } = useSession();
  const [challenges, setChallenges] = React.useState<ChallengeRow[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  const refetch = React.useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const data = await listChallenges({ userId, limit: 50 });
      setChallenges(data.challenges);
      setError(null);
    } catch (e) {
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
        await createChallenge({ userId, ...input });
        await refetch();
        return true;
      },
      join: async (challengeId: string) => {
        if (!userId) return null;
        await joinChallenge({ userId, challengeId });
        await refetch();
        return true;
      },
      forfeit: async (challengeId: string) => {
        if (!userId) return null;
        await forfeitChallenge({ userId, challengeId });
        await refetch();
        return true;
      },
      complete: async (challengeId: string) => {
        if (!userId) return null;
        const res = await completeChallenge({ userId, challengeId });
        await refetch();
        return res;
      },
    }),
    [refetch, userId],
  );

  return { userId, challenges, isLoading, error, refetch, actions };
}

