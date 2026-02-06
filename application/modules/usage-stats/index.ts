import { requireNativeModule } from 'expo-modules-core';
import { Platform } from 'react-native';

export interface UsageApp {
  packageName: string;
  totalTimeInForeground: number;
  lastTimeUsed: number;
  appName: string | null;
}

interface UsageStatsNativeModule {
  checkUsageAccess(): Promise<boolean>;
  openUsageAccessSettings(): Promise<void>;
  getUsageStats(range: string): Promise<UsageApp[]>;
}

let nativeModule: UsageStatsNativeModule | null = null;

if (Platform.OS === 'android') {
  try {
    nativeModule = requireNativeModule<UsageStatsNativeModule>('UsageStats');
  } catch {
    // Module not available (e.g., running in Expo Go without a native build)
  }
}

/** Whether the native module was successfully loaded */
export const isAvailable = nativeModule !== null;

/** Returns true if the app has PACKAGE_USAGE_STATS access. Always false on non-Android. */
export async function checkUsageAccess(): Promise<boolean> {
  if (!nativeModule) return false;
  return nativeModule.checkUsageAccess();
}

/** Opens Settings > Usage Access so the user can grant the permission. No-op on non-Android. */
export async function openUsageAccessSettings(): Promise<void> {
  if (!nativeModule) return;
  return nativeModule.openUsageAccessSettings();
}

/**
 * Queries real per-app usage from Android UsageStatsManager.
 * Returns an empty array on non-Android or if the module isn't available.
 */
export async function getUsageStats(range: 'day' | 'week' = 'day'): Promise<UsageApp[]> {
  if (!nativeModule) return [];
  return nativeModule.getUsageStats(range);
}
