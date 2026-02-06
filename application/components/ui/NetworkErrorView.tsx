import { ThemedText } from '@/components/themed-text';
import { useAppTheme } from '@/hooks/useTheme';
import { FontAwesome5 } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

interface Props {
  message?: string;
  onRetry?: () => void;
}

export function NetworkErrorView({ message, onRetry }: Props) {
  const { colors } = useAppTheme();

  return (
    <View style={styles.container}>
      <View style={[styles.iconCircle, { backgroundColor: colors.surfaceAlt }]}>
        <FontAwesome5 name="wifi" size={28} color={colors.textMuted} />
      </View>
      <ThemedText className="text-lg font-semibold" style={styles.title}>
        Unable to connect
      </ThemedText>
      <ThemedText className="text-sm text-textMuted" style={styles.subtitle}>
        {message ?? 'Check your internet connection or try again later.'}
      </ThemedText>
      {onRetry && (
        <Pressable
          style={({ pressed }) => [
            styles.retryButton,
            { backgroundColor: colors.primary, opacity: pressed ? 0.8 : 1 },
          ]}
          onPress={onRetry}
        >
          <FontAwesome5 name="redo" size={12} color={colors.text} />
          <ThemedText className="text-sm font-semibold" style={{ color: colors.text }}>
            Retry
          </ThemedText>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingBottom: 60,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
});
