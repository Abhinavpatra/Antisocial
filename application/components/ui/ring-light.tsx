import React, { useEffect, useRef } from 'react';
import { Animated, type ViewStyle } from 'react-native';
import { useAppTheme } from '@/hooks/useTheme';

type RingLightProps = {
  children: React.ReactNode;
  width?: number;
  radius?: number;
  style?: ViewStyle;
};

export function RingLight({ children, width = 2, radius = 999, style }: RingLightProps) {
  const { colors } = useAppTheme();
  const glow = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(glow, { toValue: 0.9, duration: 1200, useNativeDriver: false }),
        Animated.timing(glow, { toValue: 0.4, duration: 1200, useNativeDriver: false }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [glow]);

  return (
    <Animated.View
      style={[
        {
          borderWidth: width,
          borderRadius: radius,
          borderColor: colors.ring,
          shadowColor: colors.ring,
          shadowOpacity: glow,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 0 },
          elevation: 6,
          padding: width,
        },
        style,
      ]}>
      {children}
    </Animated.View>
  );
}
