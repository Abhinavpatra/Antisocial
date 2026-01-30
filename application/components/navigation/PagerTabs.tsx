import { ChallengesScreen } from '@/screens/ChallengesScreen';
import { HomeScreen } from '@/screens/HomeScreen';
import { ProfileScreen } from '@/screens/ProfileScreen';
import { RankScreen } from '@/screens/RankScreen';
import { SearchScreen } from '@/screens/SearchScreen';
import { type Href, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef } from 'react';
import { StyleSheet } from 'react-native';
import PagerView, {
  type PagerViewOnPageScrollEvent,
  type PagerViewOnPageScrollStateChangedEvent,
  type PagerViewOnPageSelectedEvent,
} from 'react-native-pager-view';

type PagerTabsProps = {
  initialIndex: number;
  currentIndex: number;
  onIndexChange: (index: number) => void;
  onPagerRef?: (ref: PagerView | null) => void;
};

const routes: Href[] = [
  '/(tabs)',
  '/(tabs)/rank',
  '/(tabs)/challenges',
  '/(tabs)/search',
  '/(tabs)/profile',
];

export function PagerTabs({
  initialIndex,
  currentIndex,
  onIndexChange,
  onPagerRef,
}: PagerTabsProps) {
  const router = useRouter();
  const pagerRef = useRef<PagerView>(null);
  const lastScrollPosition = useRef<{ position: number; offset: number }>({
    position: initialIndex,
    offset: 0,
  });
  const isDragging = useRef(false);

  useEffect(() => {
    pagerRef.current?.setPageWithoutAnimation(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    onPagerRef?.(pagerRef.current);
  }, [onPagerRef]);

  const setPageWithDuration = useCallback((index: number) => {
    pagerRef.current?.setPageAnimationDuration?.(220);
    pagerRef.current?.setPage(index);
  }, []);

  const handlePageSelected = (event: PagerViewOnPageSelectedEvent) => {
    const nextIndex = event.nativeEvent.position;
    const route = routes[nextIndex];
    if (route) {
      onIndexChange(nextIndex);
      router.replace(route);
    }
  };

  const handlePageScroll = (event: PagerViewOnPageScrollEvent) => {
    lastScrollPosition.current = {
      position: event.nativeEvent.position,
      offset: event.nativeEvent.offset,
    };
  };

  const handleScrollState = (event: PagerViewOnPageScrollStateChangedEvent) => {
    const state = event.nativeEvent.pageScrollState;
    if (state === 'dragging') {
      isDragging.current = true;
      return;
    }

    if (state === 'idle' && isDragging.current) {
      isDragging.current = false;
      const { position, offset } = lastScrollPosition.current;
      const progress = position + offset;
      const delta = progress - currentIndex;
      const shouldAdvance = Math.abs(delta) >= 0.25;
      const targetIndexRaw = shouldAdvance
        ? delta > 0
          ? currentIndex + 1
          : currentIndex - 1
        : currentIndex;
      const targetIndex = Math.max(0, Math.min(routes.length - 1, targetIndexRaw));

      if (targetIndex !== currentIndex) {
        setPageWithDuration(targetIndex);
      } else {
        pagerRef.current?.setPageWithoutAnimation(currentIndex);
      }
    }
  };

  return (
    <PagerView
      ref={pagerRef}
      style={styles.pager}
      initialPage={initialIndex}
      onPageSelected={handlePageSelected}
      onPageScroll={handlePageScroll}
      onPageScrollStateChanged={handleScrollState}
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
