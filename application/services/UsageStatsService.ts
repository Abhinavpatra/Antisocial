// Mock service for Usage Stats
// In a real implementation, this would call a Native Module (Android UsageStatsManager)

export interface UsageApp {
  packageName: string;
  totalTimeInForeground: number; // milliseconds
  lastTimeUsed: number;
  appName?: string;
}

export const UsageStatsService = {
  getStats: async (duration: 'day' | 'week' = 'day'): Promise<UsageApp[]> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Mock Data
    const mockData: UsageApp[] = [
      {
        packageName: 'com.instagram.android',
        totalTimeInForeground: 1000 * 60 * 45,
        lastTimeUsed: Date.now(),
        appName: 'Instagram',
      },
      {
        packageName: 'com.google.android.youtube',
        totalTimeInForeground: 1000 * 60 * 120,
        lastTimeUsed: Date.now() - 3600000,
        appName: 'YouTube',
      },
      {
        packageName: 'com.whatsapp',
        totalTimeInForeground: 1000 * 60 * 25,
        lastTimeUsed: Date.now() - 1800000,
        appName: 'WhatsApp',
      },
    ];

    return mockData;
  },

  getTotalUsageTime: (stats: UsageApp[]) => {
    return stats.reduce((acc, curr) => acc + curr.totalTimeInForeground, 0);
  },
};
