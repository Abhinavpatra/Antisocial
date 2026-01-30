import { ThemedText } from '@/components/themed-text';
import { useAppTheme } from '@/hooks/useTheme';
import React from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';

type ActiveFocusCardProps = {
  title: string;
  subtitle: string;
  timeLabel: string;
  remainingLabel: string;
  icon?: React.ReactNode;
  style?: ViewStyle;
};

export function ActiveFocusCard({
  title,
  subtitle,
  timeLabel,
  remainingLabel,
  icon,
  style,
}: ActiveFocusCardProps) {
  const { colors } = useAppTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surfaceAlt,
          borderColor: colors.border,
        },
        style,
      ]}
    >
      <View style={styles.left}>
        <View
          style={[
            styles.iconWrap,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          {icon}
        </View>
        <View>
          <ThemedText className="text-base font-semibold">{title}</ThemedText>
          <ThemedText className="text-xs text-textMuted">{subtitle}</ThemedText>
        </View>
      </View>
      <View style={styles.right}>
        <ThemedText className="text-sm font-bold">{timeLabel}</ThemedText>
        <ThemedText className="text-[10px] text-textMuted">{remainingLabel}</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  right: {
    alignItems: 'flex-end',
  },
});
