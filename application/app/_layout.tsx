import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { usePermissions } from '@/hooks/usePermissions';
import { AppThemeProvider, useAppTheme } from '@/hooks/useTheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, AppState, type AppStateStatus, Platform } from 'react-native';
import 'react-native-reanimated';
import './global.css'; // just needed to be imported here to work with nativewind

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

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
  const { theme } = useAppTheme();
  const { hasUsageAccess, requestUsageStatsPermission, recheckPermissions } = usePermissions();
  const [prompted, setPrompted] = useState(false);
  const appState = useRef(AppState.currentState);

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

  // Prompt once if usage access is missing
  useEffect(() => {
    if (Platform.OS === 'android' && !hasUsageAccess && !prompted) {
      setPrompted(true);
      Alert.alert(
        'Usage Access Required',
        'To track your screen time accurately, please enable Usage Access for TimerApp in the next screen.',
        [
          { text: 'Later', style: 'cancel' },
          { text: 'Open Settings', onPress: () => void requestUsageStatsPermission() },
        ],
      );
    }
  }, [hasUsageAccess, prompted, requestUsageStatsPermission]);

  return (
    <ThemeProvider value={theme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
