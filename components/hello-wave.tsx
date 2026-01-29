import { useEffect } from 'react';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
} from 'react-native-reanimated';

export function HelloWave() {
  const rotationDegree = useSharedValue(0);

  useEffect(() => {
    rotationDegree.value = withRepeat(
      withSequence(
        withTiming(25, { duration: 150 }),
        withTiming(0, { duration: 150 })
      ),
      4
    );
  }, [rotationDegree]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotationDegree.value}deg` }],
  }));

  return (
    <Animated.Text
      className="text-3xl leading-8 -mt-1.5"
      style={animatedStyle}
    >
      👋
    </Animated.Text>
  );
}
