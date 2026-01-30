import { useEffect, useState } from 'react';
import { UsageApp, UsageStatsService } from '@/services/UsageStatsService';

export function useUsage() {
  const [usageStats, setUsageStats] = useState<UsageApp[]>([]);
  const [totalTime, setTotalTime] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const stats = await UsageStatsService.getStats('day');
      setUsageStats(stats);
      setTotalTime(UsageStatsService.getTotalUsageTime(stats));
    } catch (e) {
      console.error(e);
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
