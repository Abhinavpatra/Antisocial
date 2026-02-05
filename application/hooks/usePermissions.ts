/* eslint-disable react-native/split-platform-components */

import * as SecureStore from 'expo-secure-store';
import { useCallback, useEffect, useState } from 'react';
import { Linking, NativeModules, PermissionsAndroid, Platform } from 'react-native';

const CACHE_KEY = 'timerapp.permissions';

export function usePermissions() {
  const [hasNotificationPermission, setHasNotificationPermission] = useState(false);
  const [hasUsageAccess, setHasUsageAccess] = useState(false);

  const checkUsageAccess = useCallback(async () => {
    if (Platform.OS !== 'android') {
      return true;
    }

    const module = NativeModules.UsageStatsModule || NativeModules.AppUsageStats;
    if (module?.checkUsageAccess) {
      const granted = await module.checkUsageAccess();
      return Boolean(granted);
    }
    return false;
  }, []);

  const checkPermissions = useCallback(async () => {
    let usageAccess = hasUsageAccess;
    let notificationPermission = hasNotificationPermission;

    if (Platform.OS === 'android') {
      try {
        usageAccess = await checkUsageAccess();

        // Notification Permission (Android 13+)
        if (Platform.Version >= 33) {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          );
          notificationPermission = granted === PermissionsAndroid.RESULTS.GRANTED;
        } else {
          notificationPermission = true;
        }
      } catch (err) {
        console.warn(err);
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
        JSON.stringify({
          hasNotificationPermission: notificationPermission,
          hasUsageAccess: usageAccess,
        }),
      );
    } catch {
      // ignore
    }
  }, [checkUsageAccess, hasNotificationPermission, hasUsageAccess]);

  useEffect(() => {
    // fast hydrate
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

  const requestUsageStatsPermission = async () => {
    if (Platform.OS === 'android') {
      // Fallback to standard settings
      Linking.openSettings();
    }
  };

  return {
    hasNotificationPermission,
    hasUsageAccess,
    requestUsageStatsPermission,
  };
}
