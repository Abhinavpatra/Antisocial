import { Tabs } from 'expo-router';
import React, { useCallback, useMemo, useRef, useState } from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { DrawerNavigator } from '@/components/navigation/DrawerNavigator';
import { PagerTabs } from '@/components/navigation/PagerTabs';
import { SettingsDrawer } from '@/components/navigation/SettingsDrawer';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { StyleSheet, View } from 'react-native';
import PagerView from 'react-native-pager-view';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const pagerRef = useRef<PagerView | null>(null);

  const routeIndexMap = useMemo(
    () => ({
      index: 0,
      rank: 1,
      challenges: 2,
      search: 3,
      profile: 4,
    }),
    []
  );

  const handleTabPress = useCallback(
    (routeKey: keyof typeof routeIndexMap) => {
      const nextIndex = routeIndexMap[routeKey];
      setCurrentIndex(nextIndex);
      pagerRef.current?.setPage(nextIndex);
    },
    [routeIndexMap]
  );

  return (
    <>
      <DrawerNavigator onOpenSettings={() => setIsSettingsOpen(true)}>
        <View style={StyleSheet.absoluteFill}>
          <PagerTabs
            initialIndex={0}
            currentIndex={currentIndex}
            onIndexChange={setCurrentIndex}
            onPagerRef={(ref) => {
              pagerRef.current = ref;
            }}
          />
        </View>
        <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
          <Tabs
            screenOptions={{
              sceneStyle: {
                backgroundColor: 'transparent',
                position: 'absolute',
                width: 0,
                height: 0,
                opacity: 0,
              },
              tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
              headerShown: false,
              tabBarButton: HapticTab,
              tabBarStyle: {
                backgroundColor: 'transparent', // Optional: if we want glass effect
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                elevation: 0,
                borderTopWidth: 0,
              },
              tabBarBackground: () => (
                <View
                  style={[
                    StyleSheet.absoluteFill,
                    { backgroundColor: Colors[colorScheme ?? 'light'].background, opacity: 0.9 },
                  ]}
                />
              ),
            }}>
          <Tabs.Screen
            name="index"
            options={{
              title: 'Home',
              tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
            }}
            listeners={{
              tabPress: (event) => {
                event.preventDefault();
                handleTabPress('index');
              },
            }}
          />
          <Tabs.Screen
            name="rank"
            options={{
              title: 'Rank',
              tabBarIcon: ({ color }) => (
                <IconSymbol size={28} name="chart.bar.fill" color={color} />
              ),
            }}
            listeners={{
              tabPress: (event) => {
                event.preventDefault();
                handleTabPress('rank');
              },
            }}
          />
          <Tabs.Screen
            name="challenges"
            options={{
              title: 'Challenges',
              tabBarIcon: ({ color }) => <IconSymbol size={28} name="trophy.fill" color={color} />,
            }}
            listeners={{
              tabPress: (event) => {
                event.preventDefault();
                handleTabPress('challenges');
              },
            }}
          />
          <Tabs.Screen
            name="search"
            options={{
              title: 'Search',
              tabBarIcon: ({ color }) => (
                <IconSymbol size={28} name="magnifyingglass" color={color} />
              ),
            }}
            listeners={{
              tabPress: (event) => {
                event.preventDefault();
                handleTabPress('search');
              },
            }}
          />
            <Tabs.Screen
              name="profile"
              options={{
                title: 'Profile',
                tabBarIcon: ({ color }) => (
                  <IconSymbol size={28} name="person.fill" color={color} />
                ),
              }}
              listeners={{
                tabPress: (event) => {
                  event.preventDefault();
                  handleTabPress('profile');
                },
              }}
            />
          </Tabs>
        </View>
      </DrawerNavigator>
      <SettingsDrawer isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  );
}

const styles = StyleSheet.create({});
