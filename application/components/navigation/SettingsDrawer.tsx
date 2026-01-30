import { ThemedText } from '@/components/themed-text';
import { AppColors } from '@/constants/colors';
import { useAppTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

type SettingsDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function SettingsDrawer({ isOpen, onClose }: SettingsDrawerProps) {
  const { colors, setMode, mode } = useAppTheme();
  const translateX = useSharedValue(320);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (isOpen) {
      translateX.value = withSpring(0, { damping: 20, stiffness: 90 });
      opacity.value = withTiming(0.5, { duration: 200 });
    } else {
      translateX.value = withTiming(320, { duration: 260 });
      opacity.value = withTiming(0, { duration: 200 });
    }
  }, [isOpen]);

  const panelStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  if (!isOpen && translateX.value === 320) return null;

  return (
    <>
      {isOpen && <Animated.View style={[styles.backdrop, backdropStyle]} onTouchEnd={onClose} />}
      <Animated.View style={[styles.panel, { backgroundColor: colors.surface }, panelStyle]}>
        <View style={styles.header}>
          <ThemedText type="subtitle">Settings</ThemedText>
          <Pressable onPress={onClose}>
            <Ionicons name="close" size={22} color={colors.text} />
          </Pressable>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Dual Color Strip</ThemedText>
          <View style={styles.colorStrip}>
            <View style={[styles.swatch, { backgroundColor: '#000000' }]} />
            <View style={[styles.swatch, { backgroundColor: AppColors.dark.primary }]} />
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Quick Theme</ThemedText>
          <View style={styles.toggleRow}>
            <Pressable
              onPress={() => setMode('light')}
              style={[
                styles.modeBtn,
                mode === 'light' && { borderColor: colors.primary, borderWidth: 1 },
              ]}>
              <ThemedText style={styles.modeLabel}>Light</ThemedText>
            </Pressable>
            <Pressable
              onPress={() => setMode('dark')}
              style={[
                styles.modeBtn,
                mode === 'dark' && { borderColor: colors.primary, borderWidth: 1 },
              ]}>
              <ThemedText style={styles.modeLabel}>Dark</ThemedText>
            </Pressable>
          </View>
        </View>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
    zIndex: 100,
  },
  panel: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 300,
    paddingTop: 60,
    paddingHorizontal: 20,
    zIndex: 101,
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
  },
  section: {
    gap: 12,
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  colorStrip: {
    flexDirection: 'row',
    height: 44,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#333',
  },
  swatch: {
    flex: 1,
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 12,
  },
  modeBtn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    backgroundColor: 'rgba(120,120,120,0.1)',
    borderRadius: 8,
  },
  modeLabel: {
    fontSize: 12,
  },
});
