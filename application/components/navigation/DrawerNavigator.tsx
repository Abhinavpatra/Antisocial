import { type Href, usePathname, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

type DrawerNavigatorProps = {
  children: React.ReactNode;
};

const tabOrder: Href[] = [
  '/(tabs)',
  '/(tabs)/rank',
  '/(tabs)/challenges',
  '/(tabs)/search',
  '/(tabs)/profile',
];

export function DrawerNavigator({ children }: DrawerNavigatorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const translateX = useSharedValue(0);

  const currentIndex = tabOrder.findIndex((route) =>
    route === '/(tabs)' ? pathname === '/' || pathname === '/(tabs)' : pathname === route,
  );

  const panGesture = Gesture.Pan()
    .activeOffsetX([-20, 20])
    .onUpdate((event) => {
      translateX.value = Math.max(-80, Math.min(80, event.translationX));
    })
    .onEnd((event) => {
      const isHome = currentIndex <= 0;
      const isLast = currentIndex >= tabOrder.length - 1;
      const moved = event.translationX;

      if (Math.abs(moved) > 50) {
        if (moved < 0 && !isLast && !isHome) {
          runOnJS(router.push)(tabOrder[currentIndex + 1]);
        } else if (moved > 0 && !isHome) {
          runOnJS(router.push)(tabOrder[currentIndex - 1]);
        }
      }

      translateX.value = withTiming(0, { duration: 220 });
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.container, animatedStyle]}>{children}</Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
