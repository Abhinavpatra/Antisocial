import { ChallengesScreen } from '@/screens/ChallengesScreen';
import { HomeScreen } from '@/screens/HomeScreen';
import { ProfileScreen } from '@/screens/ProfileScreen';
import { RankScreen } from '@/screens/RankScreen';
import { SearchScreen } from '@/screens/SearchScreen';
import { type Href, useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { StyleSheet } from 'react-native';
import PagerView, { type PagerViewOnPageSelectedEvent } from 'react-native-pager-view';

type PagerTabsProps = {
  initialIndex: number;
};

const routes: Href[] = [
  '/(tabs)',
  '/(tabs)/rank',
  '/(tabs)/challenges',
  '/(tabs)/search',
  '/(tabs)/profile',
];

export function PagerTabs({ initialIndex }: PagerTabsProps) {
  const router = useRouter();
  const pagerRef = useRef<PagerView>(null);

  useEffect(() => {
    pagerRef.current?.setPageWithoutAnimation(initialIndex);
  }, [initialIndex]);

  const handlePageSelected = (event: PagerViewOnPageSelectedEvent) => {
    const nextIndex = event.nativeEvent.position;
    const route = routes[nextIndex];
    if (route) {
      router.replace(route);
    }
  };

  return (
    <PagerView
      ref={pagerRef}
      style={styles.pager}
      initialPage={initialIndex}
      onPageSelected={handlePageSelected}
    >
      <HomeScreen key="home" />
      <RankScreen key="rank" />
      <ChallengesScreen key="challenges" />
      <SearchScreen key="search" />
      <ProfileScreen key="profile" />
    </PagerView>
  );
}

const styles = StyleSheet.create({
  pager: {
    flex: 1,
  },
});
