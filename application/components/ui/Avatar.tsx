import { useAppTheme } from '@/hooks/useTheme';
import React from 'react';
import { Image, Text, View } from 'react-native';

type AvatarProps = {
  size?: number;
  uri?: string;
  name?: string;
};

export function Avatar({ size = 48, uri, name }: AvatarProps) {
  const { colors } = useAppTheme();
  const initials = name
    ? name
        .trim()
        .split(' ')
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join('')
    : '?';

  if (uri) {
    return <Image source={{ uri }} style={{ width: size, height: size, borderRadius: size / 2 }} />;
  }

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: colors.surfaceAlt,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text style={{ color: colors.text, fontWeight: '700' }}>{initials}</Text>
    </View>
  );
}
