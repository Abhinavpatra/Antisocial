import { type Href, usePathname, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

type DrawerNavigatorProps = {
  children: React.ReactNode;
  onOpenSettings?: () => void;
};

// Define order of tabs for continuous swipe
const tabOrder: Href[] = [
  '/(tabs)', // Home
  '/(tabs)/rank',
  '/(tabs)/challenges',
  '/(tabs)/search',
  '/(tabs)/profile',
];

export function DrawerNavigator({ children, onOpenSettings }: DrawerNavigatorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const translateX = useSharedValue(0);

  // Determine current index
  // Note: pathname might be '/' or '/index' depending on router version
  const currentIndex = tabOrder.findIndex((route) => {
    if (route === '/(tabs)')
      return pathname === '/' || pathname === '/(tabs)' || pathname === '/index';
    return pathname === route;
  });

  const panGesture = Gesture.Pan()
    .activeOffsetX([-20, 20]) // Only activate on horizontal movement
    .onUpdate((event) => {
      // Resistance effect
      translateX.value = event.translationX * 0.5;
    })
    .onEnd((event) => {
      const isHome = currentIndex <= 0 || currentIndex === -1; // Default to home if not found
      const isLast = currentIndex >= tabOrder.length - 1;
      const moved = event.translationX;

      // Threshold to trigger action
      if (Math.abs(moved) > 50) {
        if (moved < 0) {
          // Swipe Left (finger moves R<-L): Go to NEXT tab
          if (!isLast && currentIndex !== -1) {
            runOnJS(router.push)(tabOrder[currentIndex + 1]);
          }
        } else {
          // Swipe Right (finger moves L->R): Go to PREV tab OR Open Settings
          if (isHome) {
            // On Home, Swipe Right opens Settings
            if (onOpenSettings) {
              runOnJS(onOpenSettings)();
            }
          } else if (currentIndex !== -1) {
            // Not Home, go to previous tab
            runOnJS(router.push)(tabOrder[currentIndex - 1]);
          }
        }
      }

      // Reset position
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
