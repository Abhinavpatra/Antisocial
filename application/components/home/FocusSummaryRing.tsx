import { ThemedText } from '@/components/themed-text';
import { ProgressRing } from '@/components/ui/ProgressRing';
import React from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';

type FocusSummaryRingProps = {
  progress: number;
  timeLabel: string;
  subtitle?: string;
  style?: ViewStyle;
};

export function FocusSummaryRing({
  progress,
  timeLabel,
  subtitle = 'Focused Today',
  style,
}: FocusSummaryRingProps) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.ringWrap}>
        <ProgressRing progress={progress} size={240} strokeWidth={12} />
        <View style={styles.centerCopy}>
          <ThemedText className="text-3xl font-bold">{timeLabel}</ThemedText>
          <ThemedText className="text-xs text-textMuted">{subtitle}</ThemedText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerCopy: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
});
