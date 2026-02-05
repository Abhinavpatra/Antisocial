import React from 'react';

import { getOrCreateDevUserId } from '@/services/session';

export function useSession() {
  const [userId, setUserId] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const id = await getOrCreateDevUserId();
        if (!cancelled) setUserId(id);
      } catch (e) {
        if (!cancelled) setError(e as Error);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { userId, isLoading, error };
}

