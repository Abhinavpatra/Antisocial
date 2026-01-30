import { ThemedText } from '@/components/themed-text';
import { useAppTheme } from '@/hooks/useTheme';
import React from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';

type ProgressRowProps = {
  title: string;
  value: string;
  icon?: React.ReactNode;
  valueTone?: 'muted' | 'positive';
  style?: ViewStyle;
};

export function ProgressRow({ title, value, icon, valueTone = 'muted', style }: ProgressRowProps) {
  const { colors } = useAppTheme();
  const valueColor = valueTone === 'positive' ? '#22C55E' : colors.textMuted;

  return (
    <View style={[styles.row, style]}>
      <View style={styles.left}>
        <View
          style={[
            styles.iconWrap,
            {
              backgroundColor: colors.surfaceAlt,
              borderColor: colors.border,
            },
          ]}
        >
          {icon}
        </View>
        <ThemedText className="text-sm">{title}</ThemedText>
      </View>
      <ThemedText style={{ color: valueColor }} className="text-xs font-semibold">
        {value}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
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
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
