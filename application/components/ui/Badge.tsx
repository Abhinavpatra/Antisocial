import React from 'react';
import { Text, View } from 'react-native';
import { useAppTheme } from '@/hooks/useTheme';

type BadgeProps = {
  label: string;
};

export function Badge({ label }: BadgeProps) {
  const { colors } = useAppTheme();

  return (
    <View
      style={{
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 999,
        backgroundColor: colors.primary,
        borderWidth: 1,
        borderColor: colors.ring,
      }}>
      <Text style={{ color: colors.text, fontWeight: '700', fontSize: 12 }}>{label}</Text>
    </View>
  );
}
