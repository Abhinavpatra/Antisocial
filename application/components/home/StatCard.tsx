import { ThemedText } from '@/components/themed-text';
import { useAppTheme } from '@/hooks/useTheme';
import React from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';

type StatCardProps = {
  label: string;
  value: string;
  icon?: React.ReactNode;
  style?: ViewStyle;
};

export function StatCard({ label, value, icon, style }: StatCardProps) {
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
      <View style={styles.headerRow}>
        {icon}
        <ThemedText className="text-[11px] uppercase tracking-widest text-textMuted">
          {label}
        </ThemedText>
      </View>
      <ThemedText className="text-xl font-bold">{value}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
});
