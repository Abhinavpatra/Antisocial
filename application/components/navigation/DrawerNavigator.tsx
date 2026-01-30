import { usePathname } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

type DrawerNavigatorProps = {
  children: React.ReactNode;
  onOpenSettings?: () => void;
};

export function DrawerNavigator({ children, onOpenSettings }: DrawerNavigatorProps) {
  const pathname = usePathname();
  const translateX = useSharedValue(0);

  const isHome = pathname === '/' || pathname === '/(tabs)' || pathname === '/index';

  const panGesture = Gesture.Pan()
    .enabled(isHome)
    .activeOffsetX([30, 9999])
    .failOffsetX([-9999, -10])
    .onUpdate((event) => {
      translateX.value = Math.max(0, event.translationX * 0.3);
    })
    .onEnd((event) => {
      const moved = event.translationX;

      if (moved > 50 && onOpenSettings) {
        runOnJS(onOpenSettings)();
      }

      translateX.value = withTiming(0, { duration: 250 });
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
