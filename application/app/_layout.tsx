import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { usePermissions } from '@/hooks/usePermissions';
import { AppThemeProvider, useAppTheme } from '@/hooks/useTheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { type AppStateStatus, Platform, View, ActivityIndicator } from 'react-native';
import { AppState } from 'react-native';
import 'react-native-reanimated';
import './global.css'; // just needed to be imported here to work with nativewind
import * as SecureStore from 'expo-secure-store';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

const ONBOARDING_COMPLETE_KEY = 'timerapp.onboardingComplete';

async function isOnboardingComplete(): Promise<boolean> {
  try {
    const value = await SecureStore.getItemAsync(ONBOARDING_COMPLETE_KEY);
    return value === 'true';
  } catch {
    return false;
  }
}

async function setOnboardingComplete(): Promise<void> {
  try {
    await SecureStore.setItemAsync(ONBOARDING_COMPLETE_KEY, 'true');
  } catch {
    // ignore
  }
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppThemeProvider>
        <RootNavigation />
      </AppThemeProvider>
    </GestureHandlerRootView>
  );
}

function RootNavigation() {
  const { theme, colors } = useAppTheme();
  const { hasUsageAccess, requestUsageStatsPermission, recheckPermissions, isNativeAvailable } = usePermissions();
  const [prompted, setPrompted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showPermissionPrompt, setShowPermissionPrompt] = useState(false);
  const appState = useRef(AppState.currentState);

  // Check onboarding status on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const complete = await isOnboardingComplete();
        if (!cancelled) {
          if (!complete) {
            setShowOnboarding(true);
          } else if (Platform.OS === 'android' && !hasUsageAccess && isNativeAvailable) {
            // Onboarding complete but no permission - show permission prompt
            setShowPermissionPrompt(true);
          }
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [hasUsageAccess, isNativeAvailable]);

  // Re-check permissions when returning from system Settings
  const handleAppStateChange = useCallback(
    (nextState: AppStateStatus) => {
      if (appState.current.match(/inactive|background/) && nextState === 'active') {
        void recheckPermissions();
      }
      appState.current = nextState;
    },
    [recheckPermissions],
  );

  useEffect(() => {
    const sub = AppState.addEventListener('change', handleAppStateChange);
    return () => sub.remove();
  }, [handleAppStateChange]);

  // Loading state
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // Show onboarding if not complete
  if (showOnboarding) {
    return (
      <ThemeProvider value={theme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider value={theme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        <Stack.Screen name="settings" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
