import * as SecureStore from 'expo-secure-store';
import React from 'react';

import { type PaletteName } from '@/constants/colors';
import { useAppTheme } from '@/hooks/useTheme';
import { getSettings, patchSettings, type UserSettings } from '@/services/settingsApi';
import { isNetworkError } from '@/utils/backend';
import { useSession } from './useSession';

const CACHE_KEY = 'timerapp.userSettings';

async function readCachedSettings(): Promise<Partial<UserSettings> | null> {
  try {
    const raw = await SecureStore.getItemAsync(CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Partial<UserSettings>;
  } catch {
    return null;
  }
}

async function writeCachedSettings(value: Partial<UserSettings>) {
  try {
    await SecureStore.setItemAsync(CACHE_KEY, JSON.stringify(value));
  } catch {
    // ignore
  }
}

export function useSettings() {
  const { userId } = useSession();
  const { mode, palette, setMode, setPalette } = useAppTheme();

  const [settings, setSettings] = React.useState<UserSettings | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [networkError, setNetworkError] = React.useState(false);

  // fast local hydrate
  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      const cached = await readCachedSettings();
      if (cancelled || !cached) return;
      if (cached.theme_mode) setMode(cached.theme_mode);
      if (cached.palette) setPalette(cached.palette as PaletteName);
    })();
    return () => {
      cancelled = true;
    };
  }, [setMode, setPalette]);

  const refetch = React.useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const res = await getSettings({ userId });
      if (res.settings) {
        setSettings(res.settings);
        setMode(res.settings.theme_mode);
        setPalette(res.settings.palette);
        await writeCachedSettings(res.settings);
      }
      setNetworkError(false);
    } catch (e) {
      if (isNetworkError(e)) {
        setNetworkError(true);
      }
      // Keep using cached settings – don't clear them
    } finally {
      setIsLoading(false);
    }
  }, [setMode, setPalette, userId]);

  React.useEffect(() => {
    if (userId) void refetch();
  }, [userId, refetch]);

  const update = React.useCallback(
    async (patch: Partial<Pick<UserSettings, 'theme_mode' | 'palette' | 'hide_all_usage' | 'app_visibility'>>) => {
      if (!userId) return null;

      // optimistic UI for theme/palette
      if (patch.theme_mode) setMode(patch.theme_mode);
      if (patch.palette) setPalette(patch.palette);

      try {
        const res = await patchSettings({ userId, patch });
        setSettings(res.settings);
        await writeCachedSettings(res.settings);
        setNetworkError(false);
        return res.settings;
      } catch (e) {
        if (isNetworkError(e)) {
          setNetworkError(true);
        }
        // Optimistic UI stays – user already sees the change locally
        return null;
      }
    },
    [setMode, setPalette, userId],
  );

  return {
    userId,
    settings,
    mode,
    palette,
    isLoading,
    networkError,
    refetch,
    update,
  };
}
