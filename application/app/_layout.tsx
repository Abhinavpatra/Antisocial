import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { usePermissions } from '@/hooks/usePermissions';
import { AppThemeProvider, useAppTheme } from '@/hooks/useTheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Alert, Platform } from 'react-native';
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
  const { hasUsageAccess, requestUsageStatsPermission } = usePermissions();
  const [prompted, setPrompted] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'android' && !hasUsageAccess && !prompted) {
      setPrompted(true);
      Alert.alert(
        'Permission Required',
        'To track screen time, please enable Usage Access for this app.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: requestUsageStatsPermission },
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
