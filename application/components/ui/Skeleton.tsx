import { useAppTheme } from '@/hooks/useTheme';
import React from 'react';
import { View, StyleSheet, type ViewStyle, type DimensionValue } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  interpolate,
} from 'react-native-reanimated';

type SkeletonProps = {
  width?: DimensionValue;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
};

export function Skeleton({ width = '100%', height = 20, borderRadius = 8, style }: SkeletonProps) {
  const { colors } = useAppTheme();
  const shimmer = useSharedValue(0);

  React.useEffect(() => {
    shimmer.value = withRepeat(withTiming(1, { duration: 1000 }), -1, true);
  }, [shimmer]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(shimmer.value, [0, 1], [0.4, 0.8]),
  }));

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width: width as DimensionValue,
          height,
          borderRadius,
          backgroundColor: colors.surfaceAlt,
        },
        animatedStyle,
        style,
      ]}
    />
  );
}

export function StatCardSkeleton() {
  return (
    <View style={styles.statCard}>
      <Skeleton width={40} height={14} borderRadius={4} />
      <Skeleton width={60} height={24} borderRadius={6} style={{ marginTop: 8 }} />
    </View>
  );
}

export function FocusRingSkeleton() {
  return (
    <View style={styles.focusRing}>
      <Skeleton width={180} height={180} borderRadius={90} />
      <View style={styles.focusRingContent}>
        <Skeleton width={80} height={32} borderRadius={8} />
      </View>
    </View>
  );
}

export function ChallengeCardSkeleton() {
  return (
    <View style={styles.challengeCard}>
      <Skeleton width="100%" height={112} borderRadius={18} />
      <View style={styles.challengeBody}>
        <Skeleton width="70%" height={16} borderRadius={4} />
        <Skeleton width="100%" height={12} borderRadius={4} style={{ marginTop: 8 }} />
        <View style={styles.challengeFooter}>
          <Skeleton width={50} height={12} borderRadius={4} />
          <Skeleton width={24} height={24} borderRadius={12} />
        </View>
      </View>
    </View>
  );
}

export function LeaderboardRowSkeleton() {
  return (
    <View style={styles.leaderboardRow}>
      <Skeleton width={20} height={14} borderRadius={4} />
      <Skeleton width={34} height={34} borderRadius={17} />
      <View style={styles.leaderboardInfo}>
        <Skeleton width={100} height={14} borderRadius={4} />
        <Skeleton width={60} height={12} borderRadius={4} style={{ marginTop: 4 }} />
      </View>
      <Skeleton width={40} height={14} borderRadius={4} />
    </View>
  );
}

export function FriendCardSkeleton() {
  return (
    <View style={styles.friendCard}>
      <Skeleton width={44} height={44} borderRadius={22} />
      <View style={styles.friendInfo}>
        <Skeleton width={120} height={16} borderRadius={4} />
        <Skeleton width={80} height={12} borderRadius={4} style={{ marginTop: 4 }} />
      </View>
      <Skeleton width={60} height={36} borderRadius={18} />
    </View>
  );
}

const styles = StyleSheet.create({
  skeleton: {},
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 20,
    alignItems: 'center',
  },
  focusRing: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  focusRingContent: {
    position: 'absolute',
    alignItems: 'center',
  },
  challengeCard: {
    width: 220,
    borderRadius: 18,
    overflow: 'hidden',
  },
  challengeBody: {
    padding: 12,
    gap: 6,
  },
  challengeFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
  },
  leaderboardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  leaderboardInfo: {
    flex: 1,
  },
  friendCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 20,
  },
  friendInfo: {
    flex: 1,
  },
});
