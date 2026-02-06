/* eslint-disable react-native/split-platform-components */

import * as SecureStore from 'expo-secure-store';
import { useCallback, useEffect, useState } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';

import {
  checkUsageAccess as nativeCheckAccess,
  isAvailable as nativeIsAvailable,
  openUsageAccessSettings as nativeOpenSettings,
} from '@/modules/usage-stats';

const CACHE_KEY = 'timerapp.permissions';

export function usePermissions() {
  const [hasNotificationPermission, setHasNotificationPermission] = useState(false);
  const [hasUsageAccess, setHasUsageAccess] = useState(false);

  // ── Check usage-access via native module (or cache) ────────────────
  const checkUsageAccess = useCallback(async (): Promise<boolean> => {
    if (Platform.OS !== 'android') return true;
    if (!nativeIsAvailable) return false;
    try {
      return await nativeCheckAccess();
    } catch {
      return false;
    }
  }, []);

  // ── Check all permissions ──────────────────────────────────────────
  const checkPermissions = useCallback(async () => {
    let usageAccess = false;
    let notificationPermission = false;

    if (Platform.OS === 'android') {
      try {
        usageAccess = await checkUsageAccess();

        // Notification permission (Android 13+)
        if (Platform.Version >= 33) {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          );
          notificationPermission = granted === PermissionsAndroid.RESULTS.GRANTED;
        } else {
          notificationPermission = true;
        }
      } catch (err) {
        console.warn('[usePermissions]', err);
      }
    } else {
      usageAccess = true;
      notificationPermission = true;
    }

    setHasUsageAccess(usageAccess);
    setHasNotificationPermission(notificationPermission);

    try {
      await SecureStore.setItemAsync(
        CACHE_KEY,
        JSON.stringify({ hasNotificationPermission: notificationPermission, hasUsageAccess: usageAccess }),
      );
    } catch {
      // ignore
    }
  }, [checkUsageAccess]);

  // Fast hydrate from cache, then do a real check
  useEffect(() => {
    (async () => {
      try {
        const raw = await SecureStore.getItemAsync(CACHE_KEY);
        if (!raw) return;
        const cached = JSON.parse(raw) as Partial<{
          hasNotificationPermission: boolean;
          hasUsageAccess: boolean;
        }>;
        if (typeof cached.hasNotificationPermission === 'boolean') {
          setHasNotificationPermission(cached.hasNotificationPermission);
        }
        if (typeof cached.hasUsageAccess === 'boolean') {
          setHasUsageAccess(cached.hasUsageAccess);
        }
      } catch {
        // ignore
      }
    })();
    void checkPermissions();
  }, [checkPermissions]);

  // ── Open the correct system settings page ──────────────────────────
  const requestUsageStatsPermission = useCallback(async () => {
    if (Platform.OS !== 'android') return;
    if (nativeIsAvailable) {
      try {
        await nativeOpenSettings();
      } catch {
        // Fallback if intent fails for some reason
        const { Linking } = await import('react-native');
        Linking.openSettings();
      }
    } else {
      // Native module not available (Expo Go) – open generic settings
      const { Linking } = await import('react-native');
      Linking.openSettings();
    }
  }, []);

  // Re-check after returning from settings
  const recheckPermissions = useCallback(async () => {
    const access = await checkUsageAccess();
    setHasUsageAccess(access);
    return access;
  }, [checkUsageAccess]);

  return {
    hasNotificationPermission,
    hasUsageAccess,
    /** Whether the native module is available (requires dev/production build) */
    isNativeAvailable: nativeIsAvailable,
    requestUsageStatsPermission,
    recheckPermissions,
    checkPermissions,
  };
}
