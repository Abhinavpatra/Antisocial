import { Platform } from 'react-native';

import {
  checkUsageAccess as nativeCheckAccess,
  getUsageStats as nativeGetStats,
  isAvailable as nativeIsAvailable,
  type UsageApp,
} from '@/modules/usage-stats';

export type { UsageApp };

// Mock data used when the native module isn't available (Expo Go, web, iOS)
const MOCK_DATA: UsageApp[] = [
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

export const UsageStatsService = {
  /** True when the Kotlin native module is loaded (dev-build only, not Expo Go) */
  isNativeAvailable: nativeIsAvailable,

  /** Check whether PACKAGE_USAGE_STATS access is granted */
  checkAccess: async (): Promise<boolean> => {
    if (Platform.OS !== 'android' || !nativeIsAvailable) return false;
    return nativeCheckAccess();
  },

  /**
   * Fetch per-app usage stats.
   * - On a dev/production build with usage access: real data from UsageStatsManager.
   * - Otherwise: returns static mock data so the UI always renders.
   */
  getStats: async (duration: 'day' | 'week' = 'day'): Promise<UsageApp[]> => {
    if (Platform.OS === 'android' && nativeIsAvailable) {
      try {
        const hasAccess = await nativeCheckAccess();
        if (hasAccess) {
          const stats = await nativeGetStats(duration);
          if (stats.length > 0) return stats;
        }
      } catch (e) {
        console.warn('[UsageStatsService] Native call failed, falling back to mock:', e);
      }
    }
    // Fallback: return mock data so the UI is never empty
    return MOCK_DATA;
  },

  getTotalUsageTime: (stats: UsageApp[]) => {
    return stats.reduce((acc, curr) => acc + curr.totalTimeInForeground, 0);
  },
};
