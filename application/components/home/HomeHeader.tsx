import { ThemedText } from '@/components/themed-text';
import { Avatar } from '@/components/ui/Avatar';
import { CoinDisplay } from '@/components/ui/CoinDisplay';
import { useAppTheme } from '@/hooks/useTheme';
import React from 'react';
import { Pressable, StyleSheet, View, type ViewStyle } from 'react-native';

type HomeHeaderProps = {
  name: string;
  greeting?: string;
  coins: number;
  avatarUri?: string;
  style?: ViewStyle;
  onLogoPress?: () => void;
};

export function HomeHeader({
  name,
  greeting = 'Good Afternoon',
  coins,
  avatarUri,
  style,
  onLogoPress,
}: HomeHeaderProps) {
  const { colors } = useAppTheme();

  return (
    <View style={[styles.container, style]}>
      <View style={styles.left}>
        <Pressable
          onPress={onLogoPress}
          disabled={!onLogoPress}
          style={({ pressed }) => [styles.logoPressable, pressed && styles.logoPressed]}
          accessibilityRole="button"
          accessibilityLabel="Open settings"
        >
          <View style={[styles.avatarRing, { borderColor: colors.ring }]}>
            <Avatar size={36} uri={avatarUri} name={name} />
          </View>
        </Pressable>
        <View style={styles.nameBlock}>
          <ThemedText className="text-[10px] uppercase tracking-widest text-textMuted">
            {greeting}
          </ThemedText>
          <ThemedText className="text-base font-semibold">{name}</ThemedText>
        </View>
      </View>

      <View
        style={[
          styles.coinContainer,
          { backgroundColor: colors.surfaceAlt, borderColor: colors.border },
        ]}
      >
        <CoinDisplay value={coins} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 16,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarRing: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameBlock: {
    marginLeft: 12,
  },
  logoPressable: {
    borderRadius: 24,
  },
  logoPressed: {
    transform: [{ scale: 0.98 }],
  },
  coinContainer: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
});
