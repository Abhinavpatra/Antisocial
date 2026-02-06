import React from 'react';

import { type UsageApp, UsageStatsService } from '@/services/UsageStatsService';
import { getUsageSummary, postUsageSession } from '@/services/usageApi';
import { useSession } from './useSession';

export function useUsage() {
  const { userId } = useSession();
  const [usageStats, setUsageStats] = React.useState<UsageApp[]>([]);
  const [totalTime, setTotalTime] = React.useState(0);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    void loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const loadData = async () => {
    setLoading(true);
    try {
      // 1) Always get device stats first (native or mock fallback)
      const stats = await UsageStatsService.getStats('day');
      setUsageStats(stats);
      const localTotal = UsageStatsService.getTotalUsageTime(stats);
      setTotalTime(localTotal);

      // 2) Best-effort backend sync – failures are silently caught
      if (userId) {
        try {
          const now = Date.now();
          await Promise.all(
            stats.map((s) =>
              postUsageSession({
                userId,
                app_package: s.packageName,
                started_at: new Date(now - s.totalTimeInForeground).toISOString(),
                ended_at: new Date(now).toISOString(),
                duration_ms: s.totalTimeInForeground,
              }),
            ),
          );

          // Prefer backend summary when available (source of truth for leaderboard)
          const summary = await getUsageSummary({ userId, range: 'day' });
          if (summary.totalDurationMs > 0) {
            setTotalTime(summary.totalDurationMs);
          }
        } catch {
          // Backend unreachable – keep local total, don't disrupt UI
        }
      }
    } catch (e) {
      console.error('[useUsage] Error loading data:', e);
    } finally {
      setLoading(false);
    }
  };

  // Format milliseconds to "4h 22m"
  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return {
    usageStats,
    totalTime,
    formattedTotalTime: formatTime(totalTime),
    loading,
    refresh: loadData,
  };
}
