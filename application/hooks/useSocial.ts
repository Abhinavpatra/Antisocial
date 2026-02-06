import React from 'react';

import { isNetworkError } from '@/utils/backend';
import { useSession } from './useSession';
import {
  getFriendRequests,
  getFriends,
  getLeaderboard,
  requestFriend,
  respondToFriendRequest,
  searchUsers,
  type LeaderboardRow,
  type PublicProfile,
} from '@/services/socialApi';

export function useUserSearch() {
  const { userId } = useSession();
  const [query, setQuery] = React.useState('');
  const [results, setResults] = React.useState<PublicProfile[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);
  const [networkError, setNetworkError] = React.useState(false);

  const run = React.useCallback(
    async (q: string) => {
      if (!userId) return;
      const trimmed = q.trim();
      setQuery(q);
      if (!trimmed) {
        setResults([]);
        return;
      }
      setIsLoading(true);
      try {
        const data = await searchUsers({ userId, q: trimmed, limit: 20 });
        setResults(data.users);
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
    },
    [userId],
  );

  return { userId, query, setQuery: run, results, isLoading, error, networkError };
}

export function useFriends() {
  const { userId } = useSession();
  const [friends, setFriends] = React.useState<PublicProfile[]>([]);
  const [incoming, setIncoming] = React.useState<
    { user_id: string; username: string | null; display_name: string | null; avatar_url: string | null; created_at: string }[]
  >([]);
  const [outgoing, setOutgoing] = React.useState<
    { user_id: string; username: string | null; display_name: string | null; avatar_url: string | null; created_at: string }[]
  >([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [networkError, setNetworkError] = React.useState(false);

  const refetch = React.useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const [f, r] = await Promise.all([getFriends({ userId }), getFriendRequests({ userId })]);
      setFriends(f.friends);
      setIncoming(r.incoming);
      setOutgoing(r.outgoing);
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

  const actions = React.useMemo(
    () => ({
      request: async (to_user_id: string) => {
        if (!userId) return;
        try {
          await requestFriend({ userId, to_user_id });
          await refetch();
        } catch (e) {
          if (isNetworkError(e)) setNetworkError(true);
        }
      },
      accept: async (requester_user_id: string) => {
        if (!userId) return;
        try {
          await respondToFriendRequest({ userId, requester_user_id, action: 'accept' });
          await refetch();
        } catch (e) {
          if (isNetworkError(e)) setNetworkError(true);
        }
      },
      decline: async (requester_user_id: string) => {
        if (!userId) return;
        try {
          await respondToFriendRequest({ userId, requester_user_id, action: 'decline' });
          await refetch();
        } catch (e) {
          if (isNetworkError(e)) setNetworkError(true);
        }
      },
    }),
    [refetch, userId],
  );

  return { userId, friends, incoming, outgoing, isLoading, networkError, refetch, actions };
}

export function useLeaderboard() {
  const { userId } = useSession();
  const [scope, setScope] = React.useState<'friends' | 'global'>('friends');
  const [range, setRange] = React.useState<'day' | 'week'>('day');
  const [rows, setRows] = React.useState<LeaderboardRow[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [networkError, setNetworkError] = React.useState(false);

  const refetch = React.useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const data = await getLeaderboard({ userId, scope, range, limit: 50 });
      setRows(data.leaderboard);
      setNetworkError(false);
    } catch (e) {
      if (isNetworkError(e)) {
        setNetworkError(true);
      }
    } finally {
      setIsLoading(false);
    }
  }, [range, scope, userId]);

  React.useEffect(() => {
    if (userId) void refetch();
  }, [userId, refetch]);

  return { userId, scope, setScope, range, setRange, rows, isLoading, networkError, refetch };
}
