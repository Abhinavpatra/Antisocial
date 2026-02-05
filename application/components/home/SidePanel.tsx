import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AppColors, ThemeName } from '@/constants/colors';
import { useAppTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { Pressable, StyleSheet, useColorScheme, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SidePanel({ isOpen, onClose }: SidePanelProps) {
  const { colors, setMode, mode } = useAppTheme();
  const translateX = useSharedValue(-300);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (isOpen) {
      translateX.value = withSpring(0, { damping: 20, stiffness: 90 });
      opacity.value = withTiming(0.5);
    } else {
      translateX.value = withTiming(-300, { duration: 300 });
      opacity.value = withTiming(0);
    }
  }, [isOpen, opacity, translateX]);

  const panelStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  if (!isOpen && translateX.value === -300) return null;

  return (
    <>
      {isOpen && <Animated.View style={[styles.backdrop, backdropStyle]} onTouchEnd={onClose} />}
      <Animated.View style={[styles.panel, { backgroundColor: colors.surface }, panelStyle]}>
        <View style={styles.header}>
          <ThemedText type="subtitle">UI Colour Spec</ThemedText>
          <Pressable onPress={onClose}>
            <Ionicons name="close" size={24} color={colors.text} />
          </Pressable>
        </View>

        <View style={styles.content}>
          <ThemedText style={styles.sectionTitle}>Dual Choices</ThemedText>

          <View style={styles.colorStripContainer}>
            <ThemedText style={styles.label}>Background & Main</ThemedText>
            <View style={styles.colorStrip}>
              <View style={[styles.swatch, { backgroundColor: '#000000' }]} />
              <View style={[styles.swatch, { backgroundColor: AppColors.dark.primary }]} />
            </View>
          </View>

          <View style={styles.themeToggle}>
            <ThemedText>Mode: {mode === 'system' ? 'System' : mode}</ThemedText>
            <View style={styles.toggleRow}>
              <Pressable
                onPress={() => setMode('light')}
                style={[
                  styles.modeBtn,
                  mode === 'light' && { borderColor: colors.primary, borderWidth: 1 },
                ]}>
                <ThemedText style={{ fontSize: 12 }}>Light</ThemedText>
              </Pressable>
              <Pressable
                onPress={() => setMode('dark')}
                style={[
                  styles.modeBtn,
                  mode === 'dark' && { borderColor: colors.primary, borderWidth: 1 },
                ]}>
                <ThemedText style={{ fontSize: 12 }}>Dark</ThemedText>
              </Pressable>
            </View>
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
    left: 0,
    top: 0,
    bottom: 0,
    width: 280,
    paddingTop: 60,
    paddingHorizontal: 20,
    zIndex: 101,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  content: {
    gap: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  colorStripContainer: {
    gap: 8,
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    opacity: 0.7,
  },
  colorStrip: {
    flexDirection: 'row',
    height: 40,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#333',
  },
  swatch: {
    flex: 1,
  },
  themeToggle: {
    gap: 10,
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 10,
  },
  modeBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(120,120,120,0.1)',
    borderRadius: 6,
  },
});
