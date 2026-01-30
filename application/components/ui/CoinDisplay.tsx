import React, { useEffect, useRef } from 'react';
import { Animated, Text, View } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useAppTheme } from '@/hooks/useTheme';

type CoinDisplayProps = {
  value: number;
};

export function CoinDisplay({ value }: CoinDisplayProps) {
  const { colors } = useAppTheme();
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 1.08, duration: 120, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 120, useNativeDriver: true }),
    ]).start();
  }, [value, scale]);

  return (
    <Animated.View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        transform: [{ scale }],
      }}>
      <View
        style={{
          width: 28,
          height: 28,
          borderRadius: 14,
          backgroundColor: colors.primary,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <FontAwesome5 name="coins" size={14} color={colors.text} />
      </View>
      <Text style={{ color: colors.text, fontWeight: '700', fontSize: 16 }}>{value}</Text>
    </Animated.View>
  );
}
