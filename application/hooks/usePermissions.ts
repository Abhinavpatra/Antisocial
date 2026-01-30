import { useEffect, useState } from 'react';
import { Linking, NativeModules, PermissionsAndroid, Platform } from 'react-native';

export function usePermissions() {
  const [hasNotificationPermission, setHasNotificationPermission] = useState(false);
  const [hasUsageAccess, setHasUsageAccess] = useState(false);

  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        await checkUsageAccess();
        // Notification Permission (Android 13+)
        if (Platform.Version >= 33) {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
          );
          setHasNotificationPermission(granted === PermissionsAndroid.RESULTS.GRANTED);
        } else {
          setHasNotificationPermission(true);
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const checkUsageAccess = async () => {
    if (Platform.OS !== 'android') {
      setHasUsageAccess(true);
      return;
    }

    const module = NativeModules.UsageStatsModule || NativeModules.AppUsageStats;
    if (module?.checkUsageAccess) {
      const granted = await module.checkUsageAccess();
      setHasUsageAccess(Boolean(granted));
    } else {
      setHasUsageAccess(false);
    }
  };

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
